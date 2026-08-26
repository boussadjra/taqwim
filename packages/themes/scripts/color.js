/**
 * Colour maths for the contrast audit.
 *
 * Deliberately dependency-free: WCAG relative luminance is about twenty lines
 * of arithmetic, and this package ships no runtime dependencies at all.
 *
 * Plain ESM (not TS) for the same reason as `tokens.js` — the build script and
 * the tests both import it without a compile step.
 */

/** @typedef {{ r: number, g: number, b: number, a: number }} Rgba */

/** How many points to sample along each gradient segment. */
const GRADIENT_SAMPLES = 10

/** Values that resolve against the host page rather than to a colour. */
const UNRESOLVABLE = /^(transparent|inherit|currentcolor|initial|unset|revert|none)$/i

/**
 * Parses one solid colour.
 *
 * Handles `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, and both `rgb()` syntaxes —
 * legacy `rgb(0, 119, 190)` and the modern `rgb(0 119 190 / 0.6)` that most of
 * the themes use.
 *
 * @param {string} value
 * @returns {Rgba | null} null when the value is not a single solid colour
 */
export function parseColor(value) {
  const input = String(value).trim()

  const hex = input.match(/^#([0-9a-f]{3,8})$/i)
  if (hex) {
    let digits = hex[1]
    if (digits.length === 3 || digits.length === 4) {
      digits = [...digits].map(digit => digit + digit).join('')
    }
    if (digits.length !== 6 && digits.length !== 8) return null

    const int = Number.parseInt(digits.slice(0, 6), 16)
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
      a: digits.length === 8 ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1,
    }
  }

  const rgb = input.match(/^rgba?\(([^)]+)\)$/i)
  if (!rgb) return null

  const [channelPart, alphaPart] = rgb[1].split('/')
  const channels = channelPart
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
  if (channels.length < 3 || !channels.slice(0, 3).every(Number.isFinite)) return null

  const alpha = alphaPart === undefined ? (channels.length > 3 ? channels[3] : 1) : Number.parseFloat(alphaPart)

  return {
    r: channels[0],
    g: channels[1],
    b: channels[2],
    a: Number.isFinite(alpha) ? alpha : 1,
  }
}

/**
 * Every colour a CSS value can render as.
 *
 * A solid colour yields one sample. A gradient yields samples *along* each
 * segment, not just at its stops: text sits on the whole sweep, and an
 * intermediate point can be worse than either endpoint it lies between.
 *
 * @param {string} value
 * @returns {Rgba[] | null} null when the value resolves against the host page
 */
export function parseColorSamples(value) {
  const input = String(value).trim()
  if (!input || UNRESOLVABLE.test(input)) return null

  const solid = parseColor(input)
  if (solid) return [solid]

  if (!/gradient\(/i.test(input)) return null

  const stops = [...input.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)/gi)]
    .map(match => parseColor(match[0]))
    .filter(/** @returns {color is Rgba} */ color => color !== null)

  if (stops.length === 0) return null
  if (stops.length === 1) return stops

  const samples = []
  for (let i = 0; i < stops.length - 1; i++) {
    for (let step = 0; step <= GRADIENT_SAMPLES; step++) {
      samples.push(mix(stops[i], stops[i + 1], step / GRADIENT_SAMPLES))
    }
  }
  return samples
}

/**
 * Linear interpolation between two colours.
 *
 * In sRGB rather than a perceptual space, because that is what the browser
 * does for a `linear-gradient` in the default interpolation mode — the goal is
 * to reproduce what is painted, not what is theoretically nicer.
 *
 * @param {Rgba} from
 * @param {Rgba} to
 * @param {number} t
 * @returns {Rgba}
 */
function mix(from, to, t) {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t,
    a: from.a + (to.a - from.a) * t,
  }
}

/**
 * Composites a colour over an opaque backdrop (source-over).
 *
 * @param {Rgba} source
 * @param {Rgba} backdrop must be opaque
 * @returns {Rgba} always opaque
 */
export function composite(source, backdrop) {
  if (source.a >= 1) return { ...source, a: 1 }

  return {
    r: source.r * source.a + backdrop.r * (1 - source.a),
    g: source.g * source.a + backdrop.g * (1 - source.a),
    b: source.b * source.a + backdrop.b * (1 - source.a),
    a: 1,
  }
}

/**
 * WCAG 2.x relative luminance.
 *
 * @param {Rgba} color
 * @returns {number} 0 (black) to 1 (white)
 */
export function relativeLuminance(color) {
  const channel = value => {
    const srgb = value / 255
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b)
}

/**
 * WCAG 2.x contrast ratio. Both colours must already be opaque.
 *
 * @param {Rgba} a
 * @param {Rgba} b
 * @returns {number} 1 to 21
 */
export function contrastRatio(a, b) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Renders a colour for a failure message.
 *
 * @param {Rgba} color
 * @returns {string}
 */
export function formatColor(color) {
  const round = value => Math.round(value)
  return color.a >= 1
    ? `rgb(${round(color.r)} ${round(color.g)} ${round(color.b)})`
    : `rgb(${round(color.r)} ${round(color.g)} ${round(color.b)} / ${Number(color.a.toFixed(3))})`
}

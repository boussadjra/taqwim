<script setup lang="ts">
/**
 * Adapted from Vue Bits — https://vue-bits.dev (MIT), Animations/ClickSpark.
 *
 * Why it is here: the landing page's calendar sits under a row of controls, and
 * a reader's first click lands on a date whose only feedback is a small
 * `data-selected` change and a line of text further down. Several people read
 * that as "the demo is broken". A spark at the pointer says "that registered"
 * at the place the eye already is.
 *
 * Three changes from the published component, all deliberate:
 *
 * 1. The original runs `requestAnimationFrame` forever, from mount, whether or
 *    not a spark exists. That is a wake-up every frame for the life of the
 *    page. Here the loop starts on click and stops itself when the last spark
 *    dies.
 * 2. It ships Tailwind utility classes; this project has no Tailwind, so the
 *    two rules it needed are written out below.
 * 3. It has no reduced-motion branch. Sparks are pure decoration, so under
 *    `prefers-reduced-motion: reduce` none are drawn at all and no loop runs.
 *
 * It also listens on its parent rather than wrapping a slot: the thing being
 * clicked is an Astro island in one of five frameworks, and nesting those
 * inside a Vue slot is not worth the coupling.
 */
import { onBeforeUnmount, onMounted } from 'vue'

interface Props {
  /** Spark colour. Defaults to the brand teal. */
  sparkColor?: string
  /** Length of each spark line, in px. */
  sparkSize?: number
  /** How far the sparks travel from the click, in px. */
  sparkRadius?: number
  sparkCount?: number
  /** Lifetime of one spark, in ms. */
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  sparkColor: '#03adb7',
  sparkSize: 9,
  sparkRadius: 18,
  sparkCount: 8,
  duration: 420,
})

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

/*
 * A plain `ref`, and NOT `useTemplateRef`, which is what this would normally
 * be on Vue 3.5.
 *
 * React Fast Refresh treats any `use[A-Z]` identifier as a hook, so oxc
 * injects `var _s = $RefreshSig$()` at the top of the compiled SFC. That
 * helper only exists in the browser once the refresh preamble has run, and
 * Astro evaluates the same module during its dev SSR pass — where it is
 * undefined, and the page dies with `ReferenceError: $RefreshSig$ is not
 * defined` before anything renders. Production builds are unaffected; only
 * `astro dev` has Fast Refresh on.
 *
 * Scoping it away does not work. The React integration is already limited to
 * the demos/react directory by its `include`, and neither an `exclude` on the
 * integration nor `vite.oxc.jsxRefreshExclude` stops the transform reaching a
 * .vue file. So the rule is the plain one: no `use*` names in this project's
 * Vue or Svelte sources.
 */
let canvasRef: HTMLCanvasElement | null = null

function setCanvas(el: Element | null): void {
  canvasRef = el as HTMLCanvasElement | null
}

let sparks: Spark[] = []
let frame: number | null = null
let host: HTMLElement | null = null
let resizeObserver: ResizeObserver | null = null

/* ease-out quad: fast away from the pointer, settling at the edge. */
const ease = (t: number): number => t * (2 - t)

function resize(): void {
  const canvas = canvasRef
  if (!canvas || !host) return
  const { width, height } = host.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  // Backing store in device pixels, CSS box in layout pixels, so the 2px
  // strokes stay crisp on a high-density display instead of blurring.
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function draw(timestamp: number): void {
  const canvas = canvasRef
  const ctx = canvas?.getContext('2d')
  if (!ctx || !canvas) {
    frame = null
    return
  }

  const dpr = window.devicePixelRatio || 1
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)

  sparks = sparks.filter(spark => {
    const elapsed = timestamp - spark.startTime
    if (elapsed >= props.duration) return false

    const eased = ease(elapsed / props.duration)
    const distance = eased * props.sparkRadius
    const lineLength = props.sparkSize * (1 - eased)

    ctx.strokeStyle = props.sparkColor
    ctx.globalAlpha = 1 - eased
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(spark.x + distance * Math.cos(spark.angle), spark.y + distance * Math.sin(spark.angle))
    ctx.lineTo(
      spark.x + (distance + lineLength) * Math.cos(spark.angle),
      spark.y + (distance + lineLength) * Math.sin(spark.angle),
    )
    ctx.stroke()
    return true
  })

  ctx.globalAlpha = 1

  // The loop exists only while something is on screen.
  if (sparks.length > 0) {
    frame = requestAnimationFrame(draw)
  } else {
    frame = null
  }
}

function onClick(event: MouseEvent): void {
  const canvas = canvasRef
  if (!canvas) return

  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const now = performance.now()

  for (let i = 0; i < props.sparkCount; i++) {
    sparks.push({ x, y, angle: (2 * Math.PI * i) / props.sparkCount, startTime: now })
  }

  if (frame === null) frame = requestAnimationFrame(draw)
}

onMounted(() => {
  /*
   * Decoration only: no listeners, no loop. The canvas element itself still
   * renders — it is transparent and `pointer-events: none`, and nothing is
   * ever drawn on it. It must not be removed with `v-if`, because then the
   * island server-renders to a bare comment, `<astro-island>` gets a
   * zero-size box, and `client:visible`'s IntersectionObserver never fires,
   * so the component never mounts for anyone.
   */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  /*
   * `closest`, not `parentElement`. Astro wraps every island in an
   * `<astro-island>` custom element, which is unstyled and therefore
   * `display: inline` with a zero-height box — measuring that gave a 0x0
   * canvas and nothing was ever drawn. The element being decorated is the one
   * carrying `.has-click-spark`, which is also what `position: absolute`
   * resolves against.
   */
  host = canvasRef?.closest('.has-click-spark') ?? null
  if (!host) return

  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(host)
  host.addEventListener('click', onClick)
})

onBeforeUnmount(() => {
  if (frame !== null) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  host?.removeEventListener('click', onClick)
})
</script>

<template>
  <canvas :ref="setCanvas" class="click-spark" aria-hidden="true" />
</template>

<style>
/*
 * Global rather than scoped: the canvas covers a parent this component does
 * not own, so the parent needs `position: relative` too, and a scoped block
 * cannot reach it.
 */
.click-spark {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.has-click-spark {
  position: relative;
}
</style>

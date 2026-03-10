# Theme Showcase

This page demonstrates all available themes in the Taqwim Hijri Calendar system.

## Available Themes

### Brutalist Theme

A bold, minimalist design inspired by Gumroad's aesthetic.

```css
/* Brutalist Theme Variables */
:root {
  --primary: #000;
  --background: #fff;
  --accent: #ff6600;
  --text: #000;
  --border: #000;
}
```

**Features:**

- High contrast black and white design
- Bold typography with JetBrains Mono
- Sharp edges and minimal styling
- Orange accent colors

### Islamic Royal Green Theme

An elegant theme with soft green and gold accents.

```css
/* Islamic Royal Green Theme Variables */
:root {
  --primary: #2d5a4a;
  --background: #f8fbf9;
  --accent: #e6c18a;
  --text: #1a1a1a;
  --surface: #ffffff;
}
```

**Features:**

- Soft royal green primary colors
- Elegant gold accents
- Amiri font for Arabic text
- Sophisticated color palette

### Islamic Royal Purple Theme

A luxurious theme with purple and gold combinations.

```css
/* Islamic Royal Purple Theme Variables */
:root {
  --primary: #6d3a9e;
  --background: #faf9fc;
  --accent: #e6b547;
  --text: #1a1a1a;
  --surface: #ffffff;
}
```

**Features:**

- Rich purple primary colors
- Warm gold accents
- Premium typography
- Royal aesthetic

### Vercel-Inspired Theme

A modern, clean theme inspired by Vercel's design system.

```css
/* Vercel Theme Variables */
:root {
  --primary: #0070f3;
  --background: #fafafa;
  --accent: #7928ca;
  --text: #000;
  --surface: #ffffff;
}
```

**Features:**

- Clean, modern design
- Blue and purple gradients
- Minimal shadows and borders
- Tech-focused aesthetic

## Implementation Examples

### Basic Calendar Usage

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate">
    <HijriCalendarHeader>
      <HijriCalendarPrev>←</HijriCalendarPrev>
      <HijriCalendarHeading />
      <HijriCalendarNext>→</HijriCalendarNext>
    </HijriCalendarHeader>

    <HijriCalendarGrid>
      <HijriCalendarGridHead>
        <HijriCalendarGridRow>
          <HijriCalendarHeadCell v-for="day in weekDays" :key="day">
            {{ day }}
          </HijriCalendarHeadCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridHead>

      <HijriCalendarGridBody>
        <HijriCalendarGridRow v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <HijriCalendarGridCell v-for="day in week" :key="day.day" :date="day.date">
            <HijriCalendarCellTrigger :day="day.day" :month="day.month" :year="day.year">
              {{ day.day }}
            </HijriCalendarCellTrigger>
          </HijriCalendarGridCell>
        </HijriCalendarGridRow>
      </HijriCalendarGridBody>
    </HijriCalendarGrid>
  </HijriCalendarRoot>
</template>

<script setup>
import { ref } from 'vue'
import {
  HijriCalendarRoot,
  HijriCalendarHeader,
  HijriCalendarPrev,
  HijriCalendarNext,
  HijriCalendarHeading,
  HijriCalendarGrid,
  HijriCalendarGridHead,
  HijriCalendarGridBody,
  HijriCalendarGridRow,
  HijriCalendarHeadCell,
  HijriCalendarGridCell,
  HijriCalendarCellTrigger,
} from 'taqwim-vue'

const selectedDate = ref(null)
</script>
```

### Theme Switching

```vue
<template>
  <div>
    <select v-model="currentTheme" @change="applyTheme">
      <option value="brutalist">Brutalist</option>
      <option value="islamic-royal-green">Islamic Royal Green</option>
      <option value="islamic-royal-purple">Islamic Royal Purple</option>
      <option value="vercel">Vercel Inspired</option>
    </select>

    <div :class="`theme-${currentTheme}`">
      <!-- Your calendar components here -->
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const currentTheme = ref('brutalist')

const applyTheme = () => {
  document.documentElement.className = `theme-${currentTheme.value}`
}

watch(currentTheme, applyTheme, { immediate: true })
</script>
```

## Live Examples

For live interactive examples with all themes, visit the [Playground](/playground) section where you can:

- Switch between all available themes
- Interact with the calendar components
- See real-time theme changes
- Test different date selections
- Experience responsive design

## CSS Custom Properties

Each theme uses CSS custom properties for easy customization:

```css
/* Theme structure */
.theme-[name] {
  --primary: /* Primary color */;
  --background: /* Background color */;
  --surface: /* Surface/card color */;
  --accent: /* Accent color */;
  --text: /* Text color */;
  --text-muted: /* Muted text color */;
  --border: /* Border color */;
  --border-muted: /* Muted border color */;

  /* Calendar specific */
  --calendar-bg: /* Calendar background */;
  --calendar-cell-hover: /* Cell hover state */;
  --calendar-cell-selected: /* Selected cell */;
  --calendar-cell-today: /* Today indicator */;
}
```

## Accessibility Features

All themes maintain:

- WCAG AA color contrast ratios
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- Semantic HTML structure

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For the best experience, use a modern browser with CSS custom properties support.

# HijriCalendar Component

A flexible and comprehensive Hijri calendar component that supports both **styled pre-built themes** and **completely unstyled headless usage**.

## Quick Start

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { HijriCalendar } from '@your-org/taqwim-vue'

const selectedDate = ref({ hy: 1446, hm: 2, hd: 15 })
</script>

<template>
  <!-- Styled calendar with default theme -->
  <HijriCalendar v-model="selectedDate" theme="default" />

  <!-- Unstyled headless calendar -->
  <HijriCalendar v-model="selectedDate" :styled="false" />
</template>
```

## Features

- ✨ **Multiple Pre-built Themes**: Default, Dark, Modern, Islamic, Minimal
- 🎯 **Headless Mode**: Complete control when `styled="false"`
- 🎨 **CSS Variables**: Easy customization of any theme
- 🌐 **RTL Support**: Works perfectly with Arabic
- ♿ **Accessible**: Full keyboard navigation and ARIA support
- 📱 **Responsive**: Adapts to any screen size
- 🔧 **TypeScript**: Full type safety

## Approach

This component solves the common dilemma of **convenience vs. flexibility** by offering both:

### 1. Styled Pre-built Components (Quick Setup)

Perfect for rapid development with beautiful defaults:

```vue
<!-- Ready to use with just a few props -->
<HijriCalendar theme="islamic" size="large" dir="rtl" />
```

### 2. Unstyled Headless Components (Maximum Control)

Perfect when you need complete design control:

```vue
<!-- Bring your own styling -->
<HijriCalendar :styled="false" class="my-custom-calendar" />
```

### 3. Hybrid Approach (Best of Both)

Use themes but customize with CSS variables:

```vue
<HijriCalendar theme="modern" class="my-tweaks" />
```

```css
.my-tweaks {
  --hijri-calendar-primary: #your-brand-color;
  --hijri-calendar-border-radius: 1rem;
}
```

## Examples

### Pre-built Themes

```vue
<!-- Clean, professional look -->
<HijriCalendar theme="default" />

<!-- Dark mode -->
<HijriCalendar theme="dark" />

<!-- Modern with gradients -->
<HijriCalendar theme="modern" />

<!-- Islamic-inspired design -->
<HijriCalendar theme="islamic" dir="rtl" />

<!-- Minimal, inherits parent styles -->
<HijriCalendar theme="minimal" />
```

### Size Variants

```vue
<HijriCalendar size="compact" />
<!-- Smaller for tight spaces -->
<HijriCalendar size="default" />
<!-- Standard size -->
<HijriCalendar size="large" />
<!-- Larger for better touch targets -->
```

### Custom Slots

```vue
<HijriCalendar>
  <template #prev-button="{ disabled }">
    <MyCustomIcon :disabled="disabled" />
  </template>
  
  <template #cell="{ dayValue, today, selected }">
    <span :class="{ 'highlight': today, 'selected': selected }">
      {{ dayValue }}
    </span>
  </template>
</HijriCalendar>
```

### Completely Custom

```vue
<HijriCalendar>
  <template #default>
    <!-- Your completely custom implementation -->
    <div class="my-calendar-design">
      <!-- Full control over every pixel -->
    </div>
  </template>
</HijriCalendar>
```

## CSS Variables Reference

```css
:root {
  /* Core colors */
  --hijri-calendar-background: #ffffff;
  --hijri-calendar-foreground: #111827;
  --hijri-calendar-border: #e5e7eb;
  --hijri-calendar-primary: #2563eb;

  /* Sizes */
  --hijri-calendar-cell-size: 2rem;
  --hijri-calendar-border-radius: 0.5rem;

  /* Spacing */
  --hijri-calendar-spacing-sm: 0.5rem;
  --hijri-calendar-spacing-md: 1rem;

  /* And 50+ more variables for complete control */
}
```

## When to Use Which Approach

### Use Styled Pre-built Components When:

- You want a calendar that looks great out of the box
- You're prototyping or need something quickly
- You like one of the existing themes
- You only need minor customizations (CSS variables work great)

### Use Unstyled Headless Components When:

- You have a specific design system to follow
- You need complete control over styling
- You're building a design system component
- You want to integrate with frameworks like Tailwind CSS

### Use Hybrid Approach When:

- You like a theme but need to match your brand colors
- You want to make small adjustments to existing themes
- You need responsive behavior different from defaults

## Integration Examples

### With Tailwind CSS

```vue
<HijriCalendar :styled="false" class="calendar-tailwind">
  <template #cell="{ dayValue, selected, today }">
    <span :class="[
      'w-8 h-8 flex items-center justify-center rounded-full',
      'transition-colors duration-200',
      { 'bg-blue-500 text-white': selected },
      { 'bg-orange-100 text-orange-800': today && !selected },
      { 'hover:bg-gray-100': !selected && !today }
    ]">
      {{ dayValue }}
    </span>
  </template>
</HijriCalendar>
```

### With CSS-in-JS (Styled Components)

```vue
<script setup lang="ts">
import styled from '@vue/styled-components'

const StyledCalendar = styled(HijriCalendar)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  overflow: hidden;
`
</script>

<template>
  <StyledCalendar :styled="false" />
</template>
```

### With CSS Modules

```vue
<template>
  <HijriCalendar :styled="false" :class="$style.calendar" />
</template>

<style module>
.calendar {
  background: var(--my-design-system-bg);
  border: var(--my-design-system-border);
}
</style>
```

## Accessibility

The calendar is fully accessible by default:

- **Keyboard Navigation**: Arrow keys, Enter, Space, Page Up/Down
- **Screen Readers**: Proper ARIA labels and announcements
- **Focus Management**: Logical tab order and focus indicators
- **High Contrast**: Supports Windows High Contrast mode

## Browser Support

- Chrome 88+ ✅
- Firefox 85+ ✅
- Safari 14+ ✅
- Edge 88+ ✅

## Performance

- Uses CSS variables instead of CSS-in-JS for better performance
- Minimal JavaScript bundle size
- Efficient Vue 3 Composition API implementation
- No external dependencies beyond Vue and core utilities

## Migration

The component is designed to be easy to adopt regardless of your current setup:

```vue
<!-- Replace any existing calendar -->
<YourOldCalendar v-model="date" />

<!-- With our calendar -->
<HijriCalendar v-model="date" theme="default" />
```

For complete documentation, see [HIJRI-CALENDAR-DOCUMENTATION.md](./HIJRI-CALENDAR-DOCUMENTATION.md).

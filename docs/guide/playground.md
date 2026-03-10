# Playground

Experience the Taqwim Hijri Calendar components in action with our interactive playground.

## Live Demo

Visit the **[Interactive Playground](../playground/vue3/)** to:

- 🎨 **Switch between themes** - Brutalist, Islamic Royal Green, Islamic Royal Purple, and Vercel-inspired
- 📅 **Interact with calendar** - Select dates, navigate months, and see real-time updates
- 🌍 **Change locales** - Arabic and English support
- 📱 **Test responsiveness** - See how components adapt to different screen sizes
- 🔧 **View source code** - Inspect the implementation and learn

## Available Demos

### Home Page

Experience the adaptive theme system with a live clock and elegant design that changes based on the selected theme.

### Working Example

A fully functional calendar implementation showcasing:

- Date selection
- Month navigation
- Today highlighting
- Locale switching
- Theme controls

### Theme Showcases

Individual pages for each theme:

- **Brutalist** - Bold, minimalist design
- **Islamic Royal Green** - Elegant green and gold
- **Islamic Royal Purple** - Luxurious purple and gold
- **Vercel Inspired** - Modern, clean aesthetic

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-repo/taqwim

# Navigate to playground
cd taqwim/playground/vue3

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Key Features Demonstrated

### Theme System

```vue
<script setup>
import { ref } from 'vue'

const themes = ['brutalist', 'islamic-royal-green', 'islamic-royal-purple', 'vercel']

const currentTheme = ref('brutalist')

const applyTheme = theme => {
  document.documentElement.className = `theme-${theme}`
  currentTheme.value = theme
}
</script>
```

### Calendar Integration

```vue
<template>
  <HijriCalendarRoot v-model="selectedDate">
    <!-- Calendar components -->
  </HijriCalendarRoot>
</template>
```

### Responsive Design

All components are fully responsive and adapt to:

- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## Component Examples

### Basic Calendar

The simplest implementation showing core calendar functionality.

### Advanced Calendar

Complete implementation with:

- Custom styling
- Event handling
- Accessibility features
- Internationalization

### Custom Themes

Learn how to create your own themes using CSS custom properties.

## Development Tips

### Hot Reload

The playground supports hot module replacement for rapid development:

- Edit components and see instant updates
- Test theme changes in real-time
- Debug with Vue DevTools

### Performance

Optimized for performance with:

- Lazy loading
- Efficient re-rendering
- Minimal bundle size
- Tree shaking support

## Browser Testing

Test across different browsers:

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Feedback

Found an issue or have suggestions?

- 🐛 [Report bugs](https://github.com/your-repo/taqwim/issues)
- 💡 [Feature requests](https://github.com/your-repo/taqwim/discussions)
- 📝 [Documentation improvements](https://github.com/your-repo/taqwim/issues)

---

**Ready to explore?** Head over to the [Interactive Playground](../playground/vue3/) and start experimenting with the Taqwim Hijri Calendar components!

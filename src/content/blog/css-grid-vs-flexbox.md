---
title: "CSS Grid vs Flexbox — when to use which"
date: "2026-02-28"
excerpt: "Both layout systems are powerful. Knowing which to reach for saves time and headaches."
---

CSS Grid and Flexbox are both incredibly powerful layout tools, but they solve different problems. Understanding their strengths will make you a faster, more confident CSS author.

## Flexbox — one dimension

Flexbox excels at distributing space along a single axis — either a row or a column. It's perfect for navigation bars, button groups, or centering content.

```css
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav a {
  padding: 0.5rem 1rem;
}
```

## Grid — two dimensions

Grid shines when you need to control both rows and columns simultaneously. Page layouts, card grids, and dashboard widgets are natural fits.

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.sidebar { grid-row: 1 / -1; }
```

## Rule of thumb

- Use Flexbox when laying out items along a single axis.
- Use Grid when you need precise control over both axes.
- They compose well — a Grid cell can contain a Flex container.

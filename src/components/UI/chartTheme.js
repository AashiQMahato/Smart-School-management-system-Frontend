/**
 * Chart colours. They are CSS variables, so charts follow the light/dark
 * theme automatically.
 */

/** Module colour as a CSS variable usable in SVG fill/stroke. */
export const chartColor = (tone) => `var(--c-${tone})`;

/** Order used when a chart needs several distinct series colours. */
export const CHART_TONES = [
  "blue",
  "emerald",
  "orange",
  "violet",
  "teal",
  "pink",
  "amber",
  "sky",
];

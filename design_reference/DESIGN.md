# Design System Strategy: The Violet Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Chromatic Curator"**

This design system is built to evoke the serene, high-end feel of a digital gallery. Moving away from the rigid, boxy constraints of traditional SaaS interfaces, "The Chromatic Curator" embraces the fluid, interlocking nature of the central logo—a circular weave of hands—as its structural philosophy. 

The experience is defined by **intentional asymmetry, vast negative space, and tonal depth**. Instead of using lines to organize information, we use the "Violet Spectrum" to create a sense of place. Every layout should feel like a custom-designed editorial spread, where high-contrast typography and rich lavender surfaces guide the eye with grace and authority.

---

## 2. Colors & Atmospheric Depth
The color palette is a sophisticated range of violets and lavenders that must be used to create atmosphere, not just "fill."

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. 
*   **The Alternative:** Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (#f4f3f6) section should sit on a `surface` (#faf9fc) background. This "tonal blocking" creates a softer, more premium transition that mimics high-end paper stock.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-transparent layers. 
*   **Nesting:** Use `surface-container` tiers (Lowest to Highest) to define importance. An inner card should use `surface-container-lowest` (#ffffff) to "pop" against a `surface-container` (#eeedf0) background. 
*   **Glass & Gradient Rule:** For floating navigation or modal overlays, use **Glassmorphism**. Apply `surface-container-low` at 80% opacity with a `backdrop-blur` of 20px. 
*   **Signature Textures:** For Hero sections and primary CTAs, use a subtle linear gradient transitioning from `primary` (#6c43b9) to `primary-container` (#865dd3) at a 135-degree angle. This mimics the 3D lighting found in the interlocking logo.

---

## 3. Typography: The Editorial Voice
We use **Manrope** exclusively. It is a modern geometric sans-serif that balances the "tech" of digital interfaces with the "elegance" of print.

*   **Display Scale (`display-lg` 3.5rem):** Used for singular, impactful statements. Letter spacing should be set to -0.02em to create a "tight," professional editorial feel.
*   **Headline Scale (`headline-md` 1.75rem):** High contrast is key. Pair a `headline-md` in `on-surface` (#1a1c1e) with a `label-md` in `primary` (#6c43b9) to establish clear hierarchy.
*   **Body Text (`body-lg` 1rem):** Used for long-form content. Ensure a generous line height (1.6) to maintain the "serene" feel and prevent the violet tones from feeling heavy.
*   **Labeling:** Labels (`label-sm`) should always be in Uppercase with +0.05em tracking when used for categorization, providing a "metadata" look that feels intentional and curated.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows and borders are replaced by **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." 
    *   *Base:* `surface`
    *   *Section:* `surface-container-low`
    *   *Active Component:* `surface-container-lowest`
*   **Ambient Shadows:** If a floating element (like a mobile menu or a "Save" button) requires lift, use a shadow with a 40px blur, 0px offset, and 6% opacity of `on-surface`. The shadow should feel like a soft glow, never a dark drop-shadow.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a border, use the **Ghost Border**: `outline-variant` (#ccc3d3) at 15% opacity. This provides a faint guide without interrupting the visual flow.

---

## 5. Components: Refined Primitives

### Buttons
*   **Primary:** A solid gradient from `primary` to `primary-container`. Corner radius: `full`. No shadow.
*   **Secondary:** `surface-container-high` background with `on-surface` text. These should feel like "pillows" on the page.
*   **Tertiary:** No background. Text color `primary`. Use a 2px underline that only appears on hover.

### Input Fields
*   **Styling:** Forgo the four-sided box. Use a `surface-container-low` background with a `full` corner radius and `3.5` (1.2rem) horizontal padding.
*   **States:** On focus, the background shifts to `surface-container-highest` and the label moves to `primary` color.

### Cards & Lists
*   **The Divider Forbiddance:** Never use line dividers.
*   **Spacing:** Separate list items using `spacing-4` (1.4rem).
*   **Card Styling:** Use `surface-container-lowest` for the card body against a `surface-container` background. Ensure a corner radius of `xl` (1.5rem) to echo the curves of the hand logo.

### The "Pulse" Logo Element
Integrate the logo {{DATA:IMAGE:IMAGE_4}} as a functional watermark. In large empty states or hero backgrounds, place the logo at 5% opacity, scaled to 120% of the container width, creating a subtle, rotating "woven" texture.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. Align text to the left but place imagery or the logo slightly off-center to the right.
*   **Do** embrace white space. If you think there is enough room between elements, add `spacing-6` more.
*   **Do** use `primary-fixed-dim` (#d3bbff) for subtle highlights in dark-mode or high-intensity areas.

### Don’t:
*   **Don’t** use pure black (#000000). Always use `on-surface` (#1a1c1e) to keep the contrast high but the tone sophisticated.
*   **Don’t** use the `DEFAULT` (0.5rem) corner radius for large containers. Use `xl` (1.5rem) for a more organic, premium feel.
*   **Don’t** use "Alert Red" for errors unless absolutely necessary. Use `error` (#ba1a1a) sparingly, ensuring it is housed within an `error_container` to soften its impact on the violet palette.
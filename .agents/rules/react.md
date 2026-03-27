---
description: ReactJS advanced design and performance (Vercel Standards)
globs: **/*.{js,jsx,ts,tsx}
alwaysApply: false
---

# ReactJS Web Design & Performance Standards

Use these standards to ensure high-performance, modern, and maintainable React applications.

## Component Architecture & Composition

- **Atomic Components**: Keep components small and focused.
- **Advanced Composition**: Use Compound Components (e.g., `Select.Option`, `Card.Title`) to minimize prop drilling and avoid boolean flag proliferation.
- **Separation of Concerns**: Extact business/data logic into custom hooks; keep UI components focused on presentation.

## Vercel Performance Standards (CRITICAL)

- **Eliminate Waterfalls**: 
  - Parallelize data fetching using `Promise.all()`.
  - Fetch data as close to the leaf components as possible to avoid blocking the whole page.
- **Bundle Optimization**: 
  - Use `React.lazy` or `next/dynamic` for heavy visual components, charts, and modals.
  - Avoid large library imports; use modular imports when possible.
- **Re-render Hygiene**:
  - Prefer derived state (computing during render) over syncing state with `useEffect`.
  - Memoize expensive computations with `useMemo` and stable callbacks with `useCallback`.
  - Use `useTransition` to keep the UI responsive during heavy state updates.

## Modern Aesthetics (Vercel Style)

- **Visual Style**: Glassmorphism (blur + semi-transparent), sleek dark mode, and smooth gradients.
- **Typography**: Minimum font size 14px; use clear hierarchy (e.g., scale 1.2x - 1.25x).
- **Interactivity**: 
  - Sublte hover effects and micro-animations (Framer Motion).
  - Use **Skeleton Screens** for loading states instead of spinners.

## Responsive Design & Accessibility

- **Mobile First**: Design for mobile first, then scale up using Tailwind/CSS breakpoints.
- **Accessibility**: 
  - Use semantic HTML (`<nav>`, `<main>`, `<button>`).
  - Ensure interactive elements are keyboard accessible (tabindex, focus-ring).
  - Use `aria-label` for icons and controls without visible text labels.

## Code Examples

```jsx
// ✅ GOOD: Compound Component (Vercel Pattern)
export const Modal = ({ children }) => <div className="backdrop-blur-xl bg-white/5 ...">{children}</div>;
Modal.Header = ({ title }) => <h3 className="text-xl font-bold">{title}</h3>;

// Usage: <Modal><Modal.Header title="Success" /></Modal>

// ✅ GOOD: Parallel Fetching
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

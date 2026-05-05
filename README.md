# SecureVault Dashboard

A modern file explorer UI built for SecureVault Inc. — an enterprise cloud storage platform used by law firms and financial institutions. The goal was to replace a flat, hard-to-navigate file list with a fast, keyboard-accessible, deeply nestable file explorer that feels secure and professional.

---

## Live Demo

[View deployed app](YOUR_DEPLOYMENT_URL_HERE)

---

## Design File

[Figma — SecureVault Design System](https://www.figma.com/design/nCV2Nc9vHQ2qWssEAiKXoY/SecureVault-dashboard?node-id=0-1&t=WEIoavf0NHRYxe8z-1)

The design file includes a dedicated Design System page with:
- Typography scale (Inter, 4 sizes)
- Color palette with dark mode tokens
- Spacing grid (8px base)
- Component states (default, hover, selected, focused, disabled)
- Brand guidelines — cyber-secure, precise, dark aesthetic

---

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/securevault-dashboard.git
cd securevault-dashboard
npm install
npm run dev
```

The app runs on `http://localhost:5173` by default.

To build for production:

```bash
npm run build
npm run preview
```

---

## Tech Stack

- React 19
- Tailwind CSS v4
- Vite
- lucide-react (icons only)

No component libraries were used. Every UI element — buttons, panels, tree nodes, badges, progress bars — was built from scratch using Tailwind utility classes.

---

## Recursive Strategy

The file tree is driven entirely by `src/data/data.json`. Each node has an `id`, `name`, `type`, and optionally a `children` array for folders.

The `TreeNode` component renders itself recursively. When a folder is open, it maps over `node.children` and renders a `TreeNode` for each child, passing `depth + 1` to increase the indentation. This means the tree handles 2 levels or 20 levels without any structural changes — the recursion just keeps going until there are no more children.

Open/closed state is managed by a `Set` of open folder IDs (`openIds`) that lives in the parent `FileExplorer` component. This was a deliberate choice over storing `open` inside each `TreeNode` — lifting the state up means the parent always knows the full expand state, which is required for keyboard navigation and search auto-expand to work correctly.

For keyboard navigation, a `flatten` function walks the tree and returns a flat ordered array of only the currently visible nodes (respecting which folders are open). Arrow keys move an index through this array, and the focused node gets a distinct sky-blue highlight separate from the emerald selection state.

---

## Wildcard Feature — Breadcrumb Navigation

The brief didn't ask for breadcrumbs, but navigating deeply nested folders without them creates a real usability problem. Once you're three levels deep, you lose context of where you are and have no quick way to jump back up.

The breadcrumb bar appears in the main content area whenever a node is selected. It shows the full path from root to the current item, and every segment is clickable — clicking "Documents" while inside `Documents > Work > Report_Q1.pdf` takes you straight back to the Documents folder view.

For a law firm managing case files across dozens of nested folders, this is the difference between a tool that feels navigable and one that feels like a maze. It also reinforces the "secure, precise" brand feel — you always know exactly where you are in the vault.

The path is computed by `src/utils/findPath.js`, a small recursive function that walks the tree and builds the ancestor chain for any given node ID.

---

## Bonus Feature — Search with Auto-Expand

Typing in the search bar filters the visible file list in real time. The search is handled by `src/hooks/useSearch.js`, which walks the full tree recursively and returns two things:

1. `matchedIds` — the set of node IDs whose names match the query
2. `expandIds` — the set of folder IDs that need to be opened to make matching nodes visible

The `expandIds` are merged with the user's manually opened folders in `FileExplorer`, so matching items deep inside closed folders automatically become visible without losing the user's existing expand state. Non-matching nodes are dimmed to 30% opacity so the matches stand out clearly.

This matters for the law firm use case specifically — a lawyer searching for "Q1" shouldn't have to manually open every folder to find the file. The tree opens itself.

---

## Project Structure

```
src/
├── components/
│   ├── Breadcrumb/       Breadcrumb navigation bar
│   ├── Explorer/         Sidebar file tree with keyboard nav
│   ├── PropertiesPanel/  Right panel showing file metadata
│   └── Toolbar/          Top header bar
├── data/
│   └── data.json         Source of truth for the file tree
├── hooks/
│   └── useSearch.js      Search + auto-expand logic
├── utils/
│   └── findPath.js       Recursive path finder for breadcrumbs
└── App.jsx               Layout assembly + main content area
```

---

## Acceptance Criteria Checklist

- [x] Recursive tree renders from JSON at any depth
- [x] Folders expand and collapse on click
- [x] Clicking a file selects it with a distinct visual state
- [x] Properties Panel shows Name, Type, and Size
- [x] Arrow Up/Down moves focus through visible items
- [x] Arrow Right expands a folder
- [x] Arrow Left collapses a folder
- [x] Enter selects the focused node
- [x] Wildcard feature implemented (Breadcrumb navigation)
- [x] Bonus feature implemented (Search with auto-expand)

# Responsive Notes

## Breakpoints
- **480px**: Compact mobile layout. Navigation drawer spans full width, tool results drawer height reduced, sandbox padding tightens.
- **768px**: Tablet baseline. Shell gutter widens, hero padding adjusts, tool workspace spacing increases.
- **1024px**: Desktop layout kicks in. Navigation returns to persistent bar, tool panels render side by side with switcher hidden.
- **1440px**: Wide desktop gutters expand; shell grows to 1340px max for balanced whitespace.

## Adaptive Behaviours
- Header navigation transforms into an icon-triggered overlay with backdrop on small screens.
- Tool pages expose a mobile-first tab switcher that animates the output drawer as a bottom sheet and locks body scroll while active.
- Drawer state syncs with resize events so toggling between orientations maintains intent while resetting gracefully on large screens.
- Modals shift to bottom-sheet presentation on mobile with touch scrolling while retaining centred dialogs on desktop.
- Body typography scales via `clamp()` for fluid sizing, and section padding compresses progressively on smaller viewports.

## UX Improvements
- Tap targets now respect 44px minimum height and hover feedback degrades for touch-only devices.
- Escape and backdrop interactions consistently collapse overlays/drawers and clear body scroll locks.
- Hash navigation clears any residual drawers and unregisters resize listeners outside tool views.
- Tool output drawer width and spacing mirror shell gutters to prevent horizontal overflow.

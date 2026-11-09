# inno-ui

React, Vite, and TypeScript client for the clinic. The first screen is the unauthorized main page: a header, the main actions, and a footer.

Target runtime: **Node.js 22** or later. The UI is Material UI. Vite serves the app in development and builds the production bundle.

## Source layout

```
src/
  app/            root component and providers
  pages/          screens composed from widgets
  widgets/        header, body, and bottom
  features/       user actions on the main page
  shared/         theme, layout helper, reusable UI
  main.tsx        browser entry
```

Dependency direction:

```
app ──► pages ──► widgets ──► features ──► shared
```

A layer imports only from layers below it.

Styles are not set on each element. Color, type, and component defaults live in `shared/config/theme.ts`. Layout for a slice lives in a `*.styles.ts` file next to that slice. Shared horizontal padding and the content width live in `shared/ui/content-frame/content-frame.styles.ts`.

## Layers

### app

Application root. References pages and shared.

| Path                             | Contents                                      |
| -------------------------------- | --------------------------------------------- |
| `App.tsx`                        | Renders the theme provider and the main page  |
| `providers/AppThemeProvider.tsx` | Material UI `ThemeProvider` and `CssBaseline` |

### pages

One screen per slice. The main page composes the header, body, and bottom widgets. It does not own their styles.

| Slice  | Contents                                                        |
| ------ | --------------------------------------------------------------- |
| `main` | Unauthorized main page. `MainPage.styles.ts` is the page column |

### widgets

Large regions of the main page. A widget may use features and shared UI.

| Slice    | Contents                                    |
| -------- | ------------------------------------------- |
| `header` | Clinic name and sign-in. `Header.styles.ts` |
| `body`   | Intro and the action grid. `Body.styles.ts` |
| `bottom` | Footer. `Bottom.styles.ts`                  |

The action grid uses `repeat(auto-fit, minmax(...))`, so the cards reflow with the viewport instead of keeping a fixed arrangement.

### features

One user action per slice. Each action is still a mock: it opens a notice and does not call the API.

| Slice                    | Action                     |
| ------------------------ | -------------------------- |
| `sign-in`                | Sign In in the header      |
| `choose-doctor`          | Choose a doctor            |
| `choose-service`         | Choose a service           |
| `chat-with-receptionist` | Chat with the receptionist |

### shared

Reusable code with no knowledge of pages, widgets, or features.

| Path                     | Contents                                                                      |
| ------------------------ | ----------------------------------------------------------------------------- |
| `config/theme.ts`        | Palette, typography, shape, content width, and Material UI component defaults |
| `ui/content-frame`       | Shared content width and horizontal padding                                   |
| `ui/mock-action-button`  | Action card. Visuals are in `MockActionButton.styles.ts`                      |
| `ui/mock-notice`         | Snackbar used by mock actions. Placement and duration come from the theme     |
| `lib/use-mock-notice.ts` | Open and close state for a mock notice                                        |

## npm packages

Versions are the ranges declared in `package.json`.

| Package         | Version  |
| --------------- | -------- |
| react           | ^19.3.1  |
| react-dom       | ^19.3.1  |
| @mui/material   | ^9.5.0   |
| @emotion/react  | ^11.14.0 |
| @emotion/styled | ^11.14.1 |
| vite            | ^8.3.6   |
| typescript      | ~6.0.3   |
| eslint          | ^10.14.0 |
| prettier        | ^3.9.10  |

## Scripts

From this directory (`inno-ui`):

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

`dev` serves the app at `http://localhost:5173`. `build` typechecks with `tsc -b` and writes the production bundle to `dist`. `preview` serves that bundle.

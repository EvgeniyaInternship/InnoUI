# inno-ui

React, Vite, and TypeScript client for the clinic. The first screen is the main page: a header, the main actions, and a footer. Doctors, services, registration, and the signed-in profile call the Auth, Profiles, and Facility APIs.

Target runtime: **Node.js 22** or later. The UI is Material UI. Vite serves the app in development and builds the production bundle.

## Environment

API hosts are not written in source. Copy `.env.example` to `.env` and set the real addresses. `.env` is gitignored. `.env.example` is tracked and uses placeholder ports.

| Variable                | Used by         | Purpose                                                                         |
| ----------------------- | --------------- | ------------------------------------------------------------------------------- |
| `VITE_AUTH_API_URL`     | Browser         | Auth origin for login and logout                                                |
| `VITE_PROFILES_API_URL` | Browser         | Profiles HTTPS origin for patient registration and the current-account fallback |
| `PROFILES_PROXY_TARGET` | Vite dev server | HTTP target for `/profiles`                                                     |
| `FACILITY_PROXY_TARGET` | Vite dev server | HTTP target for `/facility`                                                     |

`VITE_` variables are available in the browser through `import.meta.env`. The proxy targets are read only by `vite.config.ts`. Cookie calls for profiles and facility go through those proxies. Login, logout, and patient registration use the direct origins.

Restart `npm run dev` after changing `.env`. A missing variable stops startup with the name of the variable to set.

`shared/config/auth.ts` builds the request paths from those origins. Examples: `/Auth/login`, `/profiles/Account`, `/facility/Service`.

## Source layout

```
src/
  app/            root component and providers
  pages/          screens composed from widgets and features
  widgets/        header, body, bottom, and account access
  features/       user actions and API-backed screens
  shared/         theme, routing, HTTP client, session, reusable UI
  main.tsx        browser entry
```

Dependency direction:

```
app ──► pages ──► widgets ──► features ──► shared
```

A layer imports only from layers below it. Features do not import other features.

Styles are not set on each element. Color, type, and component defaults live in `shared/config/theme.ts`. Layout for a slice lives in a `*.styles.ts` file next to that slice. Shared horizontal padding and the content width live in `shared/ui/content-frame/content-frame.styles.ts`.

## Layers

### app

Application root. References pages and shared.

| Path                             | Contents                                        |
| -------------------------------- | ----------------------------------------------- |
| `App.tsx`                        | Renders the theme provider and the clinic shell |
| `ClinicApp.tsx`                  | Header, footer, session, and the current page   |
| `providers/AppThemeProvider.tsx` | Material UI `ThemeProvider` and `CssBaseline`   |

`ClinicApp` chooses the page from the browser path. There is no router package. `shared/lib/use-route.ts` listens to `pushState` and `popstate`.

| Path             | Screen                                             |
| ---------------- | -------------------------------------------------- |
| `/`              | Home                                               |
| `/account`       | Signed-in profile. Unsigned visitors return home   |
| `/doctors`       | Doctor list                                        |
| `/doctors/{id}`  | One doctor. Unsigned visitors go to the Auth login |
| `/services`      | Service list                                       |
| `/services/{id}` | One service                                        |

### pages

One screen per slice. The clinic shell composes the header, the current page, and the footer.

| Slice      | Contents                                    |
| ---------- | ------------------------------------------- |
| `main`     | Clinic home with the action grid            |
| `account`  | Signed-in profile, opened from View profile |
| `doctors`  | Public doctor catalog and one doctor        |
| `services` | Public service catalog and one service      |

### widgets

Large regions of the main page. A widget may use features and shared UI.

| Slice            | Contents                                                                |
| ---------------- | ----------------------------------------------------------------------- |
| `header`         | Clinic name, sign-in, or the signed-in account menu. `Header.styles.ts` |
| `body`           | Intro and the action grid. `Body.styles.ts`                             |
| `bottom`         | Footer. `Bottom.styles.ts`                                              |
| `account-access` | Choice between signing in and creating an account. Opened from the page |

The action grid uses `repeat(auto-fit, minmax(...))`, so the cards reflow with the viewport instead of keeping a fixed arrangement.

### features

Sign-in opens the account choice, then the Auth login. Patient registration posts to the Profiles API. A signed-in header shows the account name and logs out through the Auth API. Doctors and services load from Profiles and Facility. Chat with the receptionist is still a notice only.

| Slice                    | Action                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| `sign-in`                | Sign In in the header                                                    |
| `account-menu`           | Signed-in name, with settings, view profile, and log out                 |
| `account-profile`        | Profile photo, account details, personal information, and delete account |
| `patient-registration`   | Patient form: email, password, name, phone, birth date, insurance number |
| `choose-doctor`          | Opens the doctor list                                                    |
| `choose-service`         | Opens the service list                                                   |
| `doctors`                | Filter, list, and open doctors. An admin can create a doctor             |
| `services`               | Filter, list, and open services. An admin can create a service           |
| `chat-with-receptionist` | Mock notice                                                              |

Doctor and service lists page nine records at a time. The pager stays under a reserved full page of cards.

### shared

Reusable code with no knowledge of pages, widgets, or features.

| Path                           | Contents                                                                                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/theme.ts`              | Palette, typography, shape, content width, and Material UI component defaults                                                                                    |
| `config/auth.ts`               | API origins from `.env`, plus Auth, Profiles, and Facility paths                                                                                                 |
| `config/routes.ts`             | Home, account, doctor, and service paths                                                                                                                         |
| `api/http-client.ts`           | `get`, `post`, `put`, and `delete`. JSON requests set `Content-Type`. An empty `204` returns `{ success: true }`. Cookies are sent with `credentials: 'include'` |
| `api/facility.ts`              | Offices, specializations, and a doctor's services                                                                                                                |
| `session/signed-in-account.ts` | Signed-in account kept for this browser tab                                                                                                                      |
| `lib/use-route.ts`             | Current path and navigation                                                                                                                                      |
| `lib/use-mock-notice.ts`       | Open and close state for a mock notice                                                                                                                           |
| `ui/content-frame`             | Shared content width and horizontal padding                                                                                                                      |
| `ui/pager`                     | Page controls for the catalogs                                                                                                                                   |
| `ui/specialization-icon`       | Icon chosen from the specialization name                                                                                                                         |
| `ui/mock-action-button`        | Action card. Visuals are in `MockActionButton.styles.ts`                                                                                                         |
| `ui/mock-notice`               | Snackbar used by mock actions. Placement and duration come from the theme                                                                                        |

## npm packages

Versions are the ranges declared in `package.json`.

| Package             | Version  |
| ------------------- | -------- |
| react               | ^19.3.1  |
| react-dom           | ^19.3.1  |
| @mui/material       | ^9.5.0   |
| @mui/icons-material | ^9.5.0   |
| @mui/x-date-pickers | ^9.17.0  |
| dayjs               | ^1.11.23 |
| @emotion/react      | ^11.14.0 |
| @emotion/styled     | ^11.14.1 |
| vite                | ^8.3.6   |
| typescript          | ~6.0.3   |
| eslint              | ^10.14.0 |
| prettier            | ^3.9.10  |

## Scripts

From this directory (`inno-ui`):

```bash
npm install
copy .env.example .env
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

On macOS and Linux, use `cp .env.example .env`.

`dev` serves the app at `http://localhost:5173`. `build` typechecks with `tsc -b` and writes the production bundle to `dist`. `preview` serves that bundle. `lint` runs ESLint. `format` writes Prettier formatting.

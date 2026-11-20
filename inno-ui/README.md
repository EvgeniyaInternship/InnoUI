# inno-ui

React, Vite, and TypeScript client for the clinic. It talks to the Auth, Profiles, and Facility APIs. The screen is Material UI. The first view is the home page: a header, the main actions, and a footer.

Target runtime: **Node.js 22** or later. Vite serves the app in development and builds the production bundle.

## Source layout

```
src/
  app/            root component and providers
  pages/          screens composed from widgets and features
  widgets/        header, body, footer, and the account dialog
  features/       user actions and API-backed screens
  shared/         theme, routes, HTTP client, session, reusable UI
  main.tsx        browser entry
```

Dependency direction:

```
app ──► pages ──► widgets ──► features ──► shared
```

A layer imports only from layers below it. A feature does not import another feature.

Color, type, and component defaults live in `shared/config/theme.ts`. Layout for a slice lives in a `*.styles.ts` file next to that slice. Shared horizontal padding and the content width live in `shared/ui/content-frame/content-frame.styles.ts`.

## Projects areas

### app

Application root.

| Path                             | Contents                                      |
| -------------------------------- | --------------------------------------------- |
| `App.tsx`                        | Theme provider and the clinic shell           |
| `ClinicApp.tsx`                  | Header, footer, session, and the current page |
| `providers/AppThemeProvider.tsx` | Material UI `ThemeProvider` and `CssBaseline` |

`ClinicApp` chooses the page from the browser path. `shared/lib/use-route.ts` reads that path and moves between screens with `pushState` and `popstate`.

| Path             | Screen                                                         |
| ---------------- | -------------------------------------------------------------- |
| `/`              | Home                                                           |
| `/account`       | Signed-in profile. A visitor who is signed out returns home    |
| `/doctors`       | Doctor list                                                    |
| `/doctors/{id}`  | One doctor. A visitor who is signed out goes to the Auth login |
| `/services`      | Service list                                                   |
| `/services/{id}` | One service                                                    |

### pages

One screen per slice. The shell keeps the header and the footer around the current page.

| Slice      | Contents                                                |
| ---------- | ------------------------------------------------------- |
| `main`     | Home and the action grid                                |
| `account`  | Profile opened from View profile                        |
| `doctors`  | Doctor catalog, or one doctor when the path has an id   |
| `services` | Service catalog, or one service when the path has an id |

### widgets

| Slice            | Contents                                                 |
| ---------------- | -------------------------------------------------------- |
| `header`         | Clinic name, Sign in, or the signed-in account menu      |
| `body`           | Intro and the action grid                                |
| `bottom`         | Footer                                                   |
| `account-access` | Choice between signing in and creating a patient account |

The action grid uses `repeat(auto-fit, minmax(...))`, so the cards reflow with the viewport.

### features

| Slice                    | Action                                                                   |
| ------------------------ | ------------------------------------------------------------------------ |
| `sign-in`                | Sign in button in the header                                             |
| `account-menu`           | Signed-in name, with settings, view profile, and log out                 |
| `account-profile`        | Account details, personal information, and delete account                |
| `patient-registration`   | Patient form: email, password, name, phone, birth date, insurance number |
| `choose-doctor`          | Opens the doctor list                                                    |
| `choose-service`         | Opens the service list                                                   |
| `doctors`                | Filter, list, open, and, for an admin, create a doctor                   |
| `services`               | Filter, list, open, and, for an admin, create a service                  |
| `chat-with-receptionist` | Notice only. It does not call an API                                     |

Doctor and service lists show nine records on a page. The pager stays under a reserved block the height of a full page, with a divider above it.

Roles used by the UI: Admin `1`, Receptionist `2`, Doctor `3`, Patient `4`.

### shared

| Path                           | Contents                                                                                                                                             |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config/theme.ts`              | Palette, typography, shape, content width, and Material UI defaults                                                                                  |
| `config/auth.ts`               | API origins from `.env`, plus Auth, Profiles, and Facility paths                                                                                     |
| `config/routes.ts`             | Home, account, doctor, and service paths. `buildUrl` joins an id onto a path                                                                         |
| `api/http-client.ts`           | `get`, `post`, `put`, and `delete`. JSON bodies set `Content-Type`. An empty `204` returns `{ success: true }`. Cookies use `credentials: 'include'` |
| `api/http-options.ts`          | Network messages for Profiles and Facility                                                                                                           |
| `api/dto`                      | Request and response DTOs for Facility and Profiles, plus `PagedResultDto<T>`                                                                        |
| `api/facility.ts`              | Offices, specializations, and the services offered by one doctor                                                                                     |
| `lib/build-url.ts`             | Joins a base, a path segment, and a query string. Path segments are encoded                                                                          |
| `lib/iso-date.ts`              | Date-only values and ISO timestamps sent to the APIs                                                                                                 |
| `session/signed-in-account.ts` | Signed-in account for this browser tab (`sessionStorage` key `clinic.signedInAccount`)                                                               |
| `lib/use-route.ts`             | Current path and navigation                                                                                                                          |
| `ui/pager`                     | Page controls for the catalogs                                                                                                                       |
| `ui/specialization-icon`       | Icon chosen from the specialization title                                                                                                            |
| `ui/mock-action-button`        | Action card on the home page                                                                                                                         |
| `ui/mock-notice`               | Snackbar for actions that are still a notice                                                                                                         |

`httpClient.get` takes a response parser, so `data` is the DTO. `post` and `put` take the response type and the request DTO. `requireData` throws the result message when the call failed. A failed body is read as a problem document: `detail`, then the first `errors` entry, then `title`.

## Configuration

Copy `.env.example` to `.env`. `.env` is gitignored. `.env.example` is tracked and uses port `1111` as a placeholder. Replace `1111` with the ports of the running APIs.

| Variable                | Used by         | Purpose                                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------------------- |
| `VITE_AUTH_API_URL`     | Browser         | Auth origin for login and logout                                          |
| `VITE_PROFILES_API_URL` | Browser         | Profiles origin for patient registration and the current-account fallback |
| `PROFILES_PROXY_TARGET` | Vite dev server | Target for requests that start with `/profiles`                           |
| `FACILITY_PROXY_TARGET` | Vite dev server | Target for requests that start with `/facility`                           |

`VITE_` variables reach the browser through `import.meta.env`. The proxy targets are read only by `vite.config.ts`. A missing variable stops startup with `Missing NAME. Set it in .env.` Restart `npm run dev` after changing `.env`.

Cookie calls for Profiles and Facility go through the dev proxies. Vite strips the `/profiles` or `/facility` prefix and forwards the rest. Login, logout, and patient registration call the origins from `.env` directly. Patient registration sends `credentials: 'omit'`. Every other call sends cookies with `credentials: 'include'`.

Addresses built from this config:

| Call                               | Address                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| Login                              | `{VITE_AUTH_API_URL}/Auth/login`                                                             |
| Logout                             | `{VITE_AUTH_API_URL}/Auth/logout`                                                            |
| Current account, through the proxy | `/profiles/Account/current`                                                                  |
| Current account fallback           | `{VITE_PROFILES_API_URL}/Account/current`                                                    |
| Patient registration               | `{VITE_PROFILES_API_URL}/Registration`                                                       |
| Doctor registration by an admin    | `/profiles/Registration`                                                                     |
| Accounts, patients, doctors, staff | `/profiles/Account`, `/profiles/Patient`, `/profiles/Doctor`, and the `/current` staff paths |
| Offices, specializations, services | `/facility/Office`, `/facility/Specialization`, `/facility/Service`                          |

## Application flows

Auth, Profiles, and Facility need to be running before these flows can load data. The UI keeps the signed-in name in `sessionStorage` until logout. On startup it asks Profiles for the current account and replaces that saved record when the cookie is still valid.

### Home

`/` shows the header, three actions, and the footer. Choose a doctor opens `/doctors`. Choose a service opens `/services`. Chat with the receptionist opens a notice and does not call an API.

### Sign in, registration, and logout

Sign in in the header opens a dialog. Sign in leaves the app and opens the Auth login URL. Create an account opens the patient form. A successful registration stores the returned name and closes the dialog, so the header shows the account menu.

The account menu offers view profile and log out. Log out clears the saved account, returns home, and opens the Auth logout URL.

Opening `/account` while signed out returns home.

### Account

`/account` loads the current account. A patient then loads `/profiles/Patient/current`. An admin, receptionist, or doctor loads the matching `/current` staff record. The page shows the account fields and the personal fields for that role. Saving the account or the personal record sends a `put`. Deleting the account calls `delete` and then logs out.

A `401` asks the visitor to sign in. A `403` says this account cannot be changed. Any other message returned by the API is shown as-is.

### Doctors

`/doctors` is public. The list filters by office, specialization, and work start date, and pages nine doctors at a time. Cards show the doctor's name and specialization, including when the visitor is signed out.

An admin sees Create doctor on the description line. That action registers a doctor through Profiles. A doctor cannot edit a doctor record, including their own. The role cannot be changed from this screen.

`/doctors/{id}` waits until the session check finishes. A signed-out visitor is sent to the Auth login. A signed-in visitor sees the doctor, their office and specialization, and the services that doctor offers. An admin can edit the doctor and the linked account.

### Services

`/services` is public. The title filter matches a substring. The price filter takes a minimum and a maximum, and rejects a value below 0. Those two filters run in the browser after the list is loaded, so they work before Facility is restarted with the matching server filter. The catalog pages nine services. A card spans the content width: one column, then two, then three. The specialization icon sits left of the name. The description is on the card. The price is pale and prefixed with `$`. An inactive service is pale and shows Unavailable yet at the bottom left, with the price on the same line at the right.

An admin sees Create service on the description line. The new price cannot be below 0.

`/services/{id}` stays public. The title and a pale price sit on one line, with a gap and a small bordered box around the price. Under the title is the specialization. A table lists every doctor who offers that exact title, with specialization, price, and status. Create an appointment sits under that table, at the right, and opens a notice. It does not create an appointment.

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

## Setup and commands

From this directory (`inno-ui`):

```powershell
npm install
copy .env.example .env
npm run dev
```

Edit `.env` and replace every `1111` with the real Auth, Profiles, and Facility ports. Then start the dev server again.

The app is served at `http://localhost:5173`.

```powershell
npm run build
npm run preview
npm run lint
npm run format
```

`build` typechecks with `tsc -b` and writes the production bundle to `dist`. `preview` serves that bundle. `lint` runs ESLint with zero warnings. `format` writes Prettier formatting.

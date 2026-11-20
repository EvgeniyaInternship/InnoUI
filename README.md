# InnoUI

The clinic web client lives in [`inno-ui`](inno-ui/README.md). That document has the source layout, environment, application flows, and commands.

## Local setup

Node.js 22 or later, and npm.

```powershell
git clone https://github.com/EvgeniyaInternship/InnoUI.git
cd InnoUI\inno-ui
npm install
copy .env.example .env
npm run dev
```

`.env.example` uses port `1111` as a placeholder. Replace it with the ports of the running Auth, Profiles, and Facility APIs, then run `npm run dev` again.

The app is served at `http://localhost:5173`.

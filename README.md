## OH2 Ryhmä HJKMST
https://topi-m.github.io/HJKMST/
https://hjkmst.topim.fi/

Dokumentaatio: https://docs.hjkmst.topim.fi/

### Projektin toteutus
| Osa | Toteutus |
|---|---|
| Frontend | React 19, Vite 7, React Bootstrap |
| Tietokanta & Auth | Supabase (PostgreSQL) |
| Moninpeli | Supabase Realtime |
| Deploy | Cloudflare Page / GitHub Pages |
| Testaus | - |

### Projektin hakemistorakenne
src\
├── components  - Komponentit kuten leaderboard\
├── css         - Tyylitiedostot\
├── tests         - Testit <-- puuttuu\
└── pages       - Varsinaiset sivu

### CI/CD
Projektissa käytetään GitHub Actionsia automatisoituun testaukseen. Kun mainiin tehdään pull request, pipeline asentaa riippuvuudet, kääntää projektin ja ajaa Vitest-testit.

## Sovelluksen ajaminen

#### 1. Ympäristömuuttujat
Luo tiedosto `client/.env.local` ja lisää:
```
VITE_SUPABASE_URL=https://<projektin-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<anon-public-key>
```

#### 2. Asennus ja käynnistys
```bash
cd client
npm install
npm run dev
```

#### 3. Testien ajaminen
```bash
cd client
npm test
```


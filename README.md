## OH2 Ryhmä HJKMST
https://topi-m.github.io/HJKMST/
https://hjkmst.topim.fi/

#### Projektin toteutus
| Osa | Toteutus |
|---|---|
| Frontend | React 19, Vite 7, React Bootstrap |
| Tietokanta & Auth | Supabase (PostgreSQL) |
| Moninpeli | Supabase Realtime |
| Deploy | Cloudflare Page / GitHub Pages |
| Testaus | - |

#### Projektin hakemistorakenne
src\
├── components  - Komponentit kuten leaderboard\
├── css         - Tyylitiedostot\
├── tests         - Testit <-- puuttuu\
└── pages       - Varsinaiset sivu

#### CI/CD
Projektissa käytetään GitHub Actionsia automatisoituun testaukseen. Kun mainiin tehdään pull request, pipeline asentaa riippuvuudet, kääntää projektin ja ajaa Vitest-testit.

#### Tietokanta
-


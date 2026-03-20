import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import './App.css'

// Sivut
import EtusivuDoc from './pages/sivut/EtusivuDoc'
import PalapeliDoc from './pages/sivut/PalapeliDoc'
import SudokuDoc from './pages/sivut/SudokuDoc'
import NonogramDoc from './pages/sivut/NonogramDoc'
import MuistipeliDoc from './pages/sivut/MuistipeliDoc'
import WhiteTileDoc from './pages/sivut/WhiteTileDoc'
import LoginDoc from './pages/sivut/LoginDoc'
import ProfiiliDoc from './pages/sivut/ProfiiliDoc'
import RistinollaDoc from './pages/sivut/RistinollaDoc'
import LobbyDoc from './pages/sivut/LobbyDoc'

// Komponentit
import LeaderboardDoc from './pages/komponentit/LeaderboardDoc'
import TuloksenTallennusDoc from './pages/komponentit/TuloksenTallennusDoc'
import PelienTimerDoc from './pages/komponentit/PelienTimerDoc'
import MuistipeliLogiikkaDoc from './pages/komponentit/MuistipeliLogiikkaDoc'
import ThemeContextDoc from './pages/komponentit/ThemeContextDoc'
import AuthFormDoc from './pages/komponentit/AuthFormDoc'
import NavbarDoc from './pages/komponentit/NavbarDoc'
import SupaBaseClientDoc from './pages/komponentit/SupaBaseClientDoc'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />

          {/* Sivut */}
          <Route path="sivut/etusivu" element={<EtusivuDoc />} />
          <Route path="sivut/palapeli" element={<PalapeliDoc />} />
          <Route path="sivut/sudoku" element={<SudokuDoc />} />
          <Route path="sivut/nonogram" element={<NonogramDoc />} />
          <Route path="sivut/muistipeli" element={<MuistipeliDoc />} />
          <Route path="sivut/whitetile" element={<WhiteTileDoc />} />
          <Route path="sivut/login" element={<LoginDoc />} />
          <Route path="sivut/profiili" element={<ProfiiliDoc />} />
          <Route path="sivut/ristinolla" element={<RistinollaDoc />} />
          <Route path="sivut/lobby" element={<LobbyDoc />} />

          {/* Komponentit */}
          <Route path="komponentit/leaderboard" element={<LeaderboardDoc />} />
          <Route path="komponentit/tuloksentallennus" element={<TuloksenTallennusDoc />} />
          <Route path="komponentit/pelientimer" element={<PelienTimerDoc />} />
          <Route path="komponentit/muistipelilogiikka" element={<MuistipeliLogiikkaDoc />} />
          <Route path="komponentit/themecontext" element={<ThemeContextDoc />} />
          <Route path="komponentit/authform" element={<AuthFormDoc />} />
          <Route path="komponentit/navbar" element={<NavbarDoc />} />
          <Route path="komponentit/supabaseclient" element={<SupaBaseClientDoc />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

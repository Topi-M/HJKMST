import { Outlet } from "react-router-dom";
import AppNavbar from "./navbar";

function App() {
  return (
    <>
      <AppNavbar />
      {/* Poistettu container ja mt-3, jotta etusivu voi täyttää koko ruudun */}
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
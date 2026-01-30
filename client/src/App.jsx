import { Outlet } from "react-router-dom";
import AppNavbar from "./navbar";

function App() {
  return (
    <>
      <AppNavbar />
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
}

export default App;

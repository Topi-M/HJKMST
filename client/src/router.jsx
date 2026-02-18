import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Palapeli from "./pages/Palapeli";
import Sudoku from "./pages/Sudoku";
import Nonogram from "./pages/Nonogram";
import Etusivu from "./pages/Etusivu"; 
import Login  from "./pages/Login";
import Muistipeli from "./pages/Muistipeli"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Etusivu />,
      },
      {
        path: "palapeli",
        element: <Palapeli />,
      },
      {
        path: "Sudoku",
        element: <Sudoku />,
      },
      {
        path: "Nonogram",
        element: <Nonogram />,
      },
      { path: "Login",
        element: <Login/>
      },
      { path: "Muistipeli",
        element: <Muistipeli/>
      }
    ],
  },
]);
``
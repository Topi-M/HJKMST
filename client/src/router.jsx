import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Palapeli from "./pages/Palapeli";
import Sudoku from "./pages/Sudoku";
import Placeholder3 from "./pages/Placeholder3";
import Etusivu from "./pages/Etusivu"; 
import Login  from "./pages/Login";
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
        path: "placeholder3",
        element: <Placeholder3 />,
      },
      { path: "Login",
        element: <Login/>
      }
    ],
  },
]);
``
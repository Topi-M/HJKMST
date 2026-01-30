import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Palapeli from "./pages/Palapeli";
import Placeholder2 from "./pages/Placeholder2";
import Placeholder3 from "./pages/Placeholder3";
import Etusivu from "./pages/Etusivu"; 

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
        path: "placeholder2",
        element: <Placeholder2 />,
      },
      {
        path: "placeholder3",
        element: <Placeholder3 />,
      }
    ],
  },
]);
``
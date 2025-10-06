import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AppWrapper from "./AppWrapper";
import { OverLayProvider } from "./contexts/OverLayContext";

// Create the router
const router = createBrowserRouter([
  {
    path: "*",
    element: (
      <OverLayProvider>
        <AppWrapper />
      </OverLayProvider>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { store } from "./store.js";

import ReactUI from "./ReactUI";
import initGame from "./initGame";

import "./index.css";

const ui = document.getElementById("ui");

new ResizeObserver(() => {
  document.documentElement.style.setProperty(
    "--scale",
    Math.min(
      ui.parentElement.offsetWidth / ui.offsetWidth,
      ui.parentElement.offsetHeight / ui.offsetHeight
    ).toString()
  );
}).observe(ui.parentElement);

createRoot(document.getElementById("ui")).render(
  <StrictMode>
    <Provider store={store}>
      <ReactUI />
    </Provider>
  </StrictMode>
);

initGame();

import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameSelectorScreen from "./components/GameSelectorScreen";
import DemoNovelGameApp from "./demo_novel_game/App";
import WerewolfGameApp from "./werewolf_game/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<GameSelectorScreen />} />
      <Route path="/novel" element={<DemoNovelGameApp />} />
      <Route path="/werewolf" element={<WerewolfGameApp />} />
    </Routes>
  </BrowserRouter>
);

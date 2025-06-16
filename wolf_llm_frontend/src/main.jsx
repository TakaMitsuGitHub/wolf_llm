import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import GameSelectorScreen from "./common/GameSelectorScreen";
import DemoNovelGameApp from "./demo_novel_game/App";
import WerewolfGameApp from "./werewolf_game/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<GameSelectorScreen />} />
      <Route path="/demo_novel_game" element={<DemoNovelGameApp />} />
      <Route path="/werewolf_game" element={<WerewolfGameApp />} />
    </Routes>
  </BrowserRouter>
);

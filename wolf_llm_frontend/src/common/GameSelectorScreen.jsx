import React from "react";
import { useNavigate } from "react-router-dom";
import "./GameSelectorScreen.css";

function GameSelectorScreen() {
  const navigate = useNavigate();

  return (
    <div className="selector-container">
      <div className="selector-window">
        <h1>ゲーム選択</h1>
        <button onClick={() => navigate("/demo_novel_game")}>demo_novel_game</button>
        <button onClick={() => navigate("/werewolf_game")}>開発中</button>
      </div>
    </div>
  );
}

export default GameSelectorScreen;

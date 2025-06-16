import React, { useState } from "react";
import WerewolfEngine from "./components/WerewolfEngine";
import MenuScreen from "./components/MenuScreen";
import SaveLoadModal from "../demo_novel_game/components/SaveLoadModal"; // 共通コンポーネントを再利用

function WerewolfGameApp() {
  const [view, setView] = useState("menu"); // menu, game
  const [saveLoadModalOpen, setSaveLoadModalOpen] = useState(false);
  const [gameState, setGameState] = useState(null);

  const handleNewGame = () => {
    setGameState({
      playerName: "プレイヤー",
    });
    setView("game");
  };

  const handleContinue = () => {
    setSaveLoadModalOpen(true);
  };

  return (
    <div>
      {view === "menu" && (
        <MenuScreen onNewGame={handleNewGame} onContinue={handleContinue} />
      )}
      {view === "game" && <WerewolfEngine gameState={gameState} />}
      
      {saveLoadModalOpen && (
        <SaveLoadModal 
          onClose={() => setSaveLoadModalOpen(false)}
          onLoad={(savedData) => {
            setGameState(savedData);
            setView("game");
            setSaveLoadModalOpen(false);
          }}
          currentState={gameState}
        />
      )}
    </div>
  );
}

export default WerewolfGameApp;

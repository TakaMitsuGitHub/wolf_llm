import React, { useRef, useEffect, useState } from "react";
import bg1 from "../../assets/images/demo_menu_bg.png";
import "./MenuScreen.css";

function MenuScreen({ onNewGame, onContinue }) {
  const gameRef = useRef(null);
  const [fontScale, setFontScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current) {
        setFontScale(gameRef.current.offsetWidth / 1280);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="demo-menu-container">
      <div
        className="demo-game-window"
        ref={gameRef}
        style={{
          "--font-scale": fontScale,
          backgroundImage: `url(${bg1})`,
        }}
      >
        <div className="demo-menu-box">
          <h1 className="demo-menu-title">ビジュアルノベルゲーム</h1>
          <button className="demo-menu-button" onClick={onNewGame}>
            ニューゲーム
          </button>
          <button className="demo-menu-button" onClick={onContinue}>
            コンティニュー
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuScreen;

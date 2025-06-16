import React, { useRef, useEffect, useState } from "react";
import bg1 from "../../assets/images/demo_menu_bg.png";
import "./MenuScreen.css";

/**
 * props
 *   onNewGame   … ニューゲーム開始
 *   onContinue  … ロード用モーダルを開く   ★追加
 */
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
    <div className="menu-container">
      <div
        className="game-window"
        ref={gameRef}
        style={{
          "--font-scale": fontScale,
          backgroundImage: `url(${bg1})`,
        }}
      >
        <div className="menu-content">
          <h1>ビジュアルノベルゲーム</h1>

          {/* ニューゲーム */}
          <button onClick={onNewGame}>ニューゲーム</button>

          {/* コンティニュー → ロードモーダルを開く */}
          <button onClick={onContinue}>コンティニュー</button>
        </div>
      </div>
    </div>
  );
}

export default MenuScreen;

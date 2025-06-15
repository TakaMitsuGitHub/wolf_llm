// demo_novel_game/App.js
import { useState }          from "react";
import MenuScreen            from "./components/MenuScreen";
import DemoNovelEngine       from "./components/DemoNovelEngine";
import SaveLoadModal         from "./components/SaveLoadModal";
import * as saveManager      from "./save/saveManagerLocal";

export default function DemoNovelGameApp() {
  /* 画面の状態  ---------------------------- */
  //   "menu"  … メニュー画面
  //   "novel" … ゲーム本編
  const [view, setView] = useState("menu");

  /* コンティニューモーダル ----------------- */
  const [loadOpen,    setLoadOpen]    = useState(false);
  const [initialSave, setInitialSave] = useState(null);   // ロードしたセーブデータ

  /* メニューのハンドラ ---------------------- */
  const handleNewGame   = () => setView("novel");
  const handleContinue  = () => setLoadOpen(true);

  /* モーダルで「ロード」を押したとき -------- */
  const handleLoaded = (save) => {
    setInitialSave(save);  //  → エンジンへ
    setView("novel");      //  → 本編画面へ切り替え
    setLoadOpen(false);    //  → モーダルを閉じる
  };

  return (
    <>
      {/* ────────── メニュー画面 ────────── */}
      {view === "menu" && (
        <>
          <MenuScreen
            onNewGame={handleNewGame}
            onContinue={handleContinue}      // ★追加
          />

          {loadOpen && (
            <SaveLoadModal
              mode="load"
              saveManager={saveManager}
              onLoad={handleLoaded}          // ★ロード確定
              onClose={() => setLoadOpen(false)}
            />
          )}
        </>
      )}

      {/* ────────── ゲーム本編 ────────── */}
      {view === "novel" && (
        <DemoNovelEngine initialSave={initialSave} />
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import "./SaveLoadModal.css";

/**
 * props
 *   mode        "save" | "load"
 *   saveManager localStorage 保存ユーティリティ
 *   onSave      現在の状態をセーブするコールバック
 *   onLoad      選択したデータでロードするコールバック
 *   onClose     モーダルを閉じる
 */
export default function SaveLoadModal({
  mode = "load",
  saveManager,
  onSave,
  onLoad,
  onClose,
}) {
  const [saves, setSaves] = useState([]);

  /* saveManager が変わったときも再読込する */
  useEffect(() => {
    setSaves(saveManager.loadAll());
  }, [saveManager]);

  const handleDelete = (idx) => {
    saveManager.remove(idx);
    setSaves(saveManager.loadAll());
  };

  const handleLoad = (idx) => {
    onLoad(saves[idx]);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{mode === "save" ? "セーブ画面" : "ロード画面"}</h2>

        {mode === "save" && (
          <button onClick={onSave}>現在の状態をセーブ</button>
        )}

        {saves.length === 0 && <p>保存データがありません</p>}

        <ul>
          {saves.map((save, idx) => (
            <li key={idx}>
              <span>
                {new Date(save.timestamp).toLocaleString()} /{" "}
                {save.chapterId} / {save.groupId}
              </span>
              {mode === "load" && (
                <button onClick={() => handleLoad(idx)}>ロード</button>
              )}
              <button onClick={() => handleDelete(idx)}>削除</button>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

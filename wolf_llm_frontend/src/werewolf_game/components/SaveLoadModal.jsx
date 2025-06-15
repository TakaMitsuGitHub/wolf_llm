// src/werewolf_game/components/SaveLoadModal.jsx
import React, { useState, useEffect } from "react";
import styles from "./SaveLoadModal.module.css";

export default function SaveLoadModal({
  mode = "load",
  saveManager,
  onSave,
  onLoad,
  onClose,
}) {
  const [saves, setSaves] = useState([]);

  useEffect(() => {
    setSaves(saveManager.loadAll());
  }, [saveManager]);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <h2 className={styles.header}>
          {mode === "save" ? "セーブ画面" : "ロード画面"}
        </h2>

        {mode === "save" && (
          <button className={styles.button} onClick={onSave}>
            現在の状態をセーブ
          </button>
        )}

        {saves.length === 0 && <p>保存データがありません</p>}

        <ul className={styles.list}>
          {saves.map((save, idx) => (
            <li key={idx} className={styles.listItem}>
              <span className={styles.info}>
                {new Date(save.timestamp).toLocaleString()} /{" "}
                {save.chapterId} / {save.groupId}
              </span>
              {mode === "load" && (
                <button
                  className={styles.button}
                  onClick={() => onLoad(saves[idx])}
                >
                  ロード
                </button>
              )}
              <button
                className={`${styles.button} ${styles.delete}`}
                onClick={() => {
                  saveManager.remove(idx);
                  setSaves(saveManager.loadAll());
                }}
              >
                削除
              </button>
            </li>
          ))}
        </ul>

        <button className={styles.button} onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
}

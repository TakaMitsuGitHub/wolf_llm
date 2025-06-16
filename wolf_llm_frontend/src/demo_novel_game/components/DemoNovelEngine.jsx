import React, { useState, useEffect, useRef, useCallback } from "react";
import "./DemoNovelEngine.css";
import { API_BASE } from "../../config/api";
import SaveLoadModal from "./SaveLoadModal";
import LogModal from "./LogModal";
import * as saveManager from "../save/saveManagerLocal";

export default function DemoNovelEngine({ initialSave = null }) {
  const gameRef = useRef(null);
  const skipLogRef = useRef(false);
  const skipFetchRef = useRef(false);

  const [fontScale, setFontScale] = useState(1);
  const [chapterId, setChapterId] = useState("chapter_1");
  const [groupId, setGroupId] = useState("group_1");
  const [groupData, setGroupData] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState([]);
  const [pendingStepId, setPendingStepId] = useState(null);

  const [bgImage, setBgImage] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [text, setText] = useState("");
  const [charImageUrl, setCharImageUrl] = useState("");
  const [charManifest, setCharManifest] = useState(null);

  const [isFreeInputMode, setIsFreeInputMode] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [nextGroupId, setNextGroupId] = useState("");

  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const [log, setLog] = useState([]);
  const pushLog = useCallback((entry) => {
    setLog((prev) => [...prev, entry]);
  }, []);

  /* ★ ステップ描画 */
  const setStepData = useCallback(
    (step) => {
      setBgImage(step.BackgroundImage);
      setSpeaker(step.Speaker);
      setText(step.Text);
      if (step.char_img && charManifest) {
        const { id, expression } = step.char_img;
        const url = charManifest[id]?.expressions?.[expression] ?? "";
        setCharImageUrl(url);
      } else {
        setCharImageUrl("");
      }
    },
    [charManifest]
  );

  /* ★ ステップ切り替え時 ログ追加 */
  useEffect(() => {
    if (!groupData?.Steps?.length) return;
    const step = groupData.Steps[stepIndex];
    setStepData(step);

    if (skipLogRef.current) {
      skipLogRef.current = false;
      return;
    }

    pushLog({ Speaker: step.Speaker, Text: step.Text });
  }, [stepIndex, groupData, setStepData, pushLog]);

  /* ★ セーブ復元 */
  const applySave = useCallback((save) => {
    if (save.groupData) {
      skipLogRef.current = true;
      setGroupData(save.groupData);
      const idx = save.groupData.Steps.findIndex((s) => s.StepId === save.stepId);
      const resolved = idx !== -1 ? idx : 0;
      setStepIndex(resolved);
      setLog(save.log ?? []);
      skipFetchRef.current = true;
      setChapterId(save.chapterId);
      setGroupId(save.groupId);
      setPendingStepId(save.stepId);
    } else {
      setChapterId(save.chapterId);
      setGroupId(save.groupId);
      setPendingStepId(save.stepId);
    }
    setIsLoadOpen(false);
  }, []);

  useEffect(() => {
    if (initialSave) applySave(initialSave);
  }, [initialSave, applySave]);

  /* ★ 画面リサイズ */
  useEffect(() => {
    const onResize = () => {
      if (gameRef.current) {
        setFontScale(gameRef.current.offsetWidth / 1280);
      }
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ★ キャラマニフェスト読み込み */
  useEffect(() => {
    fetch("/character_manifest.json")
      .then((r) => r.json())
      .then(setCharManifest)
      .catch(console.error);
  }, []);

  /* ★ グループ取得 */
  useEffect(() => {
    if (!chapterId || !groupId) return;
    if (skipFetchRef.current) {
      skipFetchRef.current = false;
      return;
    }
    fetch(`${API_BASE}/chapters/group/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ChapterId: chapterId, GroupId: groupId })
    })
      .then((r) => r.json())
      .then((data) => {
        setGroupData(data);
        setStepIndex(0);
      })
      .catch(console.error);
  }, [chapterId, groupId]);

  /* ★ pendingStepId処理 */
  useEffect(() => {
    if (!pendingStepId || !groupData?.Steps?.length) return;
    const idx = groupData.Steps.findIndex((s) => s.StepId === pendingStepId);
    if (idx !== -1) {
      setStepIndex(idx);
    }
    setPendingStepId(null);
  }, [groupData, pendingStepId]);

  /* ★ 次へ */
  const handleNext = () => {
    if (groupData?.Type !== "text") return;
    const next = stepIndex + 1;
    if (next < groupData.Steps.length) {
      setStepIndex(next);
      return;
    }
    const { NextGroupId, NextChapterId } = groupData.Next ?? {};
    if (NextGroupId) {
      setGroupId(NextGroupId);
    } else if (NextChapterId) {
      setChapterId(NextChapterId);
      setGroupId("group_1");
    } else {
      alert("エンディング（次のグループがありません）");
    }
  };

  /* ★ 選択肢 */
  const handleChoice = (choice) => {
    if (choice.Next?.Process === "free_input") {
      setIsFreeInputMode(true);
      setUserInput("");
      setNextGroupId(choice.Next.NextGroupId);
      return;
    }
    if (choice.Next?.NextGroupId) {
      setGroupId(choice.Next.NextGroupId);
    } else {
      alert("次の遷移先が定義されていません");
    }
  };

  /* ★ 自由入力送信 */
  const handleInputSubmit = async () => {
    if (!userInput.trim()) {
      alert("入力してください");
      return;
    }
  
    try {
      const freeInputChoice = groupData?.Choices?.find(
        (c) => c.Next?.Process === "free_input"
      );
      const promptAddInfo = freeInputChoice?.PromptAddInfo ?? {};

      // 自動ログ追加を１回スキップさせる
      skipLogRef.current = true;
  
      const res = await fetch(`${API_BASE}/llm/generate_group/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          InputText: userInput,
          ChapterId: chapterId,
          GroupId: groupId,
          NextGroupId: nextGroupId,
          PromptAddInfo: promptAddInfo,
          Log: log.slice(-10),
        }),
      });
  
      if (!res.ok) throw new Error("LLM応答取得失敗");
  
      const newGroup = await res.json();
  
      setGroupData(newGroup);
      setSteps(newGroup.Steps ?? []);
      setStepIndex(0);
      setIsFreeInputMode(false);

      // 明示的に一度だけログを追加
      if (newGroup.Steps?.length) {
        const first = newGroup.Steps[0];
        pushLog({ Speaker: first.Speaker, Text: first.Text });
      }
    } catch (e) {
      console.error(e);
      alert("LLM応答に失敗しました");
    }
  };

  /* ★ セーブ */
  const handleSave = () => {
    const save = {
      chapterId,
      groupId,
      stepId: groupData?.Steps?.[stepIndex]?.StepId ?? null,
      groupData,
      log,
      flags: {},
      timestamp: Date.now()
    };
    saveManager.add(save);
    alert("セーブしました！");
  };

  return (
    <div className="novel-container">
      <div
        className="game-window"
        ref={gameRef}
        style={{
          "--font-scale": fontScale,
          backgroundImage: `url(/images/${bgImage})`
        }}
        onClick={
          groupData?.Type === "text" &&
          !isFreeInputMode &&
          !isSaveOpen &&
          !isLoadOpen &&
          !isLogOpen
            ? handleNext
            : undefined
        }
      >
        {charImageUrl && (
          <img src={charImageUrl} alt="" className="char-image" />
        )}
        <div className="novel-content">
          <p>
            <strong>{speaker}</strong>：{text}
          </p>
          {groupData?.Type === "choice" && !isFreeInputMode && (
            <div className="choice-buttons">
              {groupData.Choices.map((c, i) => (
                <button
                  key={i}
                  className="choice-button"
                  onClick={() => handleChoice(c)}
                >
                  {c.Text}
                </button>
              ))}
            </div>
          )}
          {isFreeInputMode && (
            <div className="free-input">
              <p>主人公の行動を入力してください：</p>
              <input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />
              <button onClick={handleInputSubmit}>送信</button>
            </div>
          )}
        </div>
      </div>

      <div className="save-load-buttons">
        <button onClick={() => setIsSaveOpen(true)}>セーブへ</button>
        <button onClick={() => setIsLoadOpen(true)}>ロードへ</button>
        <button onClick={() => setIsLogOpen(true)}>ログ</button>
      </div>

      {isSaveOpen && (
        <SaveLoadModal
          mode="save"
          saveManager={saveManager}
          onSave={handleSave}
          onClose={() => setIsSaveOpen(false)}
        />
      )}
      {isLoadOpen && (
        <SaveLoadModal
          mode="load"
          saveManager={saveManager}
          onLoad={applySave}
          onClose={() => setIsLoadOpen(false)}
        />
      )}
      {isLogOpen && (
        <LogModal log={log} onClose={() => setIsLogOpen(false)} />
      )}
    </div>
  );
}

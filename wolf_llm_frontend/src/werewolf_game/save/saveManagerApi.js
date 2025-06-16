// src/werewolf_game/save/saveManagerApi.js
import { API_BASE } from "../../common/api";

const headers = {
  "Content-Type": "application/json",
};

// 一覧取得
export const loadAll = async () => {
  const res = await fetch(`${API_BASE}/werewolf/save/list/`, {
    headers,
  });
  if (!res.ok) throw new Error("ロード一覧取得失敗");
  // 返ってくる形は [{ id, data: { groupData, stepId, log, … }, timestamp }, …]
  return res.json();
};

// 新規セーブ（DB登録）
export const add = async (payload) => {
  const res = await fetch(`${API_BASE}/werewolf/save/`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("セーブ失敗");
  return res.json(); // { id: ..., timestamp: ... }
};

// 削除
export const remove = async (saveId) => {
  const res = await fetch(`${API_BASE}/werewolf/save/${saveId}/`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("削除失敗");
};

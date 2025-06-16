// src/werewolf_game/save/saveManagerApi.js
import { getAuthToken } from "../../common/auth";
import { API_BASE } from "../../config/api";

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`
});

export const loadAll = async () => {
  const res = await fetch(`${API_BASE}/werewolf/save/list/`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("ロード一覧取得失敗");
  return res.json(); // [{id, data, timestamp}, ...]
};

export const add = async (payload) => {
  const res = await fetch(`${API_BASE}/werewolf/save/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("セーブ失敗");
  return res.json(); // {id: ...}
};

export const remove = async (saveId) => {
  const res = await fetch(`${API_BASE}/werewolf/save/${saveId}/`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("削除失敗");
};

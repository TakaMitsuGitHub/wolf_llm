// src/demo_novel_game/save/saveManagerLocal.js
const KEY = "demo_novel_saves";

export function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function add(save) {
  const list = loadAll();
  list.unshift(save);          // 先頭に追加
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 30))); // 最大30個
}

export function remove(idx) {
  const list = loadAll();
  list.splice(idx, 1);
  localStorage.setItem(KEY, JSON.stringify(list));
}


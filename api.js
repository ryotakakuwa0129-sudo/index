// ===== 設定 =====
const LIFF_ID = "2008725002-jHJsEKRx";
const GAS_URL =
  "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

// ===== 共通POST =====
async function post(data) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ===== ユーザーID取得 =====
async function getUserId() {
  const profile = await liff.getProfile();
  return profile.userId;
}


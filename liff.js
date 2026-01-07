// =====================
// 設定
// =====================
const LIFF_ID = "2008725002-jHJsEKRx";
const GAS_URL = "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

// =====================
// グローバル共有（他JSから使用）
// =====================
window.APP = {
  userId: null,
  registered: false
};

// =====================
// LIFF 初期化 & 登録判定
// =====================
async function initLIFF(pageName) {
  try {
    console.log("LIFF init start");

    await liff.init({ liffId: LIFF_ID });
    console.log("LIFF initialized");

    if (!liff.isLoggedIn()) {
      console.log("Not logged in → login");
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    const userId = profile.userId;

    window.APP.userId = userId;
    console.log("userId:", userId);

    // =====================
    // 登録判定（GAS）
    // =====================
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkUser",
        userId: userId
      })
    });

    console.log("GAS status:", res.status);

    const raw = await res.text();   // ★重要
    console.log("GAS raw response:", raw);

    let result;
    try {
      result = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error", err);
      alert("サーバー応答エラー");
      return;
    }

    window.APP.registered = !!result.registered;
    console.log("registered:", window.APP.registered);

    // =====================
    // ページ制御
    // =====================
    if (!window.APP.registered && pageName !== "register") {
      console.log("未登録 → register.html");
      location.replace("register.html");
      return;
    }

    if (window.APP.registered && pageName === "register") {
      console.log("登録済 → LIFF close");
      liff.closeWindow();
      return;
    }

    // =====================
    // ページ別初期化
    // =====================
    if (pageName === "add" && typeof window.initAddPage === "function") {
      console.log("init add page");
      window.initAddPage();
    }

    if (pageName === "done" && typeof window.initDonePage === "function") {
      console.log("init done page");
      window.initDonePage();
    }

    console.log("LIFF init finished");

  } catch (e) {
    console.error("LIFF ERROR", e);
    alert("エラーが発生しました。LINEから再度開いてください。");
  }
}

// =====================
// 自動実行（HTML側で pageName 指定）
// =====================
// 例：<script>initLIFF("add")</script>



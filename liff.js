// =====================
// 設定
// =====================
const LIFF_ID = "2008725002-jHJsEKRx";
const GAS_URL = "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

// =====================
// グローバル共有
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

    // =====================
    // userId 取得（必須）
    // =====================
    const idToken = liff.getDecodedIDToken();
    const userId = idToken.sub;

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

    const raw = await res.text();
    console.log("GAS raw response:", raw);

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      alert("GASの応答が不正です");
      return;
    }

    window.APP.registered = !!result.registered;
    console.log("registered:", window.APP.registered);

    // =====================
    // index 分岐（★ここが正解）
    // =====================
    if (pageName === "index") {
      location.replace(
        window.APP.registered ? "done.html" : "register.html"
      );
      return;
    }

    // =====================
    // register ページ制御
    // =====================
    if (!window.APP.registered && pageName !== "register") {
      location.replace("register.html");
      return;
    }

    if (window.APP.registered && pageName === "register") {
      liff.closeWindow();
      return;
    }

    // =====================
    // ページ別初期化
    // =====================
    if (pageName === "add" && typeof window.initAddPage === "function") {
      window.initAddPage();
    }

    if (pageName === "done" && typeof window.initDonePage === "function") {
      window.initDonePage();
    }

    console.log("LIFF init finished");

  } catch (e) {
    console.error(e);
    alert("LINEから開き直してください");
  }
}


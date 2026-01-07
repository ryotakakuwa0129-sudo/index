// =====================
// 設定
// =====================
const LIFF_ID = "あなたのLIFF_ID";
const GAS_URL = "あなたのGAS_WebApp_URL";

// グローバル共有（他JSから使用）
window.APP = {
  userId: null,
  registered: false
};

// =====================
// LIFF 初期化 & 登録判定
// =====================
async function initLIFF(pageName) {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    const userId = profile.userId;

    window.APP.userId = userId;

    // ---- 登録判定 ----
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkUser",
        userId: userId
      })
    });

    const result = await res.json();
    window.APP.registered = result.registered;

    // ---- ページ制御 ----
    if (!result.registered && pageName !== "register") {
      // 未登録 → 強制登録ページ
      location.replace("register.html");
      return;
    }

    if (result.registered && pageName === "register") {
      // 登録済で登録画面 → 自動クローズ
      liff.closeWindow();
      return;
    }

    // ---- ページ別初期化 ----
    if (pageName === "add" && window.initAddPage) {
      window.initAddPage();
    }

    if (pageName === "done" && window.initDonePage) {
      window.initDonePage();
    }

  } catch (e) {
    console.error(e);
    alert("エラーが発生しました。LINEから再度開いてください。");
  }
}



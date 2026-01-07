// =====================
// 設定
// =====================
const LIFF_ID = "あなたのLIFF_ID";
const GAS_URL = "あなたのGAS_WebApp_URL";

// =====================
// LIFF 初期化
// =====================
async function initLIFF() {
  try {
    await liff.init({ liffId: LIFF_ID });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();
    const userId = profile.userId;

    // 今開いているページ名
    const currentPage = location.pathname.split("/").pop();

    // 未登録チェック
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "check",
        userId: userId
      })
    });

    const result = await res.json();

    // ---------- 未登録 ----------
    if (!result.registered) {
      // register.html 以外なら登録画面へ
      if (currentPage !== "register.html") {
        location.replace("register.html");
      }
      return;
    }

    // ---------- 登録済 ----------
    // register.html に居たら閉じる or 移動
    if (currentPage === "register.html") {
      liff.closeWindow();
    }

  } catch (err) {
    console.error("LIFF初期化エラー", err);
    alert("システムエラーが発生しました。もう一度開き直してください。");
  }
}




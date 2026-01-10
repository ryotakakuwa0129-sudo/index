// =====================
// 設定
// =====================
const LIFF_ID = "2008725002-jHJsEKRx";

// =====================
// LIFF初期化
// =====================
async function initLIFF() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const idToken = liff.getDecodedIDToken();
  window.USER_ID = idToken.sub;
}

// =====================
// URL分岐 (?page=add)
// =====================
function routeByQuery() {
  const p = new URLSearchParams(location.search).get("page");

  if (p === "add") location.replace("add.html");
  if (p === "done") location.replace("done.html");
  if (p === "register") location.replace("register.html");
}

// =====================
// 自動実行
// =====================
(async()=>{
  await initLIFF();
  routeByQuery();
})();

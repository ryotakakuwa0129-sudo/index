const GAS_URL = "あなたのGAS WebApp URL";
const LIFF_ID = "あなたのLIFF ID";

let userId = "";
let registered = false;

async function liffInit() {
  await liff.init({ liffId: LIFF_ID });
  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }
  userId = liff.getContext().userId;

  const res = await post({ action: "checkUser", userId });
  registered = res.registered;

  if (!registered && !location.pathname.includes("register")) {
    location.href = "register.html";
  }
}

async function post(data) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

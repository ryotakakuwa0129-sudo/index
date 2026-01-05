const LIFF_ID = "2008725002-jHJsEKRx";
const GAS_URL = "https://script.google.com/macros/s/AKfycbz910FJbvEKdMV-8dEGncfx2YocZHmNVeuyZHRA26c6SmqEaBEgPzwURfl1fQonvpTbpQ/exec";

let userId = "";

async function liffInit() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    throw "login";
  }

  userId = liff.getContext().userId;

  const r = await post({ action:"checkUser", userId });
  if (!r.registered) {
    location.href = "register.html";
    throw "not registered";
  }
}

async function post(data) {
  const r = await fetch(GAS_URL,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(data)
  });
  return r.json();
}


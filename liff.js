const LIFF_ID = "あなたのLIFF_ID";
const GAS_URL = "あなたのGAS_URL";

/* ---------------- LIFF初期化 ---------------- */

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  if (!liff.isInClient()) {
    alert("LINEアプリ内で開いてください");
    throw new Error("Not in LINE");
  }
}

/* ---------------- ユーザーID（安全版） ---------------- */

function getUserId() {
  const ctx = liff.getContext();
  if (!ctx || !ctx.userId) {
    alert("userIdが取得できません");
    throw new Error("userId missing");
  }
  return ctx.userId;
}

/* ---------------- GAS通信（絶対に止まらない） ---------------- */

async function post(data) {
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await res.text();
    return JSON.parse(text);
  } catch (e) {
    console.error("GAS通信エラー", e);
    alert("通信エラーが発生しました");
    throw e;
  }
}

/* ---------------- ルーティング ---------------- */

function route() {
  const page = new URLSearchParams(location.search).get("page");
  if (page === "add") renderAdd();
  else if (page === "done") renderDone();
  else if (page === "register") renderRegister();
  else renderMenu();
}

/* ---------------- 画面 ---------------- */

function renderMenu() {
  app.innerHTML = `
    <h2>📘 宿題管理</h2>
    <a href="?page=add">➕ 追加</a>
    <a href="?page=done">✅ 完了</a>
    <a href="?page=register">👤 登録</a>
  `;
}

/* ---------------- 登録 ---------------- */

function renderRegister() {
  app.innerHTML = `
    <h2>ユーザー登録</h2>
    <button id="reg">登録</button>
  `;

  document.getElementById("reg").onclick = async () => {
    const userId = getUserId();
    await post({ action: "register", userId });
    alert("登録完了");
    liff.closeWindow();
  };
}

/* ---------------- 宿題追加 ---------------- */

function renderAdd() {
  app.innerHTML = `
    <h2>宿題追加</h2>
    <div id="subjects"></div>
    <input id="text" placeholder="内容">
    <input id="date" type="date">
    <button id="add">追加</button>
  `;

  const subjects = ["国語","数学","理科","社会","英語","音楽","美術","保体","その他"];
  let subject = "";

  document.getElementById("subjects").innerHTML =
    subjects.map(s=>`<button class="sub">${s}</button>`).join("");

  document.querySelectorAll(".sub").forEach(b=>{
    b.onclick = ()=>{
      document.querySelectorAll(".sub").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      subject = b.textContent;
    };
  });

  document.getElementById("add").onclick = async () => {
    const text = text.value;
    const date = date.value;
    if (!subject || !text || !date) return alert("未入力あり");

    await post({ action:"addHomework", subject, text, date });
    alert("追加完了");
    liff.closeWindow();
  };
}

/* ---------------- 完了登録 ---------------- */

async function renderDone() {
  app.innerHTML = `<h2>完了登録</h2><div id="list"></div><button id="done">完了</button>`;

  const userId = getUserId();
  const list = await post({ action:"getUndoneHomework", userId });

  list.forEach(v=>{
    listDiv.innerHTML += `
      <label>
        <input type="checkbox" value="${v}"> ${v}
      </label><br>
    `;
  });

  done.onclick = async ()=>{
    const checked = [...document.querySelectorAll("input:checked")].map(i=>i.value);
    if (!checked.length) return;

    await post({ action:"doneHomework", userId, doneList: checked });
    alert("完了登録しました");
    liff.closeWindow();
  };
}

/* ---------------- 起動 ---------------- */

document.addEventListener("DOMContentLoaded", async () => {
  await initLiff();
  route();
});

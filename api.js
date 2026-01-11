const GAS_URL = "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

async function post(data) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // ★重要
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getUserId() {
  const p = await liff.getProfile();
  return p.userId;
}

/* ---------- 画面 ---------- */

function renderMenu() {
  document.getElementById("app").innerHTML = `
    <h2>📘 宿題管理</h2>
    <a href="?page=add" class="menu-btn">➕ 追加</a>
    <a href="?page=done" class="menu-btn">✅ 完了</a>
    <a href="?page=register" class="menu-btn">👤 登録</a>
  `;
}

function renderRegister() {
  document.getElementById("app").innerHTML = `
    <h2>ユーザー登録</h2>
    <button id="reg">登録する</button>
  `;
  document.getElementById("reg").onclick = async () => {
    const userId = await getUserId();
    await post({ action: "register", userId });
    showToast("登録しました！");
  };
}

/* ---------- 宿題追加 ---------- */

function renderAdd() {
  document.getElementById("app").innerHTML = `
    <h2>宿題追加</h2>

    <div class="subjects">
      ${["国語","数学","理科","社会","英語","音楽","美術","保体","その他"]
        .map(s=>`<button class="sub">${s}</button>`).join("")}
    </div>

    <input id="text" placeholder="宿題内容">
    <input id="date" type="date">
    <button id="add">追加</button>
  `;

  let subject = "";
  document.querySelectorAll(".sub").forEach(b=>{
    b.onclick = ()=>{
      document.querySelectorAll(".sub").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      subject = b.textContent;
    };
  });

  document.getElementById("add").onclick = async () => {
    const userId = await getUserId();
    const text = document.getElementById("text").value;
    const date = document.getElementById("date").value;
    if (!subject || !text || !date) return;

    await post({ action:"addHomework", subject, text, date });
    showToast("宿題を追加しました！");
  };
}

/* ---------- 完了登録 ---------- */

function renderDone() {
  document.getElementById("app").innerHTML = `<h2>完了登録</h2><div id="list"></div><button id="done">完了</button>`;
  loadUndone();
}

async function loadUndone() {
  const userId = await getUserId();
  const list = await post({ action:"getUndoneHomework", userId });

  const div = document.getElementById("list");
  div.innerHTML = list.map(v=>`
    <label><input type="checkbox" value="${v}">${v}</label>
  `).join("");

  document.getElementById("done").onclick = async () => {
    const checked = [...document.querySelectorAll("input:checked")].map(i=>i.value);
    if (!checked.length) return;
    await post({ action:"doneHomework", userId, doneList: checked });
    showToast("完了しました！");
  };
}

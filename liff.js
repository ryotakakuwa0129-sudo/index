// =====================
// 設定
// =====================
const LIFF_ID = "2008725002-jHJsEKRx";
const GAS_URL = "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

// =====================
// 状態
// =====================
let USER_ID = null;

// =====================
// 初期化
// =====================
(async function(){
  await liff.init({ liffId: LIFF_ID });

  if(!liff.isLoggedIn()){
    liff.login();
    return;
  }

  USER_ID = liff.getDecodedIDToken().sub;

  const page = new URLSearchParams(location.search).get("page") || "add";

  if(page === "register") renderRegister();
  if(page === "add") renderAdd();
  if(page === "done") renderDone();
})();

// =====================
// register
// =====================
function renderRegister(){
  app.innerHTML = `
  <div class="card">
    <h1>👤 初回登録</h1>
    <input id="name" placeholder="名前">
    <button onclick="register()">登録</button>
  </div>`;
}

async function register(){
  await api("registerUser",{ userId: USER_ID, name: name.value });
  location.href = "?page=done";
}

// =====================
// add
// =====================
function renderAdd(){
  app.innerHTML = `
  <div class="card">
    <h1>➕ 宿題追加</h1>

    <div class="subjects">
      ${["国語","数学","理科","社会","英語","保体","美術","音楽","その他"]
        .map(s=>`<button onclick="sel('${s}')">${s}</button>`).join("")}
    </div>

    <input id="text" placeholder="宿題内容">
    <input id="date" type="date">

    <button onclick="add()">追加</button>
  </div>`;
}

let SUBJECT="";
function sel(s){
  SUBJECT=s;
  document.querySelectorAll(".subjects button").forEach(b=>b.classList.remove("on"));
  event.target.classList.add("on");
}

async function add(){
  await api("addHomework",{
    userId: USER_ID,
    subject: SUBJECT,
    text: text.value,
    date: date.value
  });
  location.href = "?page=done";
}

// =====================
// done
// =====================
async function renderDone(){
  const list = await api("getUndoneHomework",{ userId: USER_ID });

  app.innerHTML = `
  <div class="card">
    <h1>✅ 完了チェック</h1>
    ${list.map(t=>`
      <label class="check">
        <input type="checkbox" value="${t}">
        <span>${t}</span>
      </label>
    `).join("")}
    <button onclick="done()">完了</button>
  </div>`;
}

async function done(){
  const checked=[...document.querySelectorAll("input:checked")].map(i=>i.value);
  await api("doneHomework",{ userId: USER_ID, doneList: checked });

  setTimeout(()=>liff.closeWindow(),1500);
}


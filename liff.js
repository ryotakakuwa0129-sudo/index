const LIFF_ID = "2008725002-jHJsEKRx";

let userId = null;
let selectedSubject = null;

/* ========= page取得 ========= */
function getPage() {
  return new URLSearchParams(location.search).get("page") || "add";
}

/* ========= page表示 ========= */
function showPage() {
  document.querySelectorAll("section").forEach(s => s.style.display = "none");
  const p = document.getElementById("page-" + getPage());
  if (p) p.style.display = "block";
}

/* ========= LIFF init ========= */
async function init() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  userId = (await liff.getProfile()).userId;
  showPage();

  const res = await api({
    action: "checkUser",
    userId
  });

  if (!res.registered && getPage() !== "register") {
    location.href = "index.html?page=register";
    return;
  }

  if (getPage() === "done") {
    loadUndone();
    setTimeout(() => liff.closeWindow(), 1500);
  }
}

init();

/* ========= register ========= */
function register() {
  api({ action: "register", userId })
    .then(() => location.href = "index.html?page=add");
}

/* ========= subject ========= */
function selectSubject(s) {
  selectedSubject = s;
  document.querySelectorAll(".subjects button").forEach(b => {
    b.classList.toggle("active", b.textContent === s);
  });
}

/* ========= add ========= */
function addHomework() {
  const text = hwText.value.trim();
  const date = hwDate.value;

  if (!selectedSubject || !text || !date) {
    alert("すべて入力してください");
    return;
  }

  api({
    action: "addHomework",
    subject: selectedSubject,
    text,
    date
  }).then(() => {
    hwText.value = "";
    alert("追加しました");
  });
}

/* ========= load undone ========= */
function loadUndone() {
  api({
    action: "getUndoneHomework",
    userId
  }).then(list => {
    doneList.innerHTML = list.map(v => `
      <label class="check">
        <input type="checkbox" value="${v}"> ${v}
      </label>
    `).join("");
  });
}

/* ========= done ========= */
function doneHomework() {
  const done = [...document.querySelectorAll("input:checked")]
    .map(c => c.value);

  api({
    action: "doneHomework",
    userId,
    doneList: done
  }).then(() => {
    location.href = "index.html?page=done";
  });
}


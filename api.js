// =====================
const GAS_URL =
  "https://script.google.com/macros/s/AKfycby0tjXYVUWyPRwqs7r7PwJrrslfTCdZIeQmFwwT1JUfMF9N4a6XwXtgvMz-JDIzIt_mxQ/exec";

// =====================
async function api(action, data = {}) {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      userId: window.APP.userId,
      ...data
    })
  });
  return await res.json();
}

// =====================
// 登録
// =====================
document.addEventListener("click", async e => {
  if (e.target.id === "registerBtn") {
    await api("register");
    liff.closeWindow();
  }
});

// =====================
// 教科選択
// =====================
document.addEventListener("click", e => {
  if (e.target.dataset.subject) {
    window.APP.subject = e.target.dataset.subject;
    document
      .querySelectorAll(".subjects button")
      .forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
  }
});

// =====================
// 宿題追加
// =====================
document.addEventListener("click", async e => {
  if (e.target.id === "addBtn") {
    if (!window.APP.subject) {
      alert("教科を選択してください");
      return;
    }

    const text = document.getElementById("hwText").value;
    const date = document.getElementById("hwDate").value;

    if (!text || !date) {
      alert("内容と期限は必須です");
      return;
    }

    await api("addHomework", {
      subject: window.APP.subject,
      text,
      date
    });

    liff.closeWindow();
  }
});

// =====================
// 完了一覧取得
// =====================
async function loadDonePage() {
  const r = await api("getUndoneHomework");
  const box = document.getElementById("doneList");
  box.innerHTML = "";

  r.forEach(t => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${t}"> ${t}`;
    box.appendChild(label);
  });
}

// =====================
document.addEventListener("click", async e => {
  if (e.target.id === "doneBtn") {
    const list = [...document.querySelectorAll("#doneList input:checked")]
      .map(i => i.value);

    await api("doneHomework", { doneList: list });
    liff.closeWindow();
  }
});

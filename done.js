let undoneList = [];

async function initDonePage() {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "getUndoneHomework",
      userId: APP.userId
    })
  });

  undoneList = await res.json();
  renderList();
}

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  undoneList.forEach(t => {
    const div = document.createElement("div");
    div.className = "item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = t;

    const label = document.createElement("span");
    label.textContent = t;
    label.style.marginLeft = "8px";

    div.appendChild(cb);
    div.appendChild(label);
    list.appendChild(div);
  });
}

async function submitDone() {
  const checked = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map(cb => cb.value);

  if (checked.length === 0) {
    alert("1つ以上選択してください");
    return;
  }

  await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "doneHomework",
      userId: APP.userId,
      doneList: checked
    })
  });

  liff.closeWindow();
}

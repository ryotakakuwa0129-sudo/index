let selectedSubject = "";

const SUBJECTS = [
  "国語","数学","理科","社会","英語",
  "音楽","美術","保体","その他"
];

function initAddPage() {
  const box = document.getElementById("subjects");

  SUBJECTS.forEach(s => {
    const btn = document.createElement("button");
    btn.textContent = s;
    btn.onclick = () => selectSubject(btn, s);
    box.appendChild(btn);
  });
}

function selectSubject(btn, subject) {
  document.querySelectorAll(".subjects button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
  selectedSubject = subject;
}

async function submitHomework() {
  const text = document.getElementById("text").value.trim();
  const date = document.getElementById("date").value;

  if (!selectedSubject || !text || !date) {
    alert("すべて入力してください");
    return;
  }

  await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "addHomework",
      subject: selectedSubject,
      text: `${selectedSubject}：${text}（期限${date}）`,
      date: date
    })
  });

  liff.closeWindow();
}

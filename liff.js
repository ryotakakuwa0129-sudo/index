const LIFF_ID = "2008725002-jHJsEKRx";

async function initLiff() {
  await liff.init({ liffId: LIFF_ID });
}

function getPage() {
  return new URLSearchParams(location.search).get("page");
}

function showToast(text) {
  const t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  setTimeout(() => {
    t.classList.remove("show");
    liff.closeWindow();
  }, 1500);
}

window.addEventListener("DOMContentLoaded", async () => {
  await initLiff();
  const page = getPage();

  if (page === "add") renderAdd();
  else if (page === "done") renderDone();
  else if (page === "register") renderRegister();
  else renderMenu();
});

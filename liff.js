// =====================
const LIFF_ID = "2008725002-jHJsEKRx";

// =====================
window.APP = {
  userId: null,
  page: null,
  subject: null
};

// =====================
async function initLIFF() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const token = liff.getDecodedIDToken();
  window.APP.userId = token.sub;

  const params = new URLSearchParams(location.search);
  window.APP.page = params.get("page") || "add";

  showPage(window.APP.page);
}

// =====================
function showPage(page) {
  document.getElementById("loading").classList.add("hidden");

  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));

  const target = document.getElementById("page-" + page);
  if (target) target.classList.remove("hidden");
}

// =====================
window.addEventListener("DOMContentLoaded", initLIFF);

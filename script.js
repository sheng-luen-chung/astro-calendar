// 🌞 節氣顯示模組
// 功能：讀取 data/solar_terms_2025.json，判斷今天是哪一節氣，並顯示

async function loadSolarTerms() {
  const res = await fetch('data/solar_terms_2025.json');
  return res.json();
}

function formatDate(dt) {
  return dt.toISOString().slice(0, 10);
}

function findCurrentTerm(solarTerms, todayStr) {
  if (solarTerms[todayStr]) return solarTerms[todayStr];
  const dates = Object.keys(solarTerms).sort();
  let prevTerm = null;
  for (const d of dates) {
    if (d > todayStr) break;
    prevTerm = solarTerms[d];
  }
  return prevTerm || '尚未到今年第一節氣';
}

window.addEventListener('DOMContentLoaded', async () => {
  const solarTerms = await loadSolarTerms();
  const today = new Date();
  const todayStr = formatDate(today);
  document.getElementById('today-date').textContent = today.toLocaleDateString();
  const term = findCurrentTerm(solarTerms, todayStr);
  document.getElementById('solar-term').textContent = term;
});
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function animateTrail() {
  tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px'; trail.style.top = ty + 'px';
  requestAnimationFrame(animateTrail);
})();

document.querySelectorAll('a, button, [data-tilt], .feature-item, .future-card, .flow-step, .stat-chip').forEach(el => {
  el.addEventListener('mouseenter', () => { trail.style.transform = 'translate(-50%,-50%) scale(2.2)'; trail.style.borderColor = 'rgba(56,201,176,0.6)'; });
  el.addEventListener('mouseleave', () => { trail.style.transform = 'translate(-50%,-50%) scale(1)'; trail.style.borderColor = 'rgba(56,201,176,0.4)'; });
});

const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el));


const cbObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { document.getElementById('confBar').classList.add('animated'); cbObs.disconnect(); }
}, { threshold: 0.5 });
cbObs.observe(document.getElementById('xaiCard'));

document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
    const dy = (e.clientY - r.top - r.height/2) / (r.height/2);
    card.style.transform = `translateY(-8px) rotateX(${-dy * 7}deg) rotateY(${dx * 7}deg) scale(1.015)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

const responses = {
  default: { domain:'Career Domain', score:'87%', rec:'Data Science →', bullets:['Industry demand significantly higher and growing faster','Aligns with your analytical and quantitative skillset','Entry without postgrad degree — faster ROI','MBA better suits management or consulting pivots'] },
  health:  { domain:'Healthcare Domain', score:'82%', rec:'Consult a Specialist →', bullets:['Symptoms match multiple non-critical conditions','Self-diagnosis risk is high without imaging','Nearby specialist within your insurance network','Telemedicine available within 2 hours'] },
  finance: { domain:'Finance Domain', score:'79%', rec:'Diversify Portfolio →', bullets:['Single-stock concentration creates unnecessary volatility','Index funds outperform active management 85% over 10yr','Build 6-month emergency fund before equity exposure','Tax-advantaged accounts (NPS/ELSS) should be prioritized'] },
  resume:  { domain:'Resume Domain', score:'91%', rec:'Rebuild Skills Section →', bullets:['Technical keywords missing — 34% JD match only','Add 3 quantified achievements with measurable impact','LinkedIn keyword density lower than competitors','ATS score ~58% — optimize formatting structure'] }
};

function runDemo() {
  const q = document.getElementById('demoInput').value.toLowerCase();
  const loading = document.getElementById('demoLoading');
  const result = document.getElementById('demoResult');
  result.classList.remove('shown');
  loading.classList.add('shown');
  let key = 'default';
  if (/health|hospital|doctor|symptom|sick/.test(q)) key = 'health';
  else if (/invest|financ|stock|money|saving/.test(q)) key = 'finance';
  else if (/resume|cv|job|hire|apply/.test(q)) key = 'resume';
  setTimeout(() => {
    loading.classList.remove('shown');
    const d = responses[key];
    result.querySelector('.result-domain').textContent = d.domain;
    result.querySelector('.result-score').textContent = 'Confidence: ' + d.score;
    result.querySelector('.result-rec').textContent = d.rec;
    result.querySelector('.result-bullets').innerHTML = d.bullets.map(b => `<li>${b}</li>`).join('');
    result.classList.add('shown');
  }, 1500);
}
document.getElementById('demoInput').addEventListener('keydown', e => { if (e.key === 'Enter') runDemo(); });
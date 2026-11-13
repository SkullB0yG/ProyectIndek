/* ============================================
   CONSTANTES Y ESTADO
============================================ */
const STORAGE_KEY = 'indek_productividad_v1';

const form = document.getElementById('productividadForm');
const toast = document.getElementById('toast');
const progressBar = document.getElementById('progressBar');
const steps = document.querySelectorAll('.step-pill');
const sections = document.querySelectorAll('.section');

// Charts
let chartLine, chartDonut, chartBars;

// Paleta
const COLORS = ['#7c5cff','#00d4ff','#ff4d94','#00e6a8','#ffb547','#ff8c42'];
const CHART_DEFAULTS = {
  color: '#a0a0b8',
  borderColor: 'rgba(255,255,255,0.1)',
  font: { family: 'Inter' }
};

if (window.Chart) {
  Chart.defaults.color = CHART_DEFAULTS.color;
  Chart.defaults.borderColor = CHART_DEFAULTS.borderColor;
  Chart.defaults.font.family = CHART_DEFAULTS.font.family;
}

/* ============================================
   ALMACENAMIENTO
============================================ */
function getRegistros() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveRegistros(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function addRegistro(registro) {
  const arr = getRegistros();
  registro.id = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  registro.createdAt = new Date().toISOString();
  arr.unshift(registro);
  saveRegistros(arr);
}

function deleteRegistro(id) {
  const arr = getRegistros().filter(r => r.id !== id);
  saveRegistros(arr);
}

/* ============================================
   TABS / VISTAS
============================================ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-' + tab.dataset.view).classList.add('active');
    if (tab.dataset.view === 'dashboard') renderDashboard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ============================================
   CONTADORES CARACTERES
============================================ */
document.querySelectorAll('.char-count').forEach(el => {
  const target = document.getElementById(el.dataset.for);
  const max = target.getAttribute('maxlength');
  target.addEventListener('input', () => {
    el.textContent = `${target.value.length} / ${max}`;
    el.style.color = target.value.length > max * 0.9 ? '#ff4d94' : '';
  });
});

/* ============================================
   FECHA POR DEFECTO
============================================ */
const fechaInput = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
fechaInput.value = hoy;
fechaInput.max = hoy;

/* ============================================
   PROGRESO + STEPS
============================================ */
function updateProgress() {
  const total = form.querySelectorAll('[data-required]').length;
  let filled = 0;

  form.querySelectorAll('[data-required]').forEach(el => {
    if (el.type === 'radio' || el.type === 'checkbox') {
      if (form.querySelector(`input[name="${el.name}"]:checked`)) filled++;
    } else if (el.value.trim() !== '') filled++;
  });

  progressBar.style.width = Math.round((filled / total) * 100) + '%';

  sections.forEach(sec => {
    const reqs = sec.querySelectorAll('[data-required]');
    let allDone = reqs.length > 0;
    reqs.forEach(el => {
      if (el.type === 'radio' || el.type === 'checkbox') {
        if (!form.querySelector(`input[name="${el.name}"]:checked`)) allDone = false;
      } else if (el.value.trim() === '') allDone = false;
    });
    sec.classList.toggle('done', allDone);

    const pill = document.querySelector(`.step-pill[data-step="${sec.dataset.section}"]`);
    if (pill) pill.classList.toggle('done', allDone);
  });
}

form.addEventListener('input', updateProgress);
form.addEventListener('change', updateProgress);
updateProgress();

steps.forEach(pill => {
  pill.addEventListener('click', () => {
    const sec = document.querySelector(`.section[data-section="${pill.dataset.step}"]`);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

/* ============================================
   VALIDACIÓN + ENVÍO
============================================ */
form.addEventListener('submit', function (e) {
  e.preventDefault();
  let valido = true;

  document.querySelectorAll('.question').forEach(q => q.classList.remove('invalid'));

  form.querySelectorAll('[data-required]').forEach(el => {
    if (el.type === 'radio' || el.type === 'checkbox') return;
    const q = el.closest('.question');
    let ok = true;
    if (el.type === 'email') {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    } else if (el.type === 'number') {
      const n = Number(el.value);
      ok = el.value !== '' && !isNaN(n) && n >= 0;
      if (ok && el.id === 'horas' && n > 24) ok = false;
    } else {
      ok = el.value.trim() !== '';
    }
    if (!ok) { q.classList.add('invalid'); valido = false; }
  });

  const radioNames = new Set();
  form.querySelectorAll('input[type="radio"][data-required]').forEach(r => radioNames.add(r.name));
  radioNames.forEach(name => {
    const group = form.querySelectorAll(`input[name="${name}"]`);
    const q = group[0].closest('.question');
    if (![...group].some(r => r.checked)) { q.classList.add('invalid'); valido = false; }
  });

  if (!valido) {
    const firstError = document.querySelector('.question.invalid');
    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Recolectar datos
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (key in data) {
      if (!Array.isArray(data[key])) data[key] = [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  addRegistro(data);

  // Hook para backend real (descomentar y ajustar):
  /*
  fetch('https://TU_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(err => console.error('Error al enviar:', err));
  */

  lanzarConfetti();
  mostrarToast();

  // Reset
  form.reset();
  fechaInput.value = hoy;
  document.querySelectorAll('.char-count').forEach(el => {
    const t = document.getElementById(el.dataset.for);
    el.textContent = `0 / ${t.getAttribute('maxlength')}`;
    el.style.color = '';
  });
  updateProgress();

  // Saltar al dashboard automáticamente
  setTimeout(() => {
    document.querySelector('.tab[data-view="dashboard"]').click();
  }, 800);
});

/* ============================================
   TOAST + CONFETTI
============================================ */
function mostrarToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function lanzarConfetti() {
  const colores = ['#7c5cff','#00d4ff','#ff4d94','#00e6a8','#ffd93d'];
  for (let i = 0; i < 60; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.top = '-10px';
    c.style.background = colores[Math.floor(Math.random() * colores.length)];
    c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    c.style.width = (6 + Math.random() * 8) + 'px';
    c.style.height = c.style.width;
    c.style.animationDelay = (Math.random() * 0.5) + 's';
    c.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

/* ============================================
   LIMPIAR FORM
============================================ */
document.getElementById('btnClear').addEventListener('click', () => {
  if (!confirm('¿Borrar todas las respuestas del formulario?')) return;
  form.reset();
  fechaInput.value = hoy;
  document.querySelectorAll('.question').forEach(q => q.classList.remove('invalid'));
  document.querySelectorAll('.char-count').forEach(el => {
    const t = document.getElementById(el.dataset.for);
    el.textContent = `0 / ${t.getAttribute('maxlength')}`;
    el.style.color = '';
  });
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   EXPORTAR CSV
============================================ */
document.getElementById('btnExport').addEventListener('click', () => {
  const registros = getRegistros();
  if (!registros.length) { alert('No hay registros para exportar.'); return; }

  const headers = ['fecha','nombre','correo','area','turno','planificadas','completadas','horas','cumplimiento','calificacion','factores','actividades','pendientes','recursos','mejorar','comentarios'];
  const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [headers.join(',')];
  registros.forEach(r => {
    rows.push(headers.map(h => esc(Array.isArray(r[h]) ? r[h].join(' | ') : r[h])).join(','));
  });

  const blob = new Blob(["\uFEFF" + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `productividad_indek_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

/* ============================================
   BORRAR TODO
============================================ */
document.getElementById('btnResetAll').addEventListener('click', () => {
  if (!confirm('⚠️ Se borrarán TODOS los registros guardados. ¿Continuar?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderDashboard();
  mostrarToast();
  toast.querySelector('span:last-child').textContent = 'Datos eliminados.';
  setTimeout(() => {
    toast.querySelector('span:last-child').textContent = '¡Respuestas registradas con éxito!';
  }, 3000);
});

/* ============================================
   FILTROS DASHBOARD
============================================ */
const filterArea = document.getElementById('filterArea');
const filterFrom = document.getElementById('filterFrom');
const filterTo = document.getElementById('filterTo');

[filterArea, filterFrom, filterTo].forEach(el =>
  el.addEventListener('change', renderDashboard)
);

document.getElementById('btnClearFilters').addEventListener('click', () => {
  filterArea.value = '';
  filterFrom.value = '';
  filterTo.value = '';
  renderDashboard();
});

function aplicarFiltros(registros) {
  let out = registros.slice();
  if (filterArea.value) out = out.filter(r => r.area === filterArea.value);
  if (filterFrom.value) out = out.filter(r => r.fecha >= filterFrom.value);
  if (filterTo.value) out = out.filter(r => r.fecha <= filterTo.value);
  return out;
}

/* ============================================
   RENDER DASHBOARD
============================================ */
function renderDashboard() {
  const todos = getRegistros();
  const regs = aplicarFiltros(todos);

  renderKPIs(regs);
  renderChartLine(regs);
  renderChartDonut(regs);
  renderChartBars(regs);
  renderTabla(regs);
}

/* ---------- KPIs ---------- */
function renderKPIs(regs) {
  const total = regs.length;

  // Tasa cumplimiento
  let plan = 0, comp = 0;
  regs.forEach(r => { plan += Number(r.planificadas) || 0; comp += Number(r.completadas) || 0; });
  const tasa = plan > 0 ? Math.round((comp / plan) * 100) : 0;

  // Horas prom
  const horas = regs.map(r => Number(r.horas)).filter(n => !isNaN(n));
  const horasProm = horas.length ? (horas.reduce((a, b) => a + b, 0) / horas.length) : 0;

  // Score cumplimiento
  const scores = regs.map(r => Number(r.cumplimiento)).filter(n => !isNaN(n));
  const scoreProm = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  document.getElementById('kpiRegistros').textContent = total;
  document.getElementById('kpiTasa').textContent = tasa + '%';
  document.getElementById('kpiHoras').textContent = horasProm.toFixed(1) + 'h';
  document.getElementById('kpiScore').textContent = scoreProm.toFixed(1);

  // Tendencias (comparando con la mitad anterior si hay suficientes)
  const media = Math.floor(regs.length / 2);
  const recientes = regs.slice(0, media);
  const anteriores = regs.slice(media);

  const avg = (arr, key) => {
    const vals = arr.map(r => Number(r[key])).filter(n => !isNaN(n));
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  };

  setTrend('kpiScoreTrend', avg(recientes, 'cumplimiento'), avg(anteriores, 'cumplimiento'));
  setTrend('kpiHorasTrend', avg(recientes, 'horas'), avg(anteriores, 'horas'));

  const trendReg = document.getElementById('kpiRegistrosTrend');
  trendReg.textContent = total ? 'Total histórico' : 'Sin datos';
  trendReg.className = 'kpi-trend';

  const trendTasa = document.getElementById('kpiTasaTrend');
  trendTasa.textContent = plan ? `${comp} de ${plan} tareas` : 'Sin datos';
  trendTasa.className = 'kpi-trend';
}

function setTrend(id, actual, anterior) {
  const el = document.getElementById(id);
  if (!anterior && !actual) { el.textContent = 'Sin datos'; el.className = 'kpi-trend'; return; }
  const diff = actual - anterior;
  const pct = anterior ? Math.round((diff / anterior) * 100) : 0;
  if (Math.abs(diff) < 0.05) {
    el.textContent = 'Sin cambios';
    el.className = 'kpi-trend';
  } else {
    el.textContent = `${diff > 0 ? '▲' : '▼'} ${Math.abs(pct)}% vs. periodo anterior`;
    el.className = 'kpi-trend ' + (diff > 0 ? 'up' : 'down');
  }
}

/* ---------- Chart: Línea por día ---------- */
function renderChartLine(regs) {
  const porDia = {};
  regs.forEach(r => {
    if (!r.fecha) return;
    if (!porDia[r.fecha]) porDia[r.fecha] = { sum: 0, count: 0 };
    const val = Number(r.cumplimiento);
    if (!isNaN(val)) { porDia[r.fecha].sum += val; porDia[r.fecha].count++; }
  });
  const fechas = Object.keys(porDia).sort();
  const data = fechas.map(f => porDia[f].count ? +(porDia[f].sum / porDia[f].count).toFixed(2) : 0);

  const ctx = document.getElementById('chartLine').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 240);
  grad.addColorStop(0, 'rgba(124,92,255,0.5)');
  grad.addColorStop(1, 'rgba(124,92,255,0)');

  if (chartLine) chartLine.destroy();
  chartLine = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas.map(f => f.slice(5)),
      datasets: [{
        label: 'Cumplimiento',
        data,
        borderColor: '#7c5cff',
        backgroundColor: grad,
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ---------- Chart: Dona por área ---------- */
function renderChartDonut(regs) {
  const conteo = {};
  regs.forEach(r => { if (r.area) conteo[r.area] = (conteo[r.area] || 0) + 1; });
  const labels = Object.keys(conteo);
  const data = Object.values(conteo);

  if (chartDonut) chartDonut.destroy();
  chartDonut = new Chart(document.getElementById('chartDonut'), {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['Sin datos'],
      datasets: [{
        data: data.length ? data : [1],
        backgroundColor: labels.length ? COLORS : ['rgba(255,255,255,0.08)'],
        borderWidth: 2,
        borderColor: '#1a1830'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 14, boxWidth: 10, boxHeight: 10, usePointStyle: true }
        }
      }
    }
  });
}

/* ---------- Chart: Barras calificación ---------- */
function renderChartBars(regs) {
  const orden = ['Excelente', 'Buena', 'Regular', 'Baja'];
  const conteo = { Excelente: 0, Buena: 0, Regular: 0, Baja: 0 };
  regs.forEach(r => { if (r.calificacion && conteo[r.calificacion] !== undefined) conteo[r.calificacion]++; });

  const colors = ['#00e6a8', '#00d4ff', '#ffb547', '#ff5470'];

  if (chartBars) chartBars.destroy();
  chartBars = new Chart(document.getElementById('chartBars'), {
    type: 'bar',
    data: {
      labels: orden,
      datasets: [{
        data: orden.map(k => conteo[k]),
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
        x: { grid: { display: false } }
      }
    }
  });
}

/* ---------- Tabla ---------- */
function renderTabla(regs) {
  const tbody = document.getElementById('tableBody');
  document.getElementById('tableCount').textContent = `${regs.length} registro${regs.length === 1 ? '' : 's'}`;

  if (!regs.length) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty">Aún no hay registros. Completa el formulario para ver datos aquí.</td></tr>`;
    return;
  }

  tbody.innerHTML = regs.slice(0, 20).map(r => {
    const califClass = (r.calificacion || '').toLowerCase();
    return `
      <tr>
        <td>${r.fecha || '—'}</td>
        <td>${escapeHtml(r.nombre || '—')}</td>
        <td>${escapeHtml(r.area || '—')}</td>
        <td>${escapeHtml(r.turno || '—')}</td>
        <td>${r.completadas || 0} / ${r.planificadas || 0}</td>
        <td>${r.horas || 0}h</td>
        <td>${r.cumplimiento || '—'}/5</td>
        <td><span class="pill ${califClass}">${escapeHtml(r.calificacion || '—')}</span></td>
        <td><button class="btn-del" data-id="${r.id}" title="Eliminar">✕</button></td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!confirm('¿Eliminar este registro?')) return;
      deleteRegistro(btn.dataset.id);
      renderDashboard();
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[s]));
}

/* ============================================
   INICIALIZAR
============================================ */
renderDashboard();
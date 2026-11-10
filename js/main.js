// La casa de la Sabiduría · «ha labrado sus siete columnas» (Prov 9, 1)
// Templo circular 3D con Three.js local: cada columna se enciende al recorrerla; al final, la mesa.
import * as THREE from './three.module.min.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.remove('no-js');
const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ------------------------------------------------------------------ */
/* Interfaz                                                            */
/* ------------------------------------------------------------------ */
requestAnimationFrame(() => document.body.classList.add('is-loaded'));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const menuBtn = document.querySelector('.top__btn'), menu = document.getElementById('menu-columnas'), curEl = document.getElementById('actual');
const setMenu = open => { menuBtn.setAttribute('aria-expanded', open); menu.hidden = !open; document.body.classList.toggle('menu-open', open); };
menuBtn.addEventListener('click', () => setMenu(menu.hidden));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

const dots = [...document.querySelectorAll('[data-dot]')];
const cols = [...document.querySelectorAll('.etapa')];
const markActive = n => {
  dots.forEach(a => a.classList.toggle('is-active', a.dataset.dot === n));
  curEl.textContent = n ? dots[+n - 1].querySelector('.rn').textContent + ' · ' + dots[+n - 1].querySelector('.nm').textContent : 'Columnas';
};
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const id = e.target.id;
  markActive(id.startsWith('columna-') ? id.split('-')[1] : id === 'mesa' ? '8' : null);
}), { rootMargin: '-45% 0px -45% 0px' });
[...cols, ...['inicio', 'prologo', 'mesa', 'final'].map(id => document.getElementById(id))].forEach(el => el && navIO.observe(el));

const wa = txt => window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
document.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', () => {
  const n = +b.dataset.share, base = location.href.split('#')[0];
  if (!n) return wa('La casa de la Sabiduría · Las siete columnas de los Proverbios\n' + base);
  const c = cols[n - 1];
  wa(`La casa de la Sabiduría · Columna ${c.querySelector('.etapa__rn').textContent}: ${c.querySelector('.etapa__lugar').textContent}. «${c.querySelector('.panel__title').textContent}»\n${base}#columna-${n}`);
}));

// Un proverbio para hoy (uno distinto cada día; «Otro» para seguir rumiando)
const PROV = [
  ['Por encima de todo, guarda tu corazón, porque de él brotan las fuentes de la vida.', '4, 23'],
  ['Confía en el Señor de todo corazón y no te fíes de tu propia inteligencia.', '3, 5'],
  ['No niegues un favor a quien lo necesita, si está en tu mano hacérselo.', '3, 27'],
  ['El odio provoca contiendas, el amor cubre todas las faltas.', '10, 12'],
  ['El que es generoso prospera; el que da de beber será saciado.', '11, 25'],
  ['La congoja abate el corazón del hombre; una palabra amable lo alegra.', '12, 25'],
  ['Una respuesta suave aplaca la ira, una palabra hiriente enciende la cólera.', '15, 1'],
  ['Más vale un plato de verdura con amor que un buey cebado con odio.', '15, 17'],
  ['Encomienda al Señor tus tareas, y se cumplirán tus proyectos.', '16, 3'],
  ['El corazón del hombre traza su camino, pero el Señor dirige sus pasos.', '16, 9'],
  ['Más vale ser paciente que valiente; más vale dominarse que conquistar ciudades.', '16, 32'],
  ['Más vale un mendrugo seco en paz que una casa llena de banquetes y riñas.', '17, 1'],
  ['El amigo ama en todo tiempo, y el hermano nace para la desgracia.', '17, 17'],
  ['Corazón alegre, buena medicina.', '17, 22'],
  ['Quien se apiada del pobre presta al Señor, y él le pagará su buena acción.', '19, 17'],
  ['Muchos proyectos hay en el corazón del hombre, pero se cumple el designio del Señor.', '19, 21'],
  ['Vale más el buen nombre que muchas riquezas.', '22, 1'],
  ['Siete veces cae el justo, y se levanta.', '24, 16'],
  ['Manzanas de oro con adornos de plata es la palabra dicha a su tiempo.', '25, 11'],
  ['Si tu enemigo tiene hambre, dale de comer; si tiene sed, dale de beber.', '25, 21'],
  ['No te jactes del día de mañana, porque no sabes lo que dará de sí.', '27, 1'],
  ['El hierro se afila con hierro, y el hombre con el trato de su prójimo.', '27, 17'],
  ['Quien oculta sus pecados no prosperará; quien los confiesa y se enmienda alcanzará misericordia.', '28, 13'],
  ['No me des pobreza ni riqueza; dame mi ración de pan.', '30, 8'],
  ['El principio de la sabiduría es el temor del Señor.', '9, 10'],
  ['Quien anda con sabios se hace sabio.', '13, 20'],
  ['Delante de la gloria va la humildad.', '15, 33'],
  ['Más vale adquirir sabiduría que oro.', '16, 16'],
  ['La senda de los justos es como la luz del alba, que va en aumento hasta llegar a pleno día.', '4, 18'],
  ['Una mujer fuerte, ¿quién la hallará? Supera en valor a las perlas.', '31, 10'],
  ['Escucha el consejo, acepta la corrección, y acabarás siendo sabio.', '19, 20'],
];
const provBox = document.getElementById('proverbio'), provTxt = document.getElementById('prov-txt'), provRef = document.getElementById('prov-ref');
let provI = Math.floor(Date.now() / 864e5) % PROV.length;
const showProv = () => { provTxt.textContent = '«' + PROV[provI][0] + '»'; provRef.textContent = 'Proverbios ' + PROV[provI][1]; };
showProv();
document.getElementById('prov-otro').addEventListener('click', () => {
  provBox.classList.add('is-changing');
  setTimeout(() => { provI = (provI + 1 + Math.floor(Math.random() * (PROV.length - 1))) % PROV.length; showProv(); provBox.classList.remove('is-changing'); }, reduceMotion ? 0 : 300);
});
document.getElementById('prov-share').addEventListener('click', () => wa(`${provTxt.textContent} (${provRef.textContent})\n\nLa casa de la Sabiduría · ${location.href.split('#')[0]}`));

/* ------------------------------------------------------------------ */
/* Escena 3D                                                           */
/* ------------------------------------------------------------------ */
const stageEl = document.querySelector('.stage');
let renderer = null;
try { renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('casa3d'), antialias: true, powerPreference: 'low-power' }); } catch (e) { renderer = null; }
if (!renderer) document.documentElement.classList.add('no-webgl'); else initScene();

function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function initScene() {
  const mobile = innerWidth < 760;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const BG = new THREE.Color('#0B0A08');
  scene.background = BG;
  scene.fog = new THREE.FogExp2(BG, .035);
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 300);

  // Luz de luna y cielo nocturno
  scene.add(new THREE.HemisphereLight('#4a5068', '#1e140a', 1.1));
  const moon = new THREE.DirectionalLight('#d9d2c4', 1.5); moon.position.set(-8, 14, 6); scene.add(moon);
  const warm = new THREE.PointLight('#ffc873', 0, 9, 1.6); scene.add(warm);          // luz de la columna activa
  const tableLight = new THREE.PointLight('#ffd58a', 0, 14, 1.4); tableLight.position.set(0, 2.6, 0); scene.add(tableLight);

  const N = 7, R = 4.8, H = 5.2, STEP = Math.PI * 2 / N;
  const angle = k => Math.PI / 2 + (k + .5) * STEP;      // la entrada queda al frente, entre la VII y la I

  // Suelo y gradas
  const stoneDark = new THREE.MeshStandardMaterial({ color: '#2b251d', roughness: .92 });
  [[6.9, .26, 0], [6.55, .26, .26], [6.2, .26, .52]].forEach(([r, h, y]) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 72), stoneDark); m.position.y = y + h / 2; scene.add(m);
  });
  const floorTex = canvasTex(2048, 2048, (g, w) => {
    const c = w / 2;
    const grd = g.createRadialGradient(c, c, 0, c, c, c); grd.addColorStop(0, '#3a3127'); grd.addColorStop(1, '#221d17');
    g.fillStyle = grd; g.fillRect(0, 0, w, w);
    for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(255,240,210,${Math.random() * .025})`; g.fillRect(Math.random() * w, Math.random() * w, 2, 2); }
    g.strokeStyle = 'rgba(201,163,91,.55)';
    [.96, .93, .62, .58, .2].forEach(f => { g.lineWidth = f > .9 ? 6 : 4; g.beginPath(); g.arc(c, c, c * f, 0, Math.PI * 2); g.stroke(); });
    // estrella de siete puntas
    g.beginPath();
    for (let k = 0; k <= 14; k++) { const a = -Math.PI / 2 + k * Math.PI / 7, rr = k % 2 ? c * .3 : c * .56; g.lineTo(c + Math.cos(a) * rr, c + Math.sin(a) * rr); }
    g.lineWidth = 5; g.stroke();
    // inscripción circular
    g.fillStyle = 'rgba(214,180,110,.75)'; g.font = `600 ${w * .03}px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    const txt = 'VENID A COMER DE MI PAN Y A BEBER EL VINO QUE HE MEZCLADO · ', rr = c * .775;
    const chars = [...(txt + txt)]; const da = Math.PI * 2 / chars.length;
    chars.forEach((ch, i) => { g.save(); g.translate(c, c); g.rotate(i * da); g.translate(0, -rr); g.fillText(ch, 0, 0); g.restore(); });
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(6.2, 96).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: floorTex, roughness: .55, metalness: .1 }));
  floor.position.y = .781; scene.add(floor);
  const BASE = .78;
  const ground = new THREE.Mesh(new THREE.CircleGeometry(90, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#100d0a', roughness: 1 }));
  scene.add(ground);

  // Columnas estriadas
  const marble = new THREE.MeshStandardMaterial({ color: '#d6cdbb', roughness: .5, metalness: 0 });
  const shaftGeo = new THREE.CylinderGeometry(.3, .36, H, 64, 12, true);
  { const p = shaftGeo.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const a = Math.atan2(v.z, v.x), f = 1 - .07 * Math.pow(Math.abs(Math.cos(a * 10)), .6); p.setXYZ(i, v.x * f, v.y, v.z * f); }
    shaftGeo.computeVertexNormals(); }
  const lathe = pts => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 48);
  const baseGeo = lathe([[0, 0], [.55, 0], [.55, .12], [.48, .16], [.44, .24], [.4, .3], [0, .3]]);
  const echGeo = lathe([[0, 0], [.32, 0], [.42, .08], [.52, .2], [0, .2]]);
  const abacusGeo = new THREE.BoxGeometry(1.16, .18, 1.16);
  const plinthGeo = new THREE.BoxGeometry(1.2, .22, 1.2);
  const glowTex = canvasTex(128, 128, (g) => {
    const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, 'rgba(255,244,214,1)'); r.addColorStop(.25, 'rgba(240,196,110,.6)'); r.addColorStop(1, 'rgba(201,163,91,0)');
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  });
  const RN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const columns = [];
  for (let k = 0; k < N; k++) {
    const a = angle(k), grp = new THREE.Group();
    grp.position.set(Math.cos(a) * R, BASE, Math.sin(a) * R);
    grp.rotation.y = -a + Math.PI / 2;                       // la cara +z mira hacia fuera
    const capMat = new THREE.MeshStandardMaterial({ color: '#d6cdbb', roughness: .45, emissive: new THREE.Color('#e0a84e'), emissiveIntensity: 0 });
    const plinth = new THREE.Mesh(plinthGeo, marble); plinth.position.y = .11; grp.add(plinth);
    const base = new THREE.Mesh(baseGeo, marble); base.position.y = .22; grp.add(base);
    const shaft = new THREE.Mesh(shaftGeo, marble); shaft.position.y = .52 + H / 2; grp.add(shaft);
    const ech = new THREE.Mesh(echGeo, capMat); ech.position.y = .52 + H; grp.add(ech);
    const ab = new THREE.Mesh(abacusGeo, capMat); ab.position.y = .52 + H + .29; grp.add(ab);
    // número romano en el plinto (cara exterior)
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(.9, .2), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = '#C9A35B'; g.font = `600 52px ${SERIF}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(RN[k], w / 2, h / 2 + 2);
    }) }));
    plate.position.set(0, .11, .605); grp.add(plate);
    // llama sobre el capitel
    const flame = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    flame.position.y = .52 + H + .62; flame.scale.setScalar(1.1); grp.add(flame);
    scene.add(grp);
    columns.push({ grp, capMat, flame, lit: 0, a });
  }

  // Arquitrabe circular con la inscripción de Prov 9, 1
  const archTex = canvasTex(4096, 150, (g, w, h) => {
    g.fillStyle = '#2a241c'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(201,163,91,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 12); g.lineTo(w, 12); g.moveTo(0, h - 12); g.lineTo(w, h - 12); g.stroke();
    const t = 'LA SABIDURÍA SE HA CONSTRUIDO SU CASA · HA LABRADO SUS SIETE COLUMNAS · ';
    let fs = h * .5; g.font = `600 ${fs}px ${SERIF}`;
    const sp0 = fs * .18; let tw = g.measureText(t).width + sp0 * t.length;
    if (tw > w) { fs *= w / tw; g.font = `600 ${fs}px ${SERIF}`; }
    const chars = [...t], ws = chars.map(ch => g.measureText(ch).width), sp = (w - ws.reduce((a, b) => a + b, 0)) / chars.length;
    g.fillStyle = '#d4b06a'; g.textBaseline = 'middle';
    let x = sp / 2; chars.forEach((ch, i) => { g.fillText(ch, x, h / 2 + 2); x += ws[i] + sp; });
  });
  archTex.wrapS = THREE.RepeatWrapping; archTex.repeat.x = 2;
  const archY = BASE + .52 + H + .38;
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(R + .62, R + .62, .62, 96, 1, true), new THREE.MeshStandardMaterial({ map: archTex, roughness: .7, side: THREE.DoubleSide }));
  arch.position.y = archY + .31; scene.add(arch);
  const archIn = new THREE.Mesh(new THREE.CylinderGeometry(R - .62, R - .62, .62, 96, 1, true), new THREE.MeshStandardMaterial({ color: '#2a241c', roughness: .8, side: THREE.DoubleSide }));
  archIn.position.y = archY + .31; scene.add(archIn);
  const ringGeo = new THREE.RingGeometry(R - .62, R + .62, 96, 1).rotateX(-Math.PI / 2);
  const ringTop = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({ color: '#3a3024', roughness: .8, side: THREE.DoubleSide }));
  ringTop.position.y = archY + .62; scene.add(ringTop);
  const ringBot = ringTop.clone(); ringBot.position.y = archY; scene.add(ringBot);
  const cornice = new THREE.Mesh(new THREE.TorusGeometry(R + .66, .06, 8, 120).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#C9A35B', roughness: .4, metalness: .6 }));
  cornice.position.y = archY + .64; scene.add(cornice);

  // La mesa: mantel, pan y copa
  const table = new THREE.Group(); table.position.y = BASE;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, .08, 48), new THREE.MeshStandardMaterial({ color: '#efe6d2', roughness: .9 }));
  top.position.y = .9; table.add(top);
  const cloth = new THREE.Mesh(new THREE.CylinderGeometry(.97, 1.05, .5, 48, 1, true), new THREE.MeshStandardMaterial({ color: '#e9dfc8', roughness: .95, side: THREE.DoubleSide }));
  cloth.position.y = .66; table.add(cloth);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(.12, .2, .9, 16), stoneDark); leg.position.y = .45; table.add(leg);
  const bread = new THREE.Mesh(new THREE.SphereGeometry(.26, 32, 16), new THREE.MeshStandardMaterial({ color: '#b07a3c', roughness: .8 }));
  bread.scale.set(1, .42, 1); bread.position.set(-.28, 1.0, .05); table.add(bread);
  const cup = new THREE.Mesh(lathe([[0, 0], [.13, 0], [.13, .02], [.03, .05], [.03, .22], [.09, .26], [.13, .38], [.12, .38], [.08, .28], [0, .26]]),
    new THREE.MeshStandardMaterial({ color: '#d9b25e', roughness: .25, metalness: .9 }));
  cup.position.set(.3, .94, -.05); table.add(cup);
  scene.add(table);
  const tableGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  tableGlow.position.set(0, BASE + 1.2, 0); tableGlow.scale.setScalar(3.2); scene.add(tableGlow);

  // Cielo estrellado
  const SN = mobile ? 900 : 1600, sp = new Float32Array(SN * 3);
  for (let i = 0; i < SN; i++) { const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * .42; sp.set([Math.cos(th) * Math.sin(ph) * 90, Math.cos(ph) * 55 + 6, Math.sin(th) * Math.sin(ph) * 90], i * 3); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: '#efe4c8', size: mobile ? .3 : .24, fog: false, transparent: true, opacity: .8 })));

  // Motas de luz que suben (muy pocas)
  const MN = 70, mp = new Float32Array(MN * 3), seeds = [];
  for (let i = 0; i < MN; i++) { const a = Math.random() * Math.PI * 2, r = Math.random() * 6; mp.set([Math.cos(a) * r, BASE + Math.random() * 6, Math.sin(a) * r], i * 3); seeds.push(Math.random()); }
  const mg = new THREE.BufferGeometry(); mg.setAttribute('position', new THREE.BufferAttribute(mp, 3));
  const motes = new THREE.Points(mg, new THREE.PointsMaterial({ color: '#f0c97a', size: .06, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(motes);

  /* ---------- Cámara guiada por el scroll ---------- */
  // estado: th (ángulo), r (radio), h (altura), lr/ly (punto de mira), sh (desplazamiento lateral)
  const OVER = { th: Math.PI / 2, r: 17, h: 6.2, lr: 0, ly: 3.1, sh: 0 };
  const COL = k => ({ th: angle(k), r: 11.5, h: 3.4, lr: R * .55, ly: 3.7, sh: 1 });
  const MESA = { th: Math.PI / 2 + Math.PI * 2, r: 7.2, h: 2.9, lr: 0, ly: BASE + 1.3, sh: 0 };
  let keys = [], litAt = [], mesaAt = 0, vh = innerHeight;
  function buildKeys() {
    vh = innerHeight; keys = []; litAt = [];
    const y0 = scrollY;
    document.querySelectorAll('[data-cam]').forEach(el => {
      const t = el.dataset.cam; if (t === 'travel') return;
      const r = el.getBoundingClientRect(), top = r.top + y0, bot = r.bottom + y0;
      const st = t === 'overview' ? OVER : t === 'mesa' ? MESA : COL(+el.dataset.col);
      const a = top - vh * .1, b = Math.max(a, bot - vh * .9);
      keys.push([a, st], [b, st]);
      if (t === 'col') litAt[+el.dataset.col] = top - vh * .4;
      if (t === 'mesa' && !mesaAt) mesaAt = top - vh * .5;
    });
    keys.sort((p, q) => p[0] - q[0]);
  }
  const lerpSt = (a, b, t) => { const o = {}; for (const k in a) o[k] = a[k] + (b[k] - a[k]) * t; return o; };
  function targetAt(y) {
    if (y <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [ya, a] = keys[i], [yb, b] = keys[i + 1];
      if (y <= yb) return lerpSt(a, b, yb > ya ? smooth(0, 1, (y - ya) / (yb - ya)) : 1);
    }
    return keys[keys.length - 1][1];
  }
  const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); mesaAt = 0; buildKeys(); };
  addEventListener('resize', resize); addEventListener('load', buildKeys); resize();

  let cur = { ...OVER }, mesaLit = 0;
  const pos = new THREE.Vector3(), look = new THREE.Vector3(), clock = new THREE.Clock();
  let running = true;
  document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { clock.getDelta(); loop(); } });

  function loop() {
    if (!running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime, y = scrollY;
    const tgt = targetAt(y), k = reduceMotion ? 1 : 1 - Math.exp(-dt * 3);
    for (const key in cur) cur[key] += (tgt[key] - cur[key]) * k;

    // encuadre: alejar en vertical; en escritorio la columna se desplaza a la izquierda (el texto va a la derecha)
    const aspect = camera.aspect, port = aspect < 1 ? 1 + (1 - aspect) * 1.3 : 1;
    const th = cur.th + (reduceMotion ? 0 : Math.sin(t * .1) * .03);
    pos.set(Math.cos(th) * cur.r * port, cur.h + (port - 1) * 2.2, Math.sin(th) * cur.r * port);
    look.set(Math.cos(cur.th) * cur.lr, cur.ly, Math.sin(cur.th) * cur.lr);
    const side = aspect > 1.1 ? cur.sh * 1.6 : 0;
    look.x += Math.sin(cur.th) * side; look.z -= Math.cos(cur.th) * side;
    camera.position.copy(pos); camera.lookAt(look);

    // columnas que se encienden al recorrerlas; la activa brilla más
    let active = -1, best = 1e9;
    columns.forEach((c, i) => {
      const on = litAt[i] !== undefined && y > litAt[i] ? 1 : 0;
      c.lit += (on - c.lit) * (reduceMotion ? 1 : 1 - Math.exp(-dt * 2));
      const d = Math.abs(((cur.th - c.a) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      if (on && cur.sh > .5 && d < best) { best = d; active = i; }
    });
    columns.forEach((c, i) => {
      const boost = i === active ? .5 : 0;
      c.capMat.emissiveIntensity = c.lit * (.35 + boost) + mesaLit * .3;
      c.flame.material.opacity = c.lit * (.75 + boost * .5);
      c.flame.scale.setScalar((1 + boost * .4) * (1 + Math.sin(t * 3 + i) * .05));
    });
    if (active >= 0) {
      const c = columns[active];
      warm.position.set(Math.cos(c.a) * (R + 1.2), BASE + H * .8, Math.sin(c.a) * (R + 1.2));
      warm.intensity += (5 - warm.intensity) * k;
    } else warm.intensity += (0 - warm.intensity) * k;

    // la mesa se ilumina al final
    mesaLit += ((mesaAt && y > mesaAt ? 1 : 0) - mesaLit) * (reduceMotion ? 1 : 1 - Math.exp(-dt * 1.5));
    tableLight.intensity = 1.5 + mesaLit * 9;
    tableGlow.material.opacity = mesaLit * (.8 + Math.sin(t * 1.5) * .08);

    // motas
    const p = mg.attributes.position;
    for (let i = 0; i < MN; i++) { let yy = p.getY(i) + dt * (.15 + seeds[i] * .2); if (yy > BASE + 6.5) yy = BASE; p.setY(i, yy); }
    p.needsUpdate = true;
    motes.material.opacity = .25 + mesaLit * .5;

    renderer.render(scene, camera);
  }
  loop();
  requestAnimationFrame(() => stageEl.classList.add('is-ready'));
  if (document.fonts) document.fonts.ready.then(() => { /* las texturas de texto ya usan la serif si estaba cargada */ });
}

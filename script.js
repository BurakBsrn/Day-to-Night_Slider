const daynight = document.getElementById('daynight');
daynight.addEventListener('input', () => {
  let angle = 270 - ((270 / daynight.max) * (2*daynight.value));
  let hue = 40 - ((40/daynight.max) * (2*daynight.value));
  let light = daynight.value > 50 ? (100 - ((110/daynight.max) * daynight.value)) : 50;
  if (angle < 0) angle = 0;
  if (hue < 0) hue = 0;
  if (light < 0) light = 0;
  document.body.style.setProperty('--l', `${(((daynight.value - 0) * (60 - 40)) / (100 - 0) + 40)/100}`);
  document.body.style.setProperty('--angle', `${angle}deg`);
  document.body.style.setProperty('--hue1', `${hue}`);
  document.body.style.setProperty('--light', `${light}%`);
});

/* Init */
daynight.dispatchEvent(new Event('input'));

function checkDistance(x1, y1, x2, y2){ 
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function coords(amount, w, h) {
  return new Array(amount).fill().map(() => {
    let x = Math.random() - 0.5;
    let y = Math.random() - 0.5;
    x = (x * 0.96875 + 0.5) * w;
    y = (y * 0.96875 + 0.5) * h;
    return [x, y]
  })
}

function drawSVGParticles(svg, settings) {
  let c = '', l = '';
  let points = coords(settings.particles, settings.width, settings.height);
  const length = points.length;
  points = points.concat(settings.static);
  points.forEach((coord, index) => {
    const [x, y] = [...coord];
    const static = index >= length;
    l+= points.map(arr => {
      const [x1, y1] = [...arr];
      const distance = checkDistance(x, y, x1, y1);
      const alpha = 1 - distance / settings.distance;
      if (alpha > 0) return `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" ${static ? `data-static`:''} stroke="hsla(${settings.fill}, ${alpha})" stroke-width="${settings.strokeWidth}" />`}).join('');
    c+= `<circle cx="${x}" cy="${y}" style="--animdel:${random(0,2000)}ms;--animdur:${random(2000,10000)}ms" ${static ? `data-static`:''} r="${static ? settings.staticRad : random(settings.minRad, settings.maxRad)}" fill="${static ? `hsl(${settings.staticFill})` : `hsl(${settings.fill})`}" />`;
  });
  svg.innerHTML = l + c;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const settings = {
  distance: 500,
  fill: '41, 63%, 75%',
  fitWidth: true,
  height: document.body.offsetHeight,
  maxRad: 9,
  minRad: 2,
  particles: 40,
  static: [
    [100, 100],
    [500, 200],
    [700, 150]
  ],
  staticFill: '41, 63%, 90%',
  staticRad: 11,
  stroke: '0, 0%, 0%',
  strokeWidth: 0.5,
  width: document.body.offsetWidth
}

const svg = document.getElementById('stars');
svg.setAttribute('viewBox', `0 0 ${document.body.offsetWidth} ${document.body.offsetHeight}`)
svg.width = document.body.offsetWidth;
svg.height = document.body.offsetHeight;
drawSVGParticles(svg, settings);
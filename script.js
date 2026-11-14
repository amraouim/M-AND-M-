const canvas = document.querySelector("#heart");
const context = canvas.getContext("2d");
const width = 900;
const height = 700;
const words = [
  "AMOUR", "JE T'AIME", "MON COEUR", "TENDRESSE",
  "BONHEUR", "PASSION", "TOUJOURS", "MON ANGE",
  "DOUCEUR", "POUR LA VIE"
];
const points = [];
const stars = Array.from({ length: 70 }, (_, index) => ({
  x: (index * 137) % width,
  y: (index * 83) % height,
  size: 1 + (index % 3) * 0.6,
  phase: index * 0.7
}));

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

for (let index = 0; index < 28; index += 1) {
  const t = (2 * Math.PI * index) / 28;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
    - 2 * Math.cos(3 * t) - Math.cos(4 * t);
  points.push({ x, y, z: Math.cos(t) * 2.4, wordIndex: index });
}

function project(point, angleY) {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rotatedX = point.x * cosY - point.z * sinY;
  let rotatedZ = point.x * sinY + point.z * cosY;
  const angleX = -0.12;
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const rotatedY = point.y * cosX - rotatedZ * sinX;
  rotatedZ = point.y * sinX + rotatedZ * cosX;
  const distance = 42;
  const scale = 18 * distance / (distance - rotatedZ);

  return {
    x: width / 2 + rotatedX * scale,
    y: 347 - rotatedY * scale,
    scale
  };
}

function roundedRectangle(x, y, boxWidth, boxHeight, radius) {
  context.beginPath();
  context.roundRect(x, y, boxWidth, boxHeight, radius);
  context.fill();
}

function draw(time) {
  const seconds = time / 1000;
  const angleY = 0.28 * Math.sin(seconds * 0.8);
  const pulse = 1 + Math.sin(seconds * 2.2) * 0.012;

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#140817";
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(450, 335, 30, 450, 335, 370);
  glow.addColorStop(0, "rgba(255, 83, 151, 0.25)");
  glow.addColorStop(1, "rgba(255, 83, 151, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  for (const star of stars) {
    const alpha = 0.25 + 0.35 * (Math.sin(seconds + star.phase) + 1);
    context.fillStyle = `rgba(255, 215, 232, ${alpha})`;
    context.beginPath();
    context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    context.fill();
  }

  const projected = points.map((point) => ({
    ...project({ ...point, x: point.x * pulse, y: point.y * pulse }, angleY),
    wordIndex: point.wordIndex
  })).sort((a, b) => a.scale - b.scale);

  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const point of projected) {
    const word = words[point.wordIndex % words.length];
    const fontSize = Math.max(12, Math.min(19, point.scale * 0.38));
    context.font = `bold ${fontSize}px Georgia`;
    context.shadowColor = "rgba(255, 45, 122, 0.8)";
    context.shadowBlur = 8;
    context.fillStyle = point.scale < 19 ? "#ffb8d3" : "#fff0f6";
    context.fillText(word, point.x, point.y);
  }
  context.shadowBlur = 0;

  context.fillStyle = "rgba(34, 8, 29, 0.62)";
  roundedRectangle(300, 290, 300, 115, 24);
  context.strokeStyle = "rgba(255, 196, 220, 0.5)";
  context.lineWidth = 1;
  context.stroke();

  context.font = "bold 42px Georgia";
  context.shadowColor = "#ff397f";
  context.shadowBlur = 18;
  context.fillStyle = "#ffffff";
  context.fillText("MARWA", 450, 340);
  context.shadowBlur = 0;
  context.font = "italic 20px Georgia";
  context.fillStyle = "#ffd1e1";
  context.fillText("mon amour, pour toujours", 450, 378);

  context.font = "italic 19px Georgia";
  context.fillStyle = "#fff0f6";
  context.fillText("Mon amour pour toi tourne sans fin...", 450, 645);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

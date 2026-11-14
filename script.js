const canvas = document.querySelector("#heart");
const context = canvas.getContext("2d");
const words = [
  "AMOUR", "JE T'AIME", "MON COEUR", "TENDRESSE",
  "BONHEUR", "PASSION", "TOUJOURS", "MON ANGE"
];
const points = [];
const width = 900;
const height = 700;

canvas.width = width;
canvas.height = height;

for (let index = 0; index < 32; index += 1) {
  const t = (2 * Math.PI * index) / 32;
  const x = 16 * Math.sin(t) ** 3;
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t)
    - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  for (const depth of [-0.8, 0, 0.8]) {
    points.push({ x, y, z: depth * 2.2, wordIndex: index });
  }
}

function project(point, angleY) {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const rotatedX = point.x * cosY - point.z * sinY;
  let rotatedZ = point.x * sinY + point.z * cosY;
  const angleX = -0.15;
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const rotatedY = point.y * cosX - rotatedZ * sinX;
  rotatedZ = point.y * sinX + rotatedZ * cosX;
  const distance = 42;
  const scale = 19 * distance / (distance - rotatedZ);

  return {
    x: width / 2 + rotatedX * scale,
    y: height / 2 + 5 - rotatedY * scale,
    scale
  };
}

function draw(time) {
  context.clearRect(0, 0, width, height);
  const angleY = 0.35 * Math.sin(time / 1000);
  const projected = points.map((point) => ({
    ...project(point, angleY),
    wordIndex: point.wordIndex
  })).sort((a, b) => a.scale - b.scale);

  for (const point of projected) {
    const word = words[point.wordIndex % words.length];
    const fontSize = Math.max(10, Math.min(20, point.scale * 0.4));
    context.font = `bold ${fontSize}px Arial`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = point.wordIndex % 3 === 0 ? "#ffd1e1" : "#ff4f91";
    context.fillText(word, point.x, point.y);
  }

  context.font = "bold 30px Arial";
  context.fillStyle = "#c2185b";
  context.fillText("MARWA", 452, 367);
  context.fillStyle = "#ffffff";
  context.fillText("MARWA", 450, 365);

  context.font = "italic 18px Arial";
  context.fillStyle = "#fff0f6";
  context.fillText("Mon amour pour toi tourne sans fin...", 450, 650);
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

const imageUpload = document.getElementById('imageUpload');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');

let img = new Image();
let startX, startY, endX, endY;
let isDrawing = false;

imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

// Draw selection rectangle
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mouseup', (e) => {
  isDrawing = false;
  endX = e.offsetX;
  endY = e.offsetY;
  drawRect();
});

function drawRect() {
  ctx.drawImage(img, 0, 0);
  const width = endX - startX;
  const height = endY - startY;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(startX, startY, width, height);
}

document.getElementById('extractBtn').addEventListener('click', () => {
  const width = endX - startX;
  const height = endY - startY;

  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = width;
  tempCanvas.height = height;
  tempCtx.drawImage(canvas, startX, startY, width, height, 0, 0, width, height);

  Tesseract.recognize(tempCanvas, 'eng')
    .then(result => {
      document.getElementById('output').textContent = result.data.text;
    })
    .catch(err => {
      console.error(err);
    });
});

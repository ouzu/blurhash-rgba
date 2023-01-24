import decode from "./decode";
import encode from "./encode";

const blurhashElement = document.getElementById("blurhash") as HTMLInputElement;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const originalCanvas = document.getElementById("original") as HTMLCanvasElement;
const fileInput = document.getElementById("fileinput") as HTMLInputElement;
const componentElement = document.getElementById("x") as HTMLInputElement;
const colorElement = document.getElementById("color") as HTMLInputElement;

function render() {
  const blurhash = blurhashElement.value;
  const component = clamp(+componentElement.value);

  if (blurhash) {
    const pixels = decode(blurhash, 32, 32, component, component);
    if (pixels) {
      const ctx = canvas.getContext("2d");

      const imageData = new ImageData(pixels, 32, 32);
      ctx.putImageData(imageData, 0, 0);
    }
  }
}

function clamp(n: number) {
  return Math.min(20, Math.max(1, n));
}

function doEncode() {
  const file = fileInput.files[0];
  const component = clamp(+componentElement.value);
  if (file) {
    const ctx = originalCanvas.getContext("2d");
    var img = new Image();
    img.onload = function () {
      ctx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
      ctx.drawImage(img, 0, 0, originalCanvas.width, originalCanvas.height);
      URL.revokeObjectURL(img.src);

      setTimeout(() => {
        const imageData = ctx.getImageData(
          0,
          0,
          originalCanvas.width,
          originalCanvas.height
        );
        const blurhash = encode(
          imageData.data,
          imageData.width,
          imageData.height,
          component,
          component
        );
        blurhashElement.value = blurhash;
        render();
      }, 0);
    };
    img.src = URL.createObjectURL(fileInput.files[0]);
  }
}

function updateColor() {
  const color = colorElement.value;
  originalCanvas.setAttribute("style", "background: " + color);
  canvas.setAttribute("style", "background: " + color);
}

blurhashElement.addEventListener("keyup", render);
fileInput.addEventListener("change", doEncode);
componentElement.addEventListener("change", doEncode);

colorElement.addEventListener("change", updateColor);

render();

import { Buffer } from "buffer";

const bytesPerPixel = 4;

const multiplyBasisFunction = (
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  basisFunction: (i: number, j: number) => number
): [number, number, number, number] => {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  const bytesPerRow = width * bytesPerPixel;

  for (let x = 0; x < width; x++) {
    const bytesPerPixelX = bytesPerPixel * x;

    for (let y = 0; y < height; y++) {
      const basePixelIndex = bytesPerPixelX + y * bytesPerRow;
      const basis = basisFunction(x, y);
      r += basis * pixels[basePixelIndex];
      g += basis * pixels[basePixelIndex + 1];
      b += basis * pixels[basePixelIndex + 2];
      a += basis * pixels[basePixelIndex + 3];
    }
  }

  let scale = 1 / (width * height);

  return [r * scale, g * scale, b * scale, a * scale];
};

const encode = (
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  componentX: number,
  componentY: number
): string => {
  let components: Array<number> = [];
  for (let y = 0; y < componentY; y++) {
    for (let x = 0; x < componentX; x++) {
      const normalisation = x == 0 && y == 0 ? 1 : 2;
      const factor = multiplyBasisFunction(
        pixels,
        width,
        height,
        (i: number, j: number) =>
          normalisation *
          Math.cos((Math.PI * x * i) / width) *
          Math.cos((Math.PI * y * j) / height)
      );
      components.push(...factor);
    }
  }

  const normalized = new Uint8ClampedArray(components.map((x) => (x + 255) / 2));

  return Buffer.from(normalized).toString("base64");
};

export default encode;

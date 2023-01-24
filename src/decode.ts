const decode = (
  blurhash: string,
  width: number,
  height: number,
  componentX: number,
  componentY: number
) => {
  const colors = JSON.parse(atob(blurhash));

  const bytesPerRow = width * 4;
  const pixels = new Uint8ClampedArray(bytesPerRow * height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let j = 0; j < componentY; j++) {
        for (let i = 0; i < componentX; i++) {
          const basis =
            Math.cos((Math.PI * x * i) / width) *
            Math.cos((Math.PI * y * j) / height);
          let color = colors[i + j * componentX];
          r += color[0] * basis;
          g += color[1] * basis;
          b += color[2] * basis;
          a += color[3] * basis;
        }
      }

      pixels[4 * x + 0 + y * bytesPerRow] = r;
      pixels[4 * x + 1 + y * bytesPerRow] = g;
      pixels[4 * x + 2 + y * bytesPerRow] = b;
      pixels[4 * x + 3 + y * bytesPerRow] = a;
    }
  }
  return pixels;
};

export default decode;

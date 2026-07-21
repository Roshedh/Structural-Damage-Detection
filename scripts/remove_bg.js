const Jimp = require('jimp');
const path = require('path');

const inputPath = path.join(__dirname, '../public/logo.png');
const outputPath = path.join(__dirname, '../public/logo.png');

Jimp.read(inputPath)
  .then(image => {
    const bgHex = image.getPixelColor(0, 0);
    const bgR = Jimp.intToRGBA(bgHex).r;
    const bgG = Jimp.intToRGBA(bgHex).g;
    const bgB = Jimp.intToRGBA(bgHex).b;

    console.log(`Detected background color: RGB(${bgR}, ${bgG}, ${bgB})`);

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      let r_new = Math.max(0, r - bgR);
      let g_new = Math.max(0, g - bgG);
      let b_new = Math.max(0, b - bgB);
      
      if (r_new < 8 && g_new < 8 && b_new < 8) {
        r_new = 0; g_new = 0; b_new = 0;
      }

      const a = Math.max(r_new, g_new, b_new);

      if (a === 0) {
        this.bitmap.data[idx + 0] = 0;
        this.bitmap.data[idx + 1] = 0;
        this.bitmap.data[idx + 2] = 0;
        this.bitmap.data[idx + 3] = 0;
      } else {
        this.bitmap.data[idx + 0] = Math.min(255, r_new * 255 / a);
        this.bitmap.data[idx + 1] = Math.min(255, g_new * 255 / a);
        this.bitmap.data[idx + 2] = Math.min(255, b_new * 255 / a);
        this.bitmap.data[idx + 3] = a;
      }
    });

    return image.writeAsync(outputPath);
  })
  .then(() => {
    console.log('Background removed successfully!');
  })
  .catch(err => {
    console.error(err);
  });

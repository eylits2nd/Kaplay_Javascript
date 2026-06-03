import kaplay from "kaplay";

const k = kaplay({
  width: 1280,
  height: 720,
  letterbox: true,
  global: false  ,
  touchToMouse: true,
  debug: true, // set to false when deploy game
  pixelDensity: window.devicePixelRatio  || 1, // adjust for high-DPI screens
  background: [0, 0, 0], // set background color to black
});
export default k;

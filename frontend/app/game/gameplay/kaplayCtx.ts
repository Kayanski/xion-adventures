import kaplay from "kaplay";

export default function initKaplay() {
  return kaplay({
    width: 1920,
    height: 1080,
    letterbox: true,
    global: false,
    debug: true, // put back to false in prod
    debugKey: "a",
    canvas: undefined,
    pixelDensity: window.devicePixelRatio,
  });
}

export default function resizeCanvas(canvas = render) {
  const size = { height: window.innerHeight, width: window.innerWidth };

  function resize() {
    canvas.width = size.width;
    canvas.height = size.height;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  window.addEventListener("resize", () => {
    size.height = window.innerHeight;
    size.width = window.innerWidth;
    resize();
  });

  resize();
}

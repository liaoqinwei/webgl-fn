export default function resizeCanvas(canvas: HTMLCanvasElement) {
    const size = { height: window.innerHeight, width: window.innerWidth }

    function resize() {
        canvas.width = size.width
        canvas.height = size.height
    }

    window.addEventListener('resize', () => {
        size.height = window.innerHeight
        size.width = window.innerWidth
        resize()
    })
    resize()
}
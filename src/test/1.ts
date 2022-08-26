import { initShader } from "../util"

// import resizeCanvas from '../resizeCanvas'
// resizeCanvas(document.querySelector('#renderer') as HTMLCanvasElement)

function main(): void {
    const canvas = document.querySelector('#renderer') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')!
    const vertexShader = /* glsl */`
        attribute vec4 a_pos;
        void main(){
            gl_Position = a_pos;
        }
    `

    const fragmentShader =/* glsl */`
        precision mediump float;

        void main(){
            gl_FragColor = vec4(1, 0, 1, 1);
        }
    `

    const program = initShader(gl, vertexShader, fragmentShader)

    const a_pos = gl.getAttribLocation(program, 'a_pos')
    // bind Data 
    const a_posData = new Float32Array([
        -.5, -.5,
        .5, -.5,
        0,.5])
    const a_posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, a_posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, a_posData, gl.STATIC_DRAW)

    // render
    console.log(gl.canvas.width, gl.canvas.height);

    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // gl.clearColor(0, 0, 0, 1)
    // gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_pos)

    const tick = () => {
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        requestAnimationFrame(tick)
    }

    tick()
}

main()
import { initShader } from "../util"

// import resizeCanvas from '../resizeCanvas'
// resizeCanvas(document.querySelector('#renderer') as HTMLCanvasElement)
/**
 * ! 归一化坐标转平面坐标 旋转三角形
 */
import resizeCanvas from '../resizeCanvas'
resizeCanvas(document.querySelector('#renderer') as HTMLCanvasElement)
function main(): void {
    const canvas = document.querySelector('#renderer') as HTMLCanvasElement
    const gl = canvas.getContext('webgl')!
    const vertexShader = /* glsl */`
        attribute vec3 a_pos;
        uniform vec3 u_resolution;
        uniform vec3 center_pos;
        uniform float angle;
        attribute vec4 a_color;

        varying vec4 c_color;

        void main(){
            // transform pixel to 0 -> 1
            float radian  = radians(angle);
            float cosVal = cos(radian);
            float sinVal = sin(radian);
            vec3 rotationPos = mat3(1,0,0, 0,1,0, center_pos.x, center_pos.y, 1) * mat3(cosVal,sinVal,0,   -sinVal,cosVal,0  ,0,0,1)* mat3(1,0,0, 0,1,0, -center_pos.x, -center_pos.y, 1)* a_pos;
            // a_pos = mat3(cosVal,sinVal,0,   -sinVal,cosVal,0  ,0,0,1) * a_pos; 
            vec3 zeroToOne = rotationPos / u_resolution;
            // transofrm 0 -> 1 to 0 -> 2
            vec3 zeroToTwo = zeroToOne * 2.0;
            
            // transform 0 -> 2 to -1 -> 1
            vec3 clipSpace = zeroToTwo - 1.0;
            // clipSpace = vec3(clipSpace.xy, 1);
            clipSpace = vec3(clipSpace.x , clipSpace.y * -1.0 , 1);


            // clipSpace = mat3(.5*cosVal,sinVal,0,   .5*-sinVal,cosVal,0  ,.5,-.5,1) * clipSpace;
            // clipSpace = clipSpace * mat2(cosVal, sinVal, -sinVal, cosVal,0,0);
            
            c_color = a_color;
            gl_Position = vec4(clipSpace, 1);
        }
    `

    const fragmentShader =/* glsl */`
        precision mediump float;
        varying vec4 c_color;


        void main(){
            gl_FragColor = c_color;
        }
    `

    const program = initShader(gl, vertexShader, fragmentShader)

    const a_pos = gl.getAttribLocation(program, 'a_pos')
    const u_resolution = gl.getUniformLocation(program, 'u_resolution')
    const center_pos = gl.getUniformLocation(program, 'center_pos');
    const angle_ = gl.getUniformLocation(program, 'angle');

    // bind Data 
    const a_posData = new Float32Array([
        300, 300, 1,
        300, 400, 1,
        500, 400, 1,
    ])
    const a_posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, a_posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, a_posData, gl.STATIC_DRAW)

    gl.vertexAttribPointer(a_pos, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_pos)

    const a_color = gl.getAttribLocation(program, 'a_color')
    const a_colorData = new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
    ])
    const a_colorBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, a_colorBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, a_colorData, gl.STATIC_DRAW)
    gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(a_color)

    gl.uniform3f(u_resolution, gl.canvas.width, gl.canvas.height, 1)
    gl.uniform3f(center_pos, (a_posData[0] + a_posData[3] + a_posData[6]) / 3, (a_posData[1] + a_posData[4] + a_posData[7]) / 3, 1)
    let angle = 0
    const tick = () => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.uniform3f(u_resolution, gl.canvas.width, gl.canvas.height, 1)
        gl.uniform1f(angle_, angle)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
        angle += 3
        requestAnimationFrame(tick)
    }

    tick()
}

main()
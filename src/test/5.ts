import { initShader, getRectangleVertex } from "../util";
import { mat3 } from "gl-matrix";

// 二维矩阵变化
const renderer = document.querySelector("#renderer") as HTMLCanvasElement;
const gl = renderer.getContext("webgl")!;

const vertexShader = /* glsl*/`
  attribute vec2 a_pos;
  uniform mat3 u_matrix;

  void main(){
    gl_Position = a_pos * u_matrix;
  }
`

const fragmentShader = /* glsl */`
    precision highp float;

    void main(){

      gl_FragColor = vec4(0, 0, 0, 1.0);
    }
`

const programe = initShader(gl, vertexShader, fragmentShader);

const a_pos = gl.getAttribLocation(programe, 'a_pos');
const u_matrix = gl.uniformMatrix3fv('u_matrix',)

const m3 = {
  transition(tx: number, ty: number) {
    return [
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
    ]
  },
  rotation(angle: number) {
    const c = Math.cos(angle / 180 * Math.PI)
    const s = Math.sin(angle / 180 * Math.PI)

    return [
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    ]
  },
  scale(sx: number, sy: number) {
    return [
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ]
  }

}
function draw() {

}



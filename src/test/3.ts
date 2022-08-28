import { initShader, getRectangleVertex } from "../util";

const renderer = document.querySelector("#renderer") as HTMLCanvasElement;
const gl = renderer.getContext("webgl")!;

/**
 * ! 生成随机矩形
 */
const vertexShader = /*glsl*/ `
    attribute vec2 a_pos;
    uniform vec2 u_resolution;


    void main () {
        vec2 zeroToOne = a_pos / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;
     
        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace*vec2(1,-1),1,1);
    }
`;

const fragmentShader = /*glsl*/ `
    precision mediump float;

    uniform vec4 a_color;

    void main () {
        gl_FragColor = a_color;
    }
`;

const programe = initShader(gl, vertexShader, fragmentShader);
const a_pos = gl.getAttribLocation(programe, "a_pos");
const a_color = gl.getUniformLocation(programe, "a_color");
const u_resolution = gl.getUniformLocation(programe, "u_resolution");
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

gl.enableVertexAttribArray(a_pos);
gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

gl.uniform2f(u_resolution, renderer.width, renderer.height);
gl.viewport(0, 0, renderer.width, renderer.height);

// 生成20个矩形
for (let i = 0; i < 30; i++) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    getRectangleVertex(
      randomInt(400),
      randomInt(400),
      randomInt(400),
      randomInt(400)
    ),
    gl.STATIC_DRAW
  );
  
  gl.uniform4f(a_color, Math.random(), Math.random(), Math.random(), 1);

  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function randomInt(range: number) {
  return Math.floor(Math.random() * range);
}

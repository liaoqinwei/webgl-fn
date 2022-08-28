import { initShader, getRectangleVertex, computedCenterPointer, computedModelMatrix } from "../util";
import resizeCanvas from "../resizeCanvas";
resizeCanvas(render);
/**
 * 二维矩阵变化
 * ! Tx 为x轴中心点位置
 * ! Ty 为y轴中心点位置
 * [1 0 Tx   [cos -sin 0    [1 0 -Tx   [x
 *  0 1 Ty    sin cos  0     0 1 -Ty    y
 *  0 0 1]    0    0   1]    0 0  1]    1]
 * [
 *   x*cos + y*-sin + -Tx(cos) + -Ty(-sin) + Tx
 *   x*sin + y*cos + -Tx(sin) + -Ty(cos) + Ty
 * ]
 */

const vectexShader = /* glsl */ `
    attribute vec2 u_position;

    uniform vec4 u_color;

    uniform vec2 u_resolution;

    uniform mat3 model_matraix;
    void main(){
        vec3 modelMatrix = model_matraix * vec3(u_position,1);
        
        vec2 zeroToOne = vec2(modelMatrix.xy / u_resolution);

        vec2 oneToTwo = zeroToOne * 2.0;

        vec2 clipSpace = oneToTwo - 1.0;


        gl_Position = vec4(clipSpace.xy*vec2(1,-1), 0, 1);
    }
`;
const fragmentShader = /* glsl */ `
    precision mediump float;

    uniform vec4 u_color;

    void main(){
        gl_FragColor = u_color;
    }
`;

const program = initShader(gl, vectexShader, fragmentShader);

// uniform global
const u_resolution = gl.getUniformLocation(program, "u_resolution");
const u_color = gl.getUniformLocation(program, "u_color");
const model_matraix = gl.getUniformLocation(program, "model_matraix")

gl.uniform4f(u_color, 0, 0, 1, 0.5);

// vectex attribute
const u_position = gl.getAttribLocation(program, "u_position");
const uPositionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uPositionBuffer);

const positionData = getRectangleVertex(100, 100, 200, 200);

draw();

function draw() {
    gl.uniform2f(u_resolution, render.width, render.height);
    const modelMatrix = computedModelMatrix({
        origin: computedCenterPointer(positionData, 2),
        translate:[0,0],
        rotate:[0,0],
        scale:[1.5,1],
    }, 2)

    console.log(modelMatrix);
    
    gl.uniformMatrix3fv(model_matraix, false, modelMatrix)
    gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(u_position);
    gl.vertexAttribPointer(u_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}



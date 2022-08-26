import { initShader } from "../util";

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

const vectexShader = /* glsl */`
    attribute vec2 position;

    varying vec4 u_color;

    uniform vec2 u_resolution;
    void main(){
        vec2 zeroToOne = position / u_resolution;
        vec2 oneToTwo = zeroToOne + 1.0;
        vec2 clipSpace = oneToTwo - 1.0;


        gl_Position = vec4(clipSpace.xy, 0, 1);
    }
`
const fragmentShader = /* glsl */`
    precision mediump float;

    varying vec4 u_color;

    void main(){
        gl_FragColor = u_color;
    }
`

const program = initShader(gl, vectexShader, fragmentShader)




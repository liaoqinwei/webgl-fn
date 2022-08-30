type shaderString = string;
type Dimension = 2 | 3;
type Key = number | string | symbol;
type SinCos = { sin: number, cos: number }
type transformType = 'translate' | 'rotate' | 'scale' | 'origin' | 'center' | 'centerByWorld'
type TransformParam = {
    [k in transformType]?: ArrayLike<number>
}

export function initShader(
    gl: WebGLRenderingContext,
    vertexShaderSource: shaderString,
    fragmentShaderSource: shaderString
): WebGLProgram {
    const program: WebGLProgram = gl.createProgram()!;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    gl.useProgram(program);

    return program;
}

export function getRectangleVertex(
    x: number,
    y: number,
    width: number,
    height: number
): VecArrayBufferType {
    const x1 = x,
        x2 = x + width,
        y1 = y,
        y2 = y + height;
    return new Float32Array([x1, y1, x1, y2, x2, y1, x1, y2, x2, y1, x2, y2]);
}

export function radian(angle: number) {
    return (angle / 180) * Math.PI;
}

// 计算中心点
// center 元素中心点 和世界中心点
export function computedCenterPointer(
    bufferData: ArrayLike<any>,
    dimension: Dimension
): {
    "center": ArrayLike<number>,
    "centerByWorld": ArrayLike<number>
} {
    const c = new Array(dimension).fill(0);
    const dimensionPointers = new Array(dimension).fill(0).map(() => new Array)
    for (let i = 0; i < bufferData.length; i += dimension) {
        const b = dimension + i;
        for (let j = i; j < b; j++) {

            dimensionPointers[j % dimension][Math.floor(j / dimension)] = bufferData[j]

            c[j % dimension] += bufferData[j];
        }
    }

    const minPointers = dimensionPointers.map(pointers => Math.min(...pointers))

    const centerByWorld = c.map((item) => item / (bufferData.length / dimension))
    const center = centerByWorld.map((item, index) => item - minPointers[index])

    return {
        centerByWorld,
        center
    };
}
export function getVN<T>(o: T, k: keyof T): number {
    return isNaN(Number(o[k])) ? 0 : Number(o[k]);
}





const getSinCos = (radian: number): SinCos => ({ sin: Math.sin(radian), cos: Math.cos(radian) })
const isNone = (o: any) => o === undefined || o === undefined
export function computedModelMatrix(
    { translate = [0, 0, 0],
        rotate = [0, 0, 0],
        center = [0, 0, 0],// 中心点
        origin = [],// 变化的原点
        scale = [1, 1, 1],
        centerByWorld = [0, 0, 0] }: TransformParam,
    dimension: Dimension
): Float32Array {
    for (const [i, p] of (center as Array<number>).entries())
        isNone(origin[i]) && ((origin as Array<number>)[i] = p)
    let modelMatrix = new Float32Array(Math.pow(dimension + 1, 2));
    const translateVec3 = [getVN(translate, 0), getVN(translate, 1), getVN(translate, 2)]
    const radianVec3 = [radian(getVN(rotate, 0)), radian(getVN(rotate, 1)), radian(getVN(rotate, 2))]
    const scaleVec3 = [getVN(scale, 0), getVN(scale, 1), getVN(scale, 2)]
    const transformCenter = [getVN(centerByWorld, 0) - (getVN(center, 0) - getVN(origin, 0)),
    getVN(centerByWorld, 1) - (getVN(center, 1) - getVN(origin, 1)),
    getVN(centerByWorld, 2) - (getVN(center, 2) - getVN(origin, 2))]
    const radianSinCos: Array<SinCos> = [getSinCos(radianVec3[0]), getSinCos(radianVec3[1]), getSinCos(radianVec3[2])]


    /**
     * ! 二维矩阵旋转、缩放、位移变化
     * 假设： 缩放倍率(Sx,Sy)，变换原点为(Cx,Cy)，位移为(Tx,Ty)，旋转θ，矩阵变换如下
     *     缩放矩阵   *    旋转矩阵
     * [ Sx  0   0      [ cosθ  -sinθ  0 
     *   0   Sy  0        sinθ  cosθ   0     =  rs[]
     *   0   0   1 ]       0     0     1 ]
     * 
     *     变换原点转换
     * [ 1 0 Cx                     [ 1 0 -Cx
     *   0 1 Cy    *   rs[]    *      0 1 -Cy    = RS[]
     *   0 0  1 ]                     0 0  1 ]
     * 
     *         [ 0 0 Tx
     * RS[] +    0 0 Ty     = M[]  
     *           0 0  0 ]    
     */
    switch (dimension.toString()) {
        case "2":
            const Tx = - scaleVec3[0] * radianSinCos[0].cos * transformCenter[0] + scaleVec3[1] * radianSinCos[0].sin * transformCenter[1] + transformCenter[0]
            const Ty = -scaleVec3[0] * radianSinCos[0].sin * transformCenter[0] - scaleVec3[1] * radianSinCos[0].cos * transformCenter[1] + transformCenter[1]
            modelMatrix.set([
                radianSinCos[0].cos * scaleVec3[0], radianSinCos[0].sin * scaleVec3[0], 0,
                -radianSinCos[0].sin * scaleVec3[1], radianSinCos[0].cos * scaleVec3[1], 0,
                Tx + translateVec3[0], Ty + translateVec3[1], 1
            ]);
        // modelMatrix.set([radianSinCos[0].cos, - radianSinCos[0].sin, tx,
        // radianSinCos[0].sin, radianSinCos[0].cos, ty,
        //     0, 0, 1
        // ]);
        case "3":
            modelMatrix.set([
            ]);
    }
    return modelMatrix;
}

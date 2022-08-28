type shaderString = string;
type Dimension = 2 | 3;
type Key = number | string | symbol;
type SinCos = { sin: number, cos: number }
type transformType = 'translate' | 'rotate' | 'scale' | 'origin'
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

export function computedCenterPointer(
    bufferData: ArrayLike<any>,
    dimension: Dimension
): ArrayLike<number> {
    const c = new Array(dimension).fill(0);
    for (let i = 0; i < bufferData.length; i += dimension) {
        const b = dimension + i;
        for (let j = i; j < b; j++) {
            c[j % dimension] += bufferData[j];
        }
    }

    return c.map((item) => item / (bufferData.length / dimension));
}
export function getValNumber<T>(o: T, k: keyof T): number {
    return isNaN(Number(o[k])) ? 0 : Number(o[k]);
}

const getSinCos = (radian: number): SinCos => ({ sin: Math.sin(radian), cos: Math.cos(radian) })
export function computedModelMatrix(
    { translate = [0, 0, 0],
        rotate = [0, 0, 0],
        scale = [1, 1, 1],
        origin = [0, 0, 0] }: TransformParam,
    dimension: Dimension
): Float32Array {
    let modelMatrix = new Float32Array(Math.pow(dimension + 1, 2));
    const translateVec3 = [getValNumber(translate, 0), getValNumber(translate, 1), getValNumber(translate, 2)]
    const radianVec3 = [radian(getValNumber(rotate, 0)), radian(getValNumber(rotate, 1)), radian(getValNumber(rotate, 2))]
    const scaleVec3 = [getValNumber(scale, 0), getValNumber(scale, 1), getValNumber(scale, 2)]
    const originVec3 = [getValNumber(origin, 0), getValNumber(origin, 1), getValNumber(origin, 2)]
    const radianSinCos: Array<SinCos> = [getSinCos(radianVec3[0]), getSinCos(radianVec3[1]), getSinCos(radianVec3[2])]

    switch (dimension.toString()) {
        case "2":
            const tx = ((1 - radianSinCos[0].cos) * originVec3[0] + radianSinCos[0].sin * originVec3[1]) + translateVec3[0]
            const ty = ((1 - radianSinCos[1].cos) * originVec3[1] - originVec3[0] * radianSinCos[1].sin) + translateVec3[1]
            console.log(origin);
            
            console.log(((1 - radianSinCos[0].cos*1.5) * originVec3[0] + radianSinCos[0].sin*1.5 * originVec3[1]));
            
            modelMatrix.set([radianSinCos[0].cos, radianSinCos[0].sin, 0,
            - radianSinCos[0].sin, radianSinCos[0].cos, 0,
                tx, ty, 1
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

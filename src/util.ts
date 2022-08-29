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
export function getValNumber<T>(o: T, k: keyof T): number {
    return isNaN(Number(o[k])) ? 0 : Number(o[k]);
}





const getSinCos = (radian: number): SinCos => ({ sin: Math.sin(radian), cos: Math.cos(radian) })
export function computedModelMatrix(
    { translate = [0, 0, 0],
        rotate = [0, 0, 0],
        origin = [0, 0, 0],
        scale = [1, 1, 1],
        centerByWorld = [0, 0, 0] }: TransformParam,
    dimension: Dimension
): Float32Array {
    let modelMatrix = new Float32Array(Math.pow(dimension + 1, 2));
    const translateVec3 = [getValNumber(translate, 0), getValNumber(translate, 1), getValNumber(translate, 2)]
    const radianVec3 = [radian(getValNumber(rotate, 0)), radian(getValNumber(rotate, 1)), radian(getValNumber(rotate, 2))]
    const scaleVec3 = [getValNumber(scale, 0), getValNumber(scale, 1), getValNumber(scale, 2)]
    const centerByWorldVec3 = [getValNumber(centerByWorld, 0), getValNumber(centerByWorld, 1), getValNumber(centerByWorld, 2)]
    const radianSinCos: Array<SinCos> = [getSinCos(radianVec3[0]), getSinCos(radianVec3[1]), getSinCos(radianVec3[2])]

    switch (dimension.toString()) {
        case "2":
            const radianTx = (1 - radianSinCos[0].cos) * centerByWorldVec3[0] + radianSinCos[0].sin * centerByWorldVec3[1]
            const radianTy = (1 - radianSinCos[1].cos) * centerByWorldVec3[1] - centerByWorldVec3[0] * radianSinCos[1].sin
            const Tx = radianTx * scaleVec3[0] + (1 - scaleVec3[0]) * centerByWorld[0]
            const Ty = radianTy * scaleVec3[1] + (1 - scaleVec3[1]) * centerByWorld[1]

            modelMatrix.set(
                [radianSinCos[0].cos * scaleVec3[0], radianSinCos[0].sin * scaleVec3[1], 0,
                - radianSinCos[0].sin * scaleVec3[0], radianSinCos[0].cos * scaleVec3[1], 0,
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

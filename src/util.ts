type shaderString = string

export function initShader(gl: WebGLRenderingContext, vertexShaderSource: shaderString, fragmentShaderSource: shaderString): WebGLProgram {
    const program: WebGLProgram = gl.createProgram()!

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)!
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)


    gl.linkProgram(program)
    gl.useProgram(program)

    return program
}
export declare global{
    declare const gl:WebGLRenderingContext
    declare const render:HTMLCanvasElement
    interface Window {
        gl: WebGLRenderingContext;
        render:HTMLCanvasElement
    }
}

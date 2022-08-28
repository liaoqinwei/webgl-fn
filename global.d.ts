export declare global {
  declare const gl: WebGLRenderingContext;
  declare const render: HTMLCanvasElement;
  interface Window {
    gl: WebGLRenderingContext;
    render: HTMLCanvasElement;
  }
  type VecArrayBufferType =
    | Float32Array
    | Float64Array
    | Uint16Array
    | Int16Array
    | Uint8Array
    | Int8Array
    | Uint32Array
    | Int32Array
    | BigUint64Array
    | BigInt64Array;
}

window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
})

const vertexShaderSource = `
void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0; 
}
`;

const fragmentShaderSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if(!gl) return false;
  
    initShaders(gl, vertexShaderSource, fragmentShaderSource);
    
    gl.drawArrays(gl.POINTS, 0, 1);
}
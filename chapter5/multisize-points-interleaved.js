window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
})

const vertexShaderSource = `
attribute vec4 a_Position;
attribute float a_PointSize;
void main() {
    gl_Position = a_Position;
    gl_PointSize = a_PointSize; 
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
    if (!gl) return false;

    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const n = initVertexBuffer(gl);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, n);
}

function initVertexBuffer(gl) {
    const verticesSizes = new Float32Array([
        0.0, 0.5, 10.0, 
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0,
    ])

    const numberOfVertices = 3;

    {
        // create the buffer object
        const vertexSizeBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexSizeBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, verticesSizes, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

        const FSIZE = verticesSizes.BYTES_PER_ELEMENT;

        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * FSIZE, 0);
        gl.enableVertexAttribArray(a_Position);

        const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

        gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(a_PointSize);
    }

    return numberOfVertices;
}
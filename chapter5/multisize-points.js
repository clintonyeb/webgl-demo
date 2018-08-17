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
    const numberOfVertices = 3;

    {
        const vertices = new Float32Array([
            0.0, 0.5, -0.5, -0.5,
            0.5, -0.5
        ])

        // create the buffer object
        const vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
    }

    {
        const sizes = new Float32Array([
            10.0, 20.0, 30.0
        ])

        // create the buffer object
        const sizeBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);

        gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW);

        const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');

        gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_PointSize);
    }

    return numberOfVertices;
}
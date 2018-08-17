window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
});

const vertexShaderSource = `
attribute vec4 a_Position;
attribute vec4 a_Color;
varying vec4 v_Color;

void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0;
    v_Color = a_Color;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec4 v_Color;

void main() {
    gl_FragColor = v_Color;
}
`;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if (!gl) return false;

    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const n = initVertexBuffer(gl);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    const vertices = new Float32Array([
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ]);

    const numberOfVertices = 3;
    const FSIZE = vertices.BYTES_PER_ELEMENT;

    {
        // create the buffer object
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 5 * FSIZE, 0);
        gl.enableVertexAttribArray(a_Position);

        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 5 * FSIZE, 2 * FSIZE);
        gl.enableVertexAttribArray(a_Color);
    }

    return numberOfVertices;
}
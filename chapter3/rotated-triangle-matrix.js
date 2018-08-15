window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
});

const vertexShaderSource = `
attribute vec4 a_Position;
uniform mat4 u_TransMat;
void main() {
    gl_Position = a_Position * u_TransMat;
}
`;

const fragmentShaderSource = `
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

const angle = 90;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if(!gl) return false;
  
    initShaders(gl, vertexShaderSource, fragmentShaderSource);
    
    const n = initVertexBuffer(gl);

    const radians = rad(angle);
    const cosB = Math.cos(radians);
    const sinB = Math.sin(radians);

    const transMat = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);

    // const transMat = new Float32Array([
    //     1, 0, 0.0, 0.0,
    //     0, 1, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);

    const u_TransMat = gl.getUniformLocation(gl.program, 'u_TransMat');

    gl.uniformMatrix4fv(u_TransMat, false, transMat);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    const vertices = new Float32Array([
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5
    ])

    const numberOfVertices = 3;

    // create the buffer object
    const vertexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return numberOfVertices;
}
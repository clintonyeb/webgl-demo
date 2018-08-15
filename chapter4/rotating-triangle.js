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

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if(!gl) return false;
  
    initShaders(gl, vertexShaderSource, fragmentShaderSource);
    
    const n = initVertexBuffer(gl);

    const transMat = new Matrix4();
    const u_TransMat = gl.getUniformLocation(gl.program, 'u_TransMat');

    let angle = 0.0;

    (function tick() {
        angle = animate(angle);
        draw(gl, n, angle, transMat, u_TransMat);
        requestAnimationFrame(tick);
    })();
}

const ANGLE_STEP = 45;

function draw(gl, vertices, angle, transMat, buffer) {
    transMat.setRotate(angle, 0, 0, 1);
    gl.uniformMatrix4fv(buffer, false, transMat.elements);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertices);
}

let prevDate = Date.now();

function animate(angle) {
    const now = Date.now();
    const elapsed = now - prevDate;
    prevDate = now;

    const newAngle = angle + (ANGLE_STEP * elapsed) / 1000;
    return newAngle % 360;
}

function initVertexBuffer(gl) {
    const vertices = new Float32Array([
        0.0, 0.2,
        -0.2, -0.2,
        0.2, -0.2
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
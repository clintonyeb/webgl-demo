window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
});

const vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 uMVPMatrix;
  varying vec4 v_Color;
  
  void main() {
    gl_Position = uMVPMatrix * a_Position;
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

    const uMVPMatrix = gl.getUniformLocation(gl.program, 'uMVPMatrix');
    const mvpMatrix = new Matrix4();

    mvpMatrix.setPerspective(40, canvas.width / canvas.height, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(uMVPMatrix, false, mvpMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
}   

function initVertexBuffer(gl) {
      // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3

    const vertices = new Float32Array([
        1.0, 1.0, 1.0,      1.0, 1.0, 1.0, // v0 white
        -1.0, 1.0, 1.0,     1.0, 0.0, 1.0, // v1 magenta
        -1.0, -1.0, 1.0,    1.0, 0.0, 0.0, // v2 red
        1.0, -1.0, 1.0,     1.0, 1.0, 0.0, // v3 yellow
        1.0, -1.0, -1.0,    0.0, 1.0, 0.0, // v4 green
        1.0, 1.0, -1.0,     0.0, 1.0, 1.0, // v5 cyan
        -1.0, 1.0, -1.0,    0.0, 0.0, 1.0, // v6 blue
        -1.0, -1.0, -1.0,   0.0, 0.0, 0.0, // v7 black 
    ]);

    const indices = new Uint8Array([
        0, 1, 2, 0, 2, 3, // front
        0, 3, 4, 0, 4, 5, // right
        1, 2, 7, 1, 6, 7, // left
        0, 1, 5, 1, 5, 6, // top
        2, 3, 4, 2, 4, 7, // bottom
        4, 5, 6, 4, 6, 7, // back
    ]);

    {
        const FSIZE = vertices.BYTES_PER_ELEMENT;

        // create the buffer object
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
        gl.enableVertexAttribArray(a_Position);

        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
        gl.enableVertexAttribArray(a_Color);

        // Unbind the buffer object
        // gl.bindBuffer(gl.ARRAY_BUFFER, null);
    } 

    {
        const indicesBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        // Unbind the buffer object
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    return indices.length;
}
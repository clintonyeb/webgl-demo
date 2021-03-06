window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
});

const vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  uniform mat4 uViewMatrix;
  uniform mat4 uProjMatrix;
  varying vec4 v_Color;
  
  void main() {
    gl_Position = uProjMatrix * uViewMatrix * a_Position;
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

let g_eyeX = 0.2,
    g_eyeY = 0.25,
    g_eyeZ = 0.25;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if (!gl) return false;

    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const n = initVertexBuffer(gl);

    {
        const uViewMatrix = gl.getUniformLocation(gl.program, 'uViewMatrix');
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)
        gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);

        document.onkeydown = (ev) => changePointOfEye(ev, gl, n, uViewMatrix, viewMatrix);
    }

    {
        const uProjMatrix = gl.getUniformLocation(gl.program, 'uProjMatrix');
        const projMatrix = new Matrix4();
        projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 0.0, 2.0);
        gl.uniformMatrix4fv(uProjMatrix, false, projMatrix.elements);
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    const vertices = new Float32Array([
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // The back green triangle
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // The middle yellow triangle
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0, // The front blue triangle
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4,
    ]);

    const numberOfVertices = 9;
    const FSIZE = vertices.BYTES_PER_ELEMENT;

    {
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
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    return numberOfVertices;
}

function changePointOfEye(event, gl, nVertices, uViewMatrix, viewMatrix) {
    if (event.keyCode == 39) g_eyeX = constrain(g_eyeX += 0.01, -1, 1); // right key
    else if (event.keyCode == 37) g_eyeX = constrain(g_eyeX -= 0.01, -1, 1); // left
    else if (event.keyCode == 38) g_eyeY = constrain(g_eyeY += 0.01, -1, 1); // up
    else if (event.keyCode == 40) g_eyeY = constrain(g_eyeY -= 0.01, -1, 1); // down
    else return;

    console.log(g_eyeX, g_eyeY, g_eyeZ);


    draw(gl, nVertices, uViewMatrix, viewMatrix);
}

function draw(gl, nVertices, uViewMatrix, viewMatrix) {
    viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, nVertices);
}
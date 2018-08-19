window.addEventListener('load', function load(ev) {
  window.removeEventListener(ev.type, load, false);
  main();
});

const vertexShaderSource = `
attribute vec4 a_Position;
attribute vec4 a_Color;
uniform mat4 uViewMatrix;
varying vec4 v_Color;

void main() {
  gl_Position = uViewMatrix * a_Position;
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

  {
    const uViewMatrix = gl.getUniformLocation(gl.program, 'uViewMatrix');
    const viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.2, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0)
    gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix.elements);
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
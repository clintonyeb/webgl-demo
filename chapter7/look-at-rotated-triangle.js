window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
  });
  
  const vertexShaderSource = `
  attribute vec4 aPosition;
  attribute vec4 aColor;
  uniform mat4 uViewMatrix;
  uniform mat4 uModelMatrix;
  varying vec4 vColor;
  
  void main() {
    gl_Position = uViewMatrix * uModelMatrix * aPosition;
    vColor = aColor;
  }
  `;
  
  const fragmentShaderSource = `
  precision mediump float;
  varying vec4 vColor;
  
  void main() {
    gl_FragColor = vColor;
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

    {
      const modelMatrix = new Matrix4();
      const uModelMatrix = gl.getUniformLocation(gl.program, 'uModelMatrix');
      modelMatrix.setRotate(-10, 0, 0, 1);
      gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix.elements);
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
  
        const aPosition = gl.getAttribLocation(gl.program, 'aPosition');
        gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 6 * FSIZE, 0);
        gl.enableVertexAttribArray(aPosition);
  
        const aColor = gl.getAttribLocation(gl.program, 'aColor');
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
        gl.enableVertexAttribArray(aColor);
  
        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  
    return numberOfVertices;
  }
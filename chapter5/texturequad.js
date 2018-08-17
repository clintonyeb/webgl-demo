window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
})

const vertexShaderSource = `
attribute vec4 a_Position;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

void main() {
    gl_Position = a_Position;
    vTexCoord = aTexCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vTexCoord);
}
`;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if (!gl) return false;

    initShaders(gl, vertexShaderSource, fragmentShaderSource);

    const n = initVertexBuffer(gl);

    initTextures(gl, n);
}

function initVertexBuffer(gl) {
    const vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0, 
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0,
    ])

    const numberOfVertices = 4;

    // create the buffer object
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const F_SIZE = vertices.BYTES_PER_ELEMENT;

    {
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, F_SIZE * 4, 0);
        gl.enableVertexAttribArray(a_Position);
    }

    {
        const aTexCoord = gl.getAttribLocation(gl.program, 'aTexCoord');
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, F_SIZE * 4, F_SIZE * 2);
        gl.enableVertexAttribArray(aTexCoord);
    }

    return numberOfVertices;
}

function initTextures(gl, numberOfVertices) {
    const texture = gl.createTexture();
    const uSampler = gl.getUniformLocation(gl.program, 'uSampler');
    const image = new Image();

    image.onload = () => loadTexture(gl, numberOfVertices, texture, uSampler, image);
    image.src = '../resources/simpson.jpg';

    return true;
}

function loadTexture(gl, numberOfVertices, texture, uSampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    if(isImageAPowerOf2(image.width) && isImageAPowerOf2(image.height)){
        gl.generateMipmap(gl.TEXTURE_2D)
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(uSampler, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, numberOfVertices);
}
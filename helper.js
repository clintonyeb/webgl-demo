function getWebGLContext(canvas) {
    const gl = canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')

    if (!gl) {
        const mess = 'Browser does not support WebGl'
        console.log(mess);
        alert(mess)
        return false
    }

    // WebGl successfully detected
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST);
    
    gl.clear(gl.COLOR_BUFFER_BIT)

    return gl;
}

function initShaders(gl, vsSource, fsSource) {
    const vertexShader = _loadShader(gl, gl.VERTEX_SHADER, vsSource, "vertex");
    const fragmentShader = _loadShader(gl, gl.FRAGMENT_SHADER, fsSource, "fragment");

    // Create a shader
    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to load shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    gl.useProgram(shaderProgram);
    gl.program = shaderProgram;
}

function _loadShader(gl, type, source, name="shader") {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Unable to compile shader: ' + name + '::: ' + gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function get_x_y(canvas, event) {
    const rect = canvas.getBoundingClientRect()

    let x = ((event.clientX - rect.left) - canvas.width/2)/(canvas.width/2);
    let y = (canvas.height/2 - (event.clientY - rect.top))/(canvas.height/2);
    
    return {
        x, y
    };
}

function rad(n) {
    return Math.PI * n / 180.0;
}

function isImageAPowerOf2(value) {
    return (value & (value-1) ) == 0;
}

function constrain (n, min, max) {
    if (arguments.length == 2) {
        max = min
        min = 0
    }
    if (n < min) 
        return min
    if (n > max) 
        return max
    return n
}
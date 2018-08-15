window.addEventListener('load', function load(ev) {
    window.removeEventListener(ev.type, load, false);
    main();
})

const vertexShaderSource = `
attribute vec4 a_Position;
void main() {
    gl_Position = a_Position;
    gl_PointSize = 10.0; 
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
    
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

    canvas.onmousedown = ev => {
        click(ev, gl, canvas, a_Position);    
    };
    // gl.drawArrays(gl.POINTS, 0, 1);
}

const g_Points = [];

function click(ev, gl, canvas, a_Position) {
    let cord = get_x_y(canvas, ev);

    g_Points.push(cord.x); g_Points.push(cord.y);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < g_Points.length; i+=2) {
        gl.vertexAttrib3f(a_Position, g_Points[i], g_Points[i+1], 0.0);
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
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
precision mediump float;
uniform vec4 u_FragColor;
void main() {
    gl_FragColor = u_FragColor;
}
`;

function main() {
    const canvas = document.getElementById('webgl-canvas')

    const gl = getWebGLContext(canvas);
    if(!gl) return false;
  
    initShaders(gl, vertexShaderSource, fragmentShaderSource);
    
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    canvas.onmousedown = ev => click(ev, gl, canvas, a_Position, u_FragColor);
}

const g_Points = [];
const g_Colors = [];

function click(ev, gl, canvas, a_Position, u_FragColor) {
    let cord = get_x_y(canvas, ev);

    console.log(cord);
    
    g_Points.push(cord);
    let color;

    if(cord.x > 0.0 && cord.y > 0.0)
        color = [1.0, 0.0, 1.0, 0.0, 1.0]
    else if(cord.x < 0.0 && cord.y < 0.0)
        color = [0.0, 1.0, 0.0, 0.0, 1.0]
    else 
        color = [1.0, 1.0, 1.0, 0.0, 1.0]

    g_Colors.push(color);

    gl.clear(gl.COLOR_BUFFER_BIT);

    for (let i = 0; i < g_Points.length; i++) {
        let pos = g_Points[i];
        let col = g_Colors[i];

        gl.vertexAttrib3f(a_Position, pos.x, pos.y, 0.0);
        gl.uniform4f(u_FragColor, col[0], col[1], col[2], col[3]);

        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
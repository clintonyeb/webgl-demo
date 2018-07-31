main();

function main() {
    const canvas = document.getElementById('canvasEl')

    const gl = canvas.getContext('webgl') 
        || canvas.getContext('experimental-webgl')
        
    if(!gl) {
        const mess = 'Browser does not support WebGl'

        console.log(mess);
        alert(mess)
        return false
    }

    // WebGl successfully detected
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)

}
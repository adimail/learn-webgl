var vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec2 vertPosition;',
  'attribute vec3 vertColor;',
  'varying vec3 fragColor;',
  '',
  'void main() {',
  '  fragColor = vertColor;',
  '  gl_Position = vec4(vertPosition, 0.9, 1.0);',
  '}',
].join('\n');

var fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  '',
  'void main() {',
  '    gl_FragColor = vec4(fragColor, 1.0);',
  '}',
].join('\n');

/**
 * @type {HTMLCanvasElement}
 */
var canvas = document.getElementById('page-surface');

/**
 * @type {WebGLRenderingContext}
 */
var gl = canvas.getContext('webgl');

if (!gl) {
  console.log('webgl not supported, falling back on experimental');
  gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
  alert('webgl not supported, falling back on experimental');
}

canvas.width = window.innerWidth;

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vertexShaderText);
gl.shaderSource(fragmentShader, fragmentShaderText);

gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  console.error(
    'ERROR compiling vertex shader',
    gl.getShaderInfoLog(vertexShader)
  );
}

gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  console.error(
    'ERROR compiling fragment shader',
    gl.getShaderInfoLog(fragmentShader)
  );
}

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error('ERROR linking program', gl.getProgramInfoLog(program));
}

//
// Create buffer
//
var triangleVertices = [
  // x, y, R, G, B
  0.0, 0.5, 1.0, 0.7, 0.2, -0.5, -0.5, 0.7, 0.0, 1.0, 0.5, -0.5, 0.1, 1.0, 0.6,
];

var triangleVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(triangleVertices),
  gl.STATIC_DRAW
);

var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
gl.vertexAttribPointer(
  positionAttributeLocation,
  2,
  gl.FLOAT,
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  0
);

gl.vertexAttribPointer(
  colorAttributeLocation,
  3,
  gl.FLOAT,
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT,
  2 * Float32Array.BYTES_PER_ELEMENT
);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(colorAttributeLocation);

//
// main render loop
//

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);

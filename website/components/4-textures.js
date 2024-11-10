var vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec3 vertPosition;',
  'attribute vec2 vertTexCoord;',
  'varying vec2 fragTexCoord;',
  'uniform mat4 mWorld;',
  'uniform mat4 mView;',
  'uniform mat4 mProj;',
  '',
  'void main()',
  '{',
  '  fragTexCoord = vertTexCoord;',
  '  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
  '}',
].join('\n');

var fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec2 fragTexCoord;',
  'uniform sampler2D sampler;',
  '',
  'void main()',
  '{',
  '  gl_FragColor = texture2D(sampler, fragTexCoord);',
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

const pixelRatio = window.pixelRatio || 1;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.9;
gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(0.1, 0.2, 0.3, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.frontFace(gl.CCW);
gl.cullFace(gl.BACK);

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
var boxVertices = [
  // X, Y, Z           U, V
  // Top
  -1.0, 1.0, -1.0, 0, 0, -1.0, 1.0, 1.0, 0, 1, 1.0, 1.0, 1.0, 1, 1, 1.0, 1.0,
  -1.0, 1, 0,

  // Left
  -1.0, 1.0, 1.0, 0, 0, -1.0, -1.0, 1.0, 1, 0, -1.0, -1.0, -1.0, 1, 1, -1.0,
  1.0, -1.0, 0, 1,

  // Right
  1.0, 1.0, 1.0, 1, 1, 1.0, -1.0, 1.0, 0, 1, 1.0, -1.0, -1.0, 0, 0, 1.0, 1.0,
  -1.0, 1, 0,

  // Front
  1.0, 1.0, 1.0, 1, 1, 1.0, -1.0, 1.0, 1, 0, -1.0, -1.0, 1.0, 0, 0, -1.0, 1.0,
  1.0, 0, 1,

  // Back
  1.0, 1.0, -1.0, 0, 0, 1.0, -1.0, -1.0, 0, 1, -1.0, -1.0, -1.0, 1, 1, -1.0,
  1.0, -1.0, 1, 0,

  // Bottom
  -1.0, -1.0, -1.0, 1, 1, -1.0, -1.0, 1.0, 1, 0, 1.0, -1.0, 1.0, 0, 0, 1.0,
  -1.0, -1.0, 0, 1,
];

var boxIndices = [
  // Top
  0, 1, 2, 0, 2, 3,

  // Left
  5, 4, 6, 6, 4, 7,

  // Right
  8, 9, 10, 8, 10, 11,

  // Front
  13, 12, 14, 15, 14, 12,

  // Back
  16, 17, 18, 16, 18, 19,

  // Bottom
  21, 20, 22, 22, 20, 23,
];

var boxVertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

var boxIndexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
gl.bufferData(
  gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(boxIndices),
  gl.STATIC_DRAW
);

var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
var texCoordAttributeLocation = gl.getAttribLocation(program, 'vertTexCoord');
gl.vertexAttribPointer(
  positionAttributeLocation, // Attribute location
  3, // Number of elements per attribute
  gl.FLOAT, // Type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  0 // Offset from the beginning of a single vertex to this attribute
);
gl.vertexAttribPointer(
  texCoordAttributeLocation, // Attribute location
  2, // Number of elements per attribute
  gl.FLOAT, // Type of elements
  gl.FALSE,
  5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
  3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);

gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(texCoordAttributeLocation);

//
// Create texture
//

var boxTexture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, boxTexture);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texImage2D(
  gl.TEXTURE_2D,
  0,
  gl.RGBA,
  gl.RGBA,
  gl.UNSIGNED_BYTE,
  document.getElementById('tesseract-texture')
);
gl.bindTexture(gl.TEXTURE_2D, null);

// Tell OpenGL state machine which program should be active.
gl.useProgram(program);

var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

var worldMatrix = new Float32Array(16);
var viewMatrix = new Float32Array(16);
var projMatrix = new Float32Array(16);

mat4.identity(worldMatrix);
mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
mat4.perspective(
  projMatrix,
  glMatrix.toRadian(45),
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000.0
);

gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

var xRotationMatrix = new Float32Array(16);
var yRotationMatrix = new Float32Array(16);

//
// Main render loop
//
var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);
var angle = 0;
var rotationMatrix = new Float32Array(16);
var mouseRotation = {
  x: 0,
  y: 0,
  z: 0,
};

var scale = 1.0;
const MIN_SCALE = 0.1;
const MAX_SCALE = 5.0;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let previousTouch = null;
let currentScale = 1.0;

canvas.addEventListener('mousedown', function (event) {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

canvas.addEventListener('mousemove', function (event) {
  if (!isDragging) return;

  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y,
  };

  // Update rotation angles based on mouse movement
  mouseRotation.y += deltaMove.x * 0.005;
  mouseRotation.x -= deltaMove.y * 0.005;

  // Add Z-axis rotation when holding Shift key
  if (event.shiftKey) {
    mouseRotation.z += deltaMove.x * 0.005;
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
});

canvas.addEventListener('mouseup', function () {
  isDragging = false;
});

// wheel event listener for scaling
canvas.addEventListener(
  'wheel',
  function (event) {
    event.preventDefault();

    // Calculate scale change based on wheel delta
    const scaleSpeed = 0.001;
    const scaleDelta = event.deltaY * scaleSpeed;
    scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale - scaleDelta));
  },
  { passive: false }
);

canvas.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

// touch event listeners after your mouse event listeners
canvas.addEventListener(
  'touchstart',
  function (event) {
    event.preventDefault();
    isDragging = true;
    if (event.touches.length === 1) {
      // Single touch - rotation
      previousTouch = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    } else if (event.touches.length === 2) {
      // Two touches - pinch to zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      previousTouch = {
        distance: Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        ),
      };
    }
  },
  { passive: false }
);

canvas.addEventListener(
  'touchmove',
  function (event) {
    event.preventDefault();
    if (!isDragging) return;

    if (event.touches.length === 1 && previousTouch) {
      // Single touch - handle rotation
      const touch = event.touches[0];
      const deltaMove = {
        x: touch.clientX - previousTouch.x,
        y: touch.clientY - previousTouch.y,
      };

      // Update rotation angles based on touch movement
      mouseRotation.y += deltaMove.x * 0.005;
      mouseRotation.x -= deltaMove.y * 0.005;

      previousTouch = {
        x: touch.clientX,
        y: touch.clientY,
      };
    } else if (event.touches.length === 2) {
      // Two touches - handle pinch zoom
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (previousTouch && previousTouch.distance) {
        const deltaDistance = currentDistance - previousTouch.distance;
        const scaleChange = deltaDistance * 0.01;
        scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + scaleChange));
      }

      previousTouch = {
        distance: currentDistance,
      };
    }
  },
  { passive: false }
);

canvas.addEventListener('touchend', function (event) {
  isDragging = false;
  previousTouch = null;
});

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);

  mat4.perspective(
    projMatrix,
    glMatrix.toRadian(45),
    canvas.width / canvas.height,
    0.1,
    1000.0
  );
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
});

var loop = function () {
  mat4.identity(worldMatrix);
  mat4.scale(worldMatrix, worldMatrix, [scale, scale, scale]);

  // Apply rotations in order: Z -> X -> Y
  mat4.rotate(worldMatrix, worldMatrix, mouseRotation.z, [0, 0, 1]); // Z-axis
  mat4.rotate(worldMatrix, worldMatrix, mouseRotation.x, [1, 0, 0]); // X-axis
  mat4.rotate(worldMatrix, worldMatrix, mouseRotation.y, [0, 1, 0]); // Y-axis

  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.clearColor(0.1, 0.2, 0.3, 1.0);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.bindTexture(gl.TEXTURE_2D, boxTexture);
  gl.activeTexture(gl.TEXTURE0);

  gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

  requestAnimationFrame(loop);
};
requestAnimationFrame(loop);

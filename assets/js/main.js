"use strict";

var gl;
var gCanvas;
var gaTexCoords = [];

var gObjetos = [];

createObjects();

var gShader = {
  aTheta: null,
};

var gCtx = {
  view: mat4(),
  perspective: mat4(),
  hp: 100,
  time: 0,
  deltaTime: 0.1,
  gameStopped: false,
  deltaHP: 1,
};

var keys;
var rodando = false;

window.onload = main;

function main() {
  gCanvas = document.getElementById("glcanvas");
  gl = gCanvas.getContext('webgl2');
  if (!gl) alert("Oops! WebGL 2.0 not found here :-(");

  console.log("Canvas: ", gCanvas.width, gCanvas.height);

  initMouseControls(gCanvas, function() {
    gCtx.view = getViewMatrix();
    gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));
  });

  keys = {};
  window.addEventListener('keydown', (e) => {
      keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', (e) => {
      keys[e.key.toLowerCase()] = false;
  });

  crieInterface();

  for(let i=0; i < gObjetos.length; i++) {
    gObjetos[i].init();
    
    let noImg = parseInt(Math.floor(Math.random() * 18) + 1);

    let no_car = Math.round(randomRange(1, 20));

    if(gObjetos[i].id == "carro") 
      gObjetos[i].texture = loadTexture(`assets/images/car/${no_car}.png`);
    else if(gObjetos[i].id == "floor")
      gObjetos[0].texture = loadTexture(`assets/images/floor/3.png`);
    else if(gObjetos[i].id == "sun")
      gObjetos[i].texture = loadTexture(`assets/images/simple/sun.png`);
    else if(gObjetos[i].id == "robot")
      gObjetos[i].texture = loadTexture(`assets/images/simple/robot.png`);
    else 
      gObjetos[i].texture = loadTexture(`assets/images/${gObjetos[i].id}/${noImg}.png`);

  }

  gl.viewport(0, 0, gCanvas.width, gCanvas.height);
  gl.clearColor(FUNDO[0], FUNDO[1], FUNDO[2], FUNDO[3]);
  gl.enable(gl.DEPTH_TEST);
  gl.disable(gl.CULL_FACE);

  crieShaders();

  render();
}

function crieInterface() {
    document.getElementById("jumpForceSlider").onchange = function (e) {
      camera.jumpForce = parseFloat(e.target.value)/100;
      console.log("Jump Force = ", camera.gravity);
    };

    document.getElementById("gravitySlider").onchange = function (e) {
      camera.gravity = -parseFloat(e.target.value)/1000;
      console.log("Gravity = ", camera.gravity);
    };

    document.getElementById("velocitySlider").onchange = function (e) {
      SPEED_INITIAL = parseFloat(e.target.value/100);
      console.log("Character Velocity = ", SPEED_INITIAL);
    };


    document.getElementById("MouseSensitivitySlider").onchange = function (e) {
      camera.sensitivity = parseFloat(e.target.value/1000);
      console.log("Mouse Sensitivity = ", camera.sensitivity);
    };

    
}

var bufNormais, bufVertices, aPosition, aNormal, bufTextura, aTexCoord, texture;

function crieShaders() {
  
  
  bufNormais = gl.createBuffer();
  bufVertices = gl.createBuffer();  
  bufTextura = gl.createBuffer();
  
  gShader.program = makeProgram(gl, gVertexShaderSrc, gFragmentShaderSrc);
  gl.useProgram(gShader.program);

  gShader.uModel = gl.getUniformLocation(gShader.program, "uModel");
  gShader.uView = gl.getUniformLocation(gShader.program, "uView");
  gShader.uPerspective = gl.getUniformLocation(gShader.program, "uPerspective");
  gShader.uInverseTranspose = gl.getUniformLocation(gShader.program, "uInverseTranspose");

  gCtx.perspective = perspective(FOVY, ASPECT, NEAR, FAR);
  gCtx.view = lookAt(camera.eye, camera.at, camera.up);

  gl.uniformMatrix4fv(gShader.uPerspective, false, flatten(gCtx.perspective));
  gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));


  gShader.uLuzPos = gl.getUniformLocation(gShader.program, "uLuzPos");
  gl.uniform4fv(gShader.uLuzPos, LUZ.pos);

  gShader.uCorAmb = gl.getUniformLocation(gShader.program, "uCorAmbiente");
  gShader.uCorDif = gl.getUniformLocation(gShader.program, "uCorDifusao");
  gShader.uCorEsp = gl.getUniformLocation(gShader.program, "uCorEspecular");
  gShader.uAlfaEsp = gl.getUniformLocation(gShader.program, "uAlfaEsp");

  gl.uniform4fv(gShader.uCorEsp, LUZ.esp);

  binderNormVert(gObjetos[0]);

  
};

var lastTime = 0;
var fixedTimeStep = 10;
var accumulator = 0;

function render(currentTime) {
  updateCameraPosition(keys, function() {
    gCtx.view = getViewMatrix();
    gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));
  });

  if (!lastTime) {
      lastTime = currentTime;
      window.requestAnimationFrame(render);
      return;
  }

  var deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  while (accumulator >= fixedTimeStep) {
      checkCollisionHouses()
      carLimit()
      updateScene(fixedTimeStep);
      accumulator -= fixedTimeStep;

      gCtx.time += gCtx.deltaTime;
      if(gCtx.time > 60*24) gCtx.time = 0;
      
      setTimerClock(gCtx.time);
  }

  renderScene();

  window.requestAnimationFrame(render);
}

function updateScene(step) {
    for (const objeto of gObjetos) {
        if (objeto.rodando) {
            objeto.theta[objeto.axis] -= gCtx.velRotacion*step;

        }
        if (objeto instanceof Cubo) {
          objeto.trans = add(objeto.trans, objeto.velocidade);
          objeto.range = {
            x: [objeto.trans[0] - 0.5*objeto.escala[0], objeto.trans[0] + 0.5*objeto.escala[0]],
            y: [objeto.trans[1] - 0.5*objeto.escala[1], objeto.trans[1] + 0.5*objeto.escala[1]],
            z: [objeto.trans[2] - 0.5*objeto.escala[2], objeto.trans[2] + 0.5*objeto.escala[2]],
          };
        }
    }
}



function renderScene(){
  let mR;
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (const objeto of gObjetos) {
      if (objeto.rodando) objeto.theta[objeto.axis] -= gCtx.velRotacion;

      let model = mat4();
      if (objeto instanceof Cubo) {
        var normal = normalize(vec3(objeto.trans[0], objeto.trans[1], objeto.trans[2]));

        var up = vec3(0, 1, 0);

        let angulo = Math.acos(dot(normal, up) / (length(normal) * length(up))) * 180.0 / Math.PI;
        mR = rotate(angulo, vec3(0,0,1));
    }
    else{
      mR = rotate(0, vec3(0,0,1));
    }

    model = mult(model, rotate(-objeto.theta[EIXO_X_IND], EIXO_X));
    model = mult(model, rotate(-objeto.theta[EIXO_Y_IND], EIXO_Y));
    model = mult(model, rotate(-objeto.theta[EIXO_Z_IND], EIXO_Z));

    if (1) {
      model = mult(model, rotate(-objeto.theta[EIXO_X_IND], EIXO_X));
      model = mult(model, rotate(-objeto.theta[EIXO_Y_IND], EIXO_Y));
      model = mult(model, rotate(-objeto.theta[EIXO_Z_IND], EIXO_Z));
    }
    else {
      let rx = rotateX(objeto.theta[EIXO_X_IND]);
      let ry = rotateY(objeto.theta[EIXO_Y_IND]);
      let rz = rotateZ(objeto.theta[EIXO_Z_IND]);
      model = mult(rz, mult(ry, rx));
    }

    let mT = translate(objeto.trans[0], objeto.trans[1], objeto.trans[2]);
    let mS = scale(objeto.escala[0], objeto.escala[1], objeto.escala[2]);

    model = mult(model, mT)
    model = mult(model, mS);

    gCtx.view = getViewMatrix();
    gl.uniformMatrix4fv(gShader.uView, false, flatten(gCtx.view));

    let modelView = mult(gCtx.view, model);
    let modelViewInv = inverse(modelView);
    let modelViewInvTrans = transpose(modelViewInv);

    binderNormVert(objeto)

    gl.uniformMatrix4fv(gShader.uModel, false, flatten(model));
    gl.uniformMatrix4fv(gShader.uInverseTranspose, false, flatten(modelViewInvTrans));

    gl.bindTexture(gl.TEXTURE_2D, objeto.texture);

    gl.drawArrays(gl.TRIANGLES, 0, objeto.np);
  };
}



function binderNormVert(objeto){
    gl.bindBuffer(gl.ARRAY_BUFFER, bufNormais);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(objeto.nor), gl.STATIC_DRAW);

    aNormal = gl.getAttribLocation(gShader.program, "aNormal");
  
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aNormal);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufVertices);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(objeto.pos), gl.STATIC_DRAW);

    aPosition = gl.getAttribLocation(gShader.program, "aPosition");
    gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    gl.uniform4fv(gShader.uCorAmb, mult(LUZ.amb, objeto.mat.amb));
    gl.uniform4fv(gShader.uCorDif, mult(LUZ.dif, objeto.mat.dif));
    gl.uniform1f(gShader.uAlfaEsp, MAT.alfa);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufTextura);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(objeto.tex), gl.STATIC_DRAW);

    aTexCoord = gl.getAttribLocation(gShader.program, "aTexCoord");
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aTexCoord);

    gl.uniform1i(gl.getUniformLocation(gShader.program, "uTextureMap"), 0);

}

function configureTexturaDaURL(url) {
    let texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    
    let img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";
    img.addEventListener('load', function () {
        console.log("Image Loaded", img.width, img.height);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, img.width, img.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
  );
  return img;
};

function loadTexture(url) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    image.src = url;

    return texture;
}

function clampCameraToGrid() {
  camera.eye[0] = Math.max(-TOTAL_BLOCK_WIDTH/2+STREET_MARGIN, Math.min(TOTAL_BLOCK_WIDTH/2+STREET_MARGIN, camera.eye[0]));
  camera.eye[2] = Math.max(-TOTAL_BLOCK_LENGTH/2, Math.min(TOTAL_BLOCK_LENGTH/2+STREET_MARGIN, camera.eye[2]));
}

const originalUpdateCameraPosition = updateCameraPosition;
updateCameraPosition = function(...args) {
  originalUpdateCameraPosition.apply(this, args);
  clampCameraToGrid();
};

function setHPBar(percent) {
  const bar = document.getElementById('hp-bar');
  const label = document.querySelector('.hp-bar-label');
  if (bar) bar.style.width = Math.max(0, Math.min(100, percent)) + '%';
  if (label) label.textContent = Math.round(percent) + '%';
}

function setTimerClock(seconds) {
  const el = document.getElementById('timer-clock');
  if (!el || isNaN(seconds)) return;
  seconds = Math.max(0, seconds);
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  el.textContent = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

  
  let amb = 0.5 + 0.5 * Math.sin((2 * Math.PI * seconds) / (60 * 24));
  amb = Math.max(0, Math.min(0.9, amb));
  LUZ.amb = vec4(amb, amb, amb, 1.0);
}


function stopGame() {
  gCtx.gameStopped = true;
}

var _originalRender = render;
render = function(currentTime) {
  if (gCtx.gameStopped) return;
  _originalRender(currentTime);
};
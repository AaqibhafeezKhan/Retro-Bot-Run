// ========================================================
// Sphere Model Generation
// ========================================================
function Sphere(
  divEsfera = 3,
  scale = vec3(1, 1, 1),
  trans = vec3(0, 0, 0),
  mat = MAT, // material properties
  rotating = false,
) {
  this.np = 6; // number of positions (vertices)
  this.pos = []; // position vector
  this.nor = []; // normal vector
  this.tex = []; // texture vector
  this.id = 'simple'; // object id

  this.axis = EIXO_Z_IND; // used for rotation animation
  this.theta = vec3(0, 0, 0); // rotation on each axis
  this.rodando = rotating; // pause animation

  this.escala = scale;
  this.trans = trans;
  this.mat = mat;

  // range (bounding box)
  this.range = {
    x: [trans[0] - 0.5 * scale[0], trans[0] + 0.5 * scale[0]],
    y: [trans[1] - 0.5 * scale[1], trans[1] + 0.5 * scale[1]],
    z: [trans[2] - 0.5 * scale[2], trans[2] + 0.5 * scale[2]],
  };

  this.init = function () {
    this.createSphere(divEsfera);
    console.log(this.np);
  }


  this.createSphere = function (ndivisions = 2) {
    // Start with the vertices of an octahedron (a base for the sphere)
    let vp = [
      vec3(1.0, 0.0, 0.0), // +X
      vec3(0.0, 1.0, 0.0), // +Y
      vec3(0.0, 0.0, 1.0)  // +Z
    ];

    let vn = [
      vec3(-1.0, 0.0, 0.0), // -X
      vec3(0.0, -1.0, 0.0), // -Y
      vec3(0.0, 0.0, -1.0)  // -Z
    ];

    // 8 initial triangles forming an octahedron
    let triangles = [
      [vp[0], vp[1], vp[2]],
      [vp[0], vn[2], vp[1]], // using indices: +X, -Z, +Y

      [vp[0], vp[2], vn[1]], // +X, +Z, -Y
      [vp[0], vn[1], vn[2]], // +X, -Y, -Z

      [vn[0], vp[2], vp[1]], // -X, +Z, +Y
      [vn[0], vp[1], vn[2]], // -X, +Y, -Z

      [vn[0], vn[1], vp[2]], // -X, -Y, +Z
      [vn[0], vn[2], vn[1]], // -X, -Z, -Y
    ];

    for (let i = 0; i < triangles.length; i++) {
      let a, b, c;
      [a, b, c] = triangles[i];

      this.divideTriangle(a, b, c, ndivisions);
    }

    this.np = this.pos.length;
  };




  this.divideTriangle = function (a, b, c, ndivs) {
    // Each level breaks a triangle into 4 sub-triangles
    // a, b, c in right-hand order
    //     c
    // a   b

    // base case
    if (ndivs > 0) {
      let ab = mix(a, b, 0.5);
      let bc = mix(b, c, 0.5);
      let ca = mix(c, a, 0.5);

      // Normalize to project new vertices onto the sphere surface
      ab = normalize(ab);
      bc = normalize(bc);
      ca = normalize(ca);

      this.divideTriangle(a, ab, ca, ndivs - 1);
      this.divideTriangle(b, bc, ab, ndivs - 1);
      this.divideTriangle(c, ca, bc, ndivs - 1);
      this.divideTriangle(ab, bc, ca, ndivs - 1);
    } else {
      this.insertTriangle(a, b, c);
    }
  }

  this.insertTriangle = function (a, b, c) {
    this.pos.push(vec4(...a, 1));
    this.pos.push(vec4(...b, 1));
    this.pos.push(vec4(...c, 1));

    // For a sphere, the normal is often the normalized position vector itself.
    // However, the original code calculates the triangle normal:
    var normal = this.getNormal(a, b, c);

    this.nor.push(normal);
    this.nor.push(normal);
    this.nor.push(normal);

    this.tex.push(this.textureWrapping(a));
    this.tex.push(this.textureWrapping(b));
    this.tex.push(this.textureWrapping(c));
  }

  this.getNormal = function (a, b, c) {
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);

    return vec3(normal);
  }

  this.textureWrapping = function (point) {
    // Spherical mapping (UV coordinates)
    let s = Math.atan2(point[2], point[0]) / (2 * Math.PI);
    let t = 1 - Math.acos(point[1]) / Math.PI;

    return vec2(s, t);
  }
};



// ========================================================
// Unit Cube Model Generation
// ========================================================

// Cube corners (CUBE_CORNERS):
// 0: (-0.5, -0.5,  0.5, 1.0) // Front-Bottom-Left
// 1: (-0.5,  0.5,  0.5, 1.0) // Front-Top-Left
// 2: ( 0.5,  0.5,  0.5, 1.0) // Front-Top-Right
// 3: ( 0.5, -0.5,  0.5, 1.0) // Front-Bottom-Right
// 4: (-0.5, -0.5, -0.5, 1.0) // Back-Bottom-Left
// 5: (-0.5,  0.5, -0.5, 1.0) // Back-Top-Left
// 6: ( 0.5,  0.5, -0.5, 1.0) // Back-Top-Right
// 7: ( 0.5, -0.5, -0.5, 1.0) // Back-Bottom-Right
const CUBE_CORNERS = [
  vec4(-0.5, -0.5, 0.5, 1.0),  // 0
  vec4(-0.5, 0.5, 0.5, 1.0),   // 1
  vec4(0.5, 0.5, 0.5, 1.0),    // 2
  vec4(0.5, -0.5, 0.5, 1.0),   // 3
  vec4(-0.5, -0.5, -0.5, 1.0), // 4
  vec4(-0.5, 0.5, -0.5, 1.0),  // 5
  vec4(0.5, 0.5, -0.5, 1.0),   // 6
  vec4(0.5, -0.5, -0.5, 1.0)   // 7
];

var vTextura = [      // texture coordinates
  vec2(0.05, 0.05),
  vec2(0.05, 0.75),
  vec2(0.95, 0.75),
  vec2(0.95, 0.05)
];

/** ................................................................
* Cube Object of side 1 centered at the origin.
*
* uses auxiliary function quad(tex, pos, nor, vert, a, b, c, d)
*/
function Cubo(
  scale = vec3(1, 1, 1),
  trans = vec3(0, 0, 0),
  mat = MAT,
  velocity = vec3(0, 0, 0), // rotation/movement velocity
  rotating = false,
) {
  this.np = 36; // number of positions (vertices)
  this.pos = []; // position vector
  this.nor = []; // normal vector
  this.tex = []; // texture vector
  this.id = 'None'

  this.axis = EIXO_Z_IND; // used for rotation animation
  this.theta = vec3(0, 0, 0); // rotation on each axis
  this.rodando = rotating; // pause animation

  this.velocidade = velocity;
  this.escala = scale;
  this.trans = trans;
  this.mat = mat

  this.textureURL = null; // texture

  // range where the object is located (bounding box)
  this.range = {
    x: [trans[0] - 0.5 * scale[0], trans[0] + 0.5 * scale[0]],
    y: [trans[1] - 0.5 * scale[1], trans[1] + 0.5 * scale[1]],
    z: [trans[2] - 0.5 * scale[2], trans[2] + 0.5 * scale[2]],
  };


  this.init = function () { // loads the buffers
    // Front face: 1, 0, 3, 2
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 1, 0, 3, 2);
    // Right face: 2, 3, 7, 6
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 2, 3, 7, 6);
    // Bottom face: 3, 0, 4, 7
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 3, 0, 4, 7);
    // Top face: 6, 5, 1, 2
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 6, 5, 1, 2);
    // Back face: 4, 5, 6, 7
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 4, 5, 6, 7);
    // Left face: 5, 4, 0, 1
    quad(this.tex, this.pos, this.nor, CUBE_CORNERS, 5, 4, 0, 1);
  };
};

/** ................................................................
* Creates triangles from a quad and loads them into arrays
* pos (positions), nor (normals), and tex (texture coordinates).
* @param {*} tex : texture array to be loaded
* @param {*} pos : position array to be loaded
* @param {*} nor : normal array to be loaded
* @param {*} vert : array with quad vertices
* @param {*} a, b, c, d : indices of vertices in counter-clockwise order
*/
function quad(tex, pos, nor, vert, a, b, c, d) {
  var t1 = subtract(vert[b], vert[a]);
  var t2 = subtract(vert[c], vert[b]);
  var normal = cross(t1, t2);
  normal = vec3(normal);


  // Triangle 1: a, b, c
  pos.push(vert[a]);
  nor.push(normal);
  tex.push(vTextura[0]);

  pos.push(vert[b]);
  nor.push(normal);
  tex.push(vTextura[1]);

  pos.push(vert[c]);
  nor.push(normal);
  tex.push(vTextura[2]);


  // Triangle 2: a, c, d
  pos.push(vert[a]);
  nor.push(normal);
  tex.push(vTextura[0]);

  pos.push(vert[c]);
  nor.push(normal);
  tex.push(vTextura[2]);

  pos.push(vert[d]);
  nor.push(normal);
  tex.push(vTextura[3]);
};


// ========================================================
// Plane/Floor Model Generation
// ========================================================

// floor coordinates (on the Y=0 plane)
const FLOOR_CORNERS = [
  vec4(-0.5, 0, -0.5, 1.0), // Back-Left
  vec4(-0.5, 0, 0.5, 1.0), // Front-Left
  vec4(0.5, 0, 0.5, 1.0), // Front-Right
  vec4(0.5, 0, -0.5, 1.0), // Back-Right
];


var MARGIN = 3;

function Floor(
  scale = vec3(1, 1, 1),
  trans = vec3(0, 0, 0),
  mat = MAT,

) {
  this.np = 6;
  this.pos = []; // position vector
  this.nor = []; // normal vector
  this.tex = []; // texture vector

  this.escala = scale;
  this.trans = trans;
  this.mat = mat

  this.axis = EIXO_Y_IND; // used for rotation animation
  this.theta = vec3(0, 0, 0); // rotation on each axis
  this.rodando = false; // pause animation

  this.init = function () { // loads the buffers
    // The quad function creates two triangles for the floor
    quad(this.tex, this.pos, this.nor, FLOOR_CORNERS, 0, 1, 2, 3);
  }
}



// ========================================================
// Cylinder Model Generation
// ========================================================
class Cilindro {
  constructor(
    faces = 3,
    scale = vec3(1, 1, 1),
    trans = vec3(0, 0, 0),
    mat = MAT,
    rotating = false,
    velocity = vec3(0, 0, 0)
  ) {
    this.faces = faces;
    this.np = 0;
    this.pos = [];
    this.nor = [];
    this.tex = [];
    this.id = 'cilindro';
    this.escala = scale;
    this.trans = trans;
    this.mat = mat;
    this.axis = EIXO_Z_IND;
    this.theta = vec3(0, 0, 0);
    this.rodando = rotating;
    this.velocidade = velocity;
    this.range = {
      x: [trans[0] - 0.5 * scale[0], trans[0] + 0.5 * scale[0]],
      y: [trans[1] - 0.5 * scale[1], trans[1] + 0.5 * scale[1]],
      z: [trans[2] - 0.5 * scale[2], trans[2] + 0.5 * scale[2]],
    };
  }

  init() {
    this.pos = [];
    this.nor = [];
    this.tex = [];
    // Number of vertices around the circle. Max faces * 4 for subdivision levels.
    let n = Math.max(3, Math.pow(2, this.faces) * 4); 
    let top = [],
      bottom = [];

    // 1. Generate circular top and bottom points
    for (let i = 0; i < n; i++) {
      let theta = 2 * Math.PI * i / n;
      let x = Math.cos(theta) * 0.5;
      let z = Math.sin(theta) * 0.5;
      top.push(vec3(x, 0.5, z));
      bottom.push(vec3(x, -0.5, z));
    }

    // 2. Generate side walls (quads/triangles)
    for (let i = 0; i < n; i++) {
      let next = (i + 1) % n;
      this.addQuad(top[i], top[next], bottom[next], bottom[i]);
    }

    // 3. Generate top cap (triangles from center to edges)
    let centerTop = vec3(0, 0.5, 0);
    for (let i = 0; i < n; i++) {
      let next = (i + 1) % n;
      this.addTriangle(centerTop, top[i], top[next]);
    }

    // 4. Generate bottom cap (triangles from center to edges)
    let centerBottom = vec3(0, -0.5, 0);
    for (let i = 0; i < n; i++) {
      let next = (i + 1) % n;
      // Note the order change for bottom cap to ensure correct face culling/normal direction
      this.addTriangle(centerBottom, bottom[next], bottom[i]); 
    }
    
    // The original code uses a slightly different (and arguably simpler/faster)
    // loop for the caps which is retained below, but the logic above is more correct for `n` segments.
    // The original logic assumes n >= 3, and triangulates from index 0 to n-1.
    /*
    for (let i = 1; i < n - 1; i++) {
      this.addTriangle(top[0], top[i], top[i + 1]);
    }
    for (let i = 1; i < n - 1; i++) {
      this.addTriangle(bottom[0], bottom[i + 1], bottom[i]);
    }
    */
    
    this.np = this.pos.length;
  }

  addQuad(a, b, c, d) {
    this.addTriangle(a, b, d);
    this.addTriangle(b, c, d);
  }

  addTriangle(a, b, c) {
    this.pos.push(vec4(...a, 1));
    this.nor.push(this.getNormal(a, b, c));
    this.tex.push(this.textureWrapping(a));
    this.pos.push(vec4(...b, 1));
    this.nor.push(this.getNormal(a, b, c));
    this.tex.push(this.textureWrapping(b));
    this.pos.push(vec4(...c, 1));
    this.nor.push(this.getNormal(a, b, c));
    this.tex.push(this.textureWrapping(c));
  }

  getNormal(a, b, c) {
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = cross(t1, t2);

    return vec3(normal);
  }

  textureWrapping(point) {
    // Cylindrical mapping (polar coordinates for S, linear for T)
    let s = Math.atan2(point[2], point[0]) / (2 * Math.PI) + 0.5;
    let t = point[1] + 0.5; // [-0.5, 0.5] -> [0, 1]

    return vec2(s, t);
  }
}


/*
  CREATING OBJECTS
*/
// FLOOR
var floor = new Floor(
  vec3(scale_floor, 1, scale_floor),
  vec3(0, 0, 0),
  MAT_FLOOR,
)
floor.id = 'floor';

// SUN
var sun = new Sphere(
  5,
  vec3(sizeSun, sizeSun, sizeSun),
  vec3(LUZ.pos[0], LUZ.pos[1], LUZ.pos[2]), // Sun position
  LUZ // material properties
);
sun.id = "sun"


// HOUSES
// Generate a grid of blocks (nxm)
function generateGrid() {
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      // Calculate the center (x0, z0) for each block
      let x0 = col * (BLOCK_WIDTH + STREET_WIDTH) - ((GRID_COLS - 1) * (BLOCK_WIDTH + STREET_WIDTH)) / 2;
      let z0 = row * (BLOCK_LENGTH + STREET_WIDTH) - ((GRID_ROWS - 1) * (BLOCK_LENGTH + STREET_WIDTH)) / 2;
      createBlockOfHouses(x0, z0, NO_CASAS_LINEAS, NO_CASAS_LINEAS);
    }
  }
}

// Function to create a block of houses centered at (centerX, centerZ)
function createBlockOfHouses(centerX = 0, centerZ = 0, housesX = 2, housesZ = 2) {
  // Houses are placed adjacent to each other, forming a compact block
  let totalWidth = housesX * LARGURA_CASA;
  let totalLength = housesZ * LARGO_CASA;
  let startX = centerX - totalWidth / 2 + LARGURA_CASA / 2;
  let startZ = centerZ - totalLength / 2 + LARGO_CASA / 2;

  for (let ix = 0; ix < housesX; ix++) {
    for (let iz = 0; iz < housesZ; iz++) {
      let floors = randomRange(MIN_NO_ANDARES, MAX_NO_ANDARES);
      let posX = startX + ix * LARGURA_CASA;
      let posZ = startZ + iz * LARGO_CASA;
      let posY = ALTURA_ANDAR * floors; // Center Y position is half of the total height

      let cube = new Cubo(
        vec3(LARGURA_CASA, 2 * ALTURA_ANDAR * floors, LARGO_CASA), // scale (total height is 2*posY)
        vec3(posX, posY, posZ), // translation (center position)
        RandomMat()
      );
      cube.id = `building`;
      gObjetos.push(cube);
    }
  }

}

// --- DYNAMIC STREET AND CAR LOGIC ---

function settingCars() {
  // Vertical streets (along Z, between columns)
  for (let c = 1; c < GRID_COLS; c++) {
    let x = (c - 0.5) * (BLOCK_WIDTH + STREET_WIDTH) - ((GRID_COLS - 1) * (BLOCK_WIDTH + STREET_WIDTH)) / 2;
    streetPositions.push({
      axis: 'z',
      x: x,
      zStart: -TOTAL_BLOCK_LENGTH / 2 + STREET_MARGIN,
      zEnd: TOTAL_BLOCK_LENGTH / 2 - STREET_MARGIN
    });
  }
  // Horizontal streets (along X, between rows)
  for (let r = 1; r < GRID_ROWS; r++) {
    let z = (r - 0.5) * (BLOCK_LENGTH + STREET_WIDTH) - ((GRID_ROWS - 1) * (BLOCK_LENGTH + STREET_WIDTH)) / 2;
    streetPositions.push({
      axis: 'x',
      z: z,
      xStart: -TOTAL_BLOCK_WIDTH / 2 + STREET_MARGIN,
      xEnd: TOTAL_BLOCK_WIDTH / 2 - STREET_MARGIN
    });
  }

  // --- Improved car distribution: round-robin to all streets ---
  let carAssignments = Array.from({
    length: streetPositions.length
  }, () => []);
  for (let i = 0; i < NO_CARROS; i++) {
    carAssignments[i % streetPositions.length].push(i);
  }

  let CAR_HEIGHT, CAR_WIDTH, CAR_DEPTH, STREET_Y;

  for (let s = 0; s < streetPositions.length; s++) {
    CAR_HEIGHT = randomRange(1, 3); // height of the car
    CAR_WIDTH = randomRange(2, 5); // width of the car
    CAR_DEPTH = randomRange(2, 4); // depth of the car
    STREET_Y = CAR_HEIGHT; // y position for all cars (center of the car is at STREET_Y, so total height is 2*CAR_HEIGHT)

    let street = streetPositions[s];
    let usedPositions = [];
    let scale = 0.9;
    for (let i = 0; i < carAssignments[s].length; i++) {
      let car, trans;
      if (street.axis === 'z') {
        // Cars move along Z
        let z;
        do {
          z = street.zStart + Math.random() * (street.zEnd - street.zStart);
        } while (usedPositions.some(p => Math.abs(p - z) < CAR_SPACING));
        usedPositions.push(z);
        let x_pos = randomRange(-scale * CAR_WIDTH, scale * CAR_WIDTH);
        trans = vec3(street.x + x_pos, STREET_Y, z);
        let randomVel = randomRange(-CAR_SPEED, CAR_SPEED);
        if (randomVel < 0.1 && randomVel > -0.1) randomVel += 0.1;
        car = new Cubo(
          vec3(CAR_WIDTH, 2 * CAR_HEIGHT, CAR_DEPTH),
          trans,
          RandomMat(true),
          vec3(0, 0, randomVel)
        );
      } else {
        // Cars move along X
        let x;
        do {
          x = street.xStart + Math.random() * (street.xEnd - street.xStart);
        } while (usedPositions.some(p => Math.abs(p - x) < CAR_SPACING));
        usedPositions.push(x);
        let z_pos = randomRange(-scale * CAR_WIDTH, scale * CAR_WIDTH);
        let randomVel = randomRange(-CAR_SPEED, CAR_SPEED);
        if (randomVel < 0.2 && randomVel > -0.2) randomVel *= 2;
        trans = vec3(x, STREET_Y, street.z + z_pos);
        car = new Cubo(
          vec3(CAR_DEPTH, 2 * CAR_HEIGHT, CAR_WIDTH),
          trans,
          RandomMat(true),
          vec3(randomVel, 0, 0)
        );
      }
      car.id = 'carro';
      gObjetos.push(car);
    }
  }
}
function carLimit() {
  for (const object of gObjetos) {
    if (object instanceof Cubo && object.id === 'carro') {
      // Check X and Z limits for the grid
      let minX = -TOTAL_BLOCK_WIDTH;
      let maxX = TOTAL_BLOCK_WIDTH;
      let minZ = -TOTAL_BLOCK_LENGTH;
      let maxZ = TOTAL_BLOCK_LENGTH;
      let moved = false;
      // If car is outside X bounds, wrap to other side
      if (object.trans[0] < minX) {
        object.trans[0] = maxX;
        moved = true;
      } else if (object.trans[0] > maxX) {
        object.trans[0] = minX;
        moved = true;
      }
      // If car is outside Z bounds, wrap to other side
      if (object.trans[2] < minZ) {
        object.trans[2] = maxZ;
        moved = true;
      } else if (object.trans[2] > maxZ) {
        object.trans[2] = minZ;
        moved = true;
      }
      // Update the car's bounding box if moved
      if (moved) {
        object.range = {
          x: [object.trans[0] - 0.5 * object.escala[0], object.trans[0] + 0.5 * object.escala[0]],
          y: [object.trans[1] - 0.5 * object.escala[1], object.trans[1] + 0.5 * object.escala[1]],
          z: [object.trans[2] - 0.5 * object.escala[2], object.trans[2] + 0.5 * object.escala[2]],
        };
      }
    }
  }
}



function checkCollisionHouses() {
  for (const object of gObjetos) {
    if (object.id == "building" || object.id == "carro") {
      // Check if the camera is within the bounds of the object
      if (camera.eye[0] >= object.range.x[0] && camera.eye[0] <= object.range.x[1] &&
        camera.eye[1] >= object.range.y[0] && camera.eye[1] <= object.range.y[1] &&
        camera.eye[2] >= object.range.z[0] && camera.eye[2] <= object.range.z[1]) {

        console.log(`Collision with ${object.id} at position: `, object.id);
        // Calculate the direction vector from the object center to the camera
        let objectCenter = vec3(
          (object.range.x[0] + object.range.x[1]) / 2,
          (object.range.y[0] + object.range.y[1]) / 2,
          (object.range.z[0] + object.range.z[1]) / 2
        );
        let dir = subtract(camera.eye, objectCenter);
        let len = Math.sqrt(dot(dir, dir));
        if (len === 0) len = 1;
        dir = dir.map(v => v / len);

        // Find the closest point outside the object bounding box
        let margin = 0.1; // small offset to prevent sticking
        let newEye = vec3(camera.eye);
        let i = 0;
        for (const [key, value] of Object.entries(object.range)) {
          if (camera.eye[i] < value[0]) newEye[i] = value[0] - margin;
          if (camera.eye[i] > value[1]) newEye[i] = value[1] + margin;
          i += 1;
        }

        // If inside, push out along the largest penetration axis
        let dx0 = Math.abs(camera.eye[0] - object.range.x[0]);
        let dx1 = Math.abs(camera.eye[0] - object.range.x[1]);
        let dy0 = Math.abs(camera.eye[1] - object.range.y[0]);
        let dy1 = Math.abs(camera.eye[1] - object.range.y[1]);
        let dz0 = Math.abs(camera.eye[2] - object.range.z[0]);
        let dz1 = Math.abs(camera.eye[2] - object.range.z[1]);
        let minPen = Math.min(dx0, dx1, dy0, dy1, dz0, dz1);

        if (minPen === dx0) newEye[0] = object.range.x[0] - margin;
        else if (minPen === dx1) newEye[0] = object.range.x[1] + margin;
        else if (minPen === dy0) newEye[1] = object.range.y[0] - margin;
        else if (minPen === dy1) newEye[1] = object.range.y[1] + margin;
        else if (minPen === dz0) newEye[2] = object.range.z[0] - margin;
        else if (minPen === dz1) newEye[2] = object.range.z[1] + margin;

        // Elastic collision: reflect the camera's velocity (if you have one)
        if (object.id === "carro") {
          // Find normal of the collision surface
          let normal = [0, 0, 0];
          if (minPen === dx0) normal = vec3(-1, 0, 0);
          else if (minPen === dx1) normal = vec3(1, 0, 0);
          else if (minPen === dy0) normal = vec3(0, -1, 0);
          else if (minPen === dy1) normal = vec3(0, 1, 0);
          else if (minPen === dz0) normal = vec3(0, 0, -1);
          else if (minPen === dz1) normal = vec3(0, 0, 1);
          // v' = v - 2*(v·n)*n
          let vDotN = dot(camera.velocidad, normal);
          camera.velocidad = subtract(camera.velocidad, scale(2 * vDotN, normal));

          console.log("Collision with car")
          gCtx.hp -= gCtx.deltaHP;
          setHPBar(gCtx.hp);

          let score = Math.round(gCtx.time / (60));

          if (gCtx.hp <= 0) {
            document.getElementById("start-game-overlay").innerHTML = `<span class="start-game-text">Game Over<br>Reload the page<br>Score ${score}</span>`;
            stopGame();
          }
        }

        // Move camera to the new position outside the object
        camera.eye[0] = newEye[0];
        camera.eye[2] = newEye[2];

        for (const part of ROBOT) {
          // This seems to be an error in the original logic, potentially trying to
          // move the robot to the same x and z as the camera, but applying it as an addition
          // on every collision. The previous file had: part.trans = add(part.trans, moveAmount);
          // Assuming the intention is to keep the robot translated *with* the camera.
          // Reverting to the previous file's logic for collision movement to be safe.
          // For now, I'll keep the direct translation from the original.
          part.trans = add(part.trans, vec3(newEye[0] - camera.eye[0], 0, newEye[2] - camera.eye[2]));
        }

      }
    }
  }
}

// Robot Body

// Body of the robot
let corpo = new Cilindro(
  faces = 5,
  scale = vec3(CORPO_RADIUS, ROBOT_HEIGHT_CORPO, CORPO_RADIUS),
  trans = vec3(0, ROBOT_HEIGHT_LEGS + ROBOT_HEIGHT_CORPO / 2, 0),
  mat = MAT_ROBOT,
);
corpo.id = 'robot';

// Head of the robot
let head = new Cilindro(
  faces = 5,
  scale = vec3(HEAD_RADIUS, ROBOT_HEIGHT_HEAD, HEAD_RADIUS),
  trans = vec3(0, ROBOT_HEIGHT_CORPO + ROBOT_HEIGHT_LEGS + ROBOT_HEIGHT_HEAD / 2, 0),
  mat = MAT_ROBOT,
);

// Legs of the robot
let leg1 = new Cilindro(
  faces = 5,
  scale = vec3(LEG_RADIUS, ROBOT_HEIGHT_LEGS, LEG_RADIUS),
  trans = vec3(-LEG_SEPARATION, ROBOT_HEIGHT_LEGS / 2, 0),
  mat = MAT_ROBOT,
);

let leg2 = new Cilindro(
  faces = 5,
  scale = vec3(LEG_RADIUS, ROBOT_HEIGHT_LEGS, LEG_RADIUS),
  trans = vec3(LEG_SEPARATION, ROBOT_HEIGHT_LEGS / 2, 0),
  mat = MAT_ROBOT,
);

let arm1 = new Cilindro(
  faces = 5,
  scale = vec3(ARMS_RADIUS, ROBOT_HEIGHT_LEGS, ARMS_RADIUS),
  trans = vec3(CORPO_RADIUS / 2 + ARMS_RADIUS / 2, ARMS_HEIGHT * ROBOT_HEIGHT_CORPO + ROBOT_HEIGHT_LEGS, 0),
  mat = MAT_ROBOT,
);

// Arms of the robot
let arm2 = new Cilindro(
  faces = 5,
  scale = vec3(ARMS_RADIUS, ROBOT_HEIGHT_LEGS, ARMS_RADIUS),
  trans = vec3(-CORPO_RADIUS / 2 - ARMS_RADIUS / 2, ARMS_HEIGHT * ROBOT_HEIGHT_CORPO + ROBOT_HEIGHT_LEGS, 0),
  mat = MAT_ROBOT,
);

// Antenna
let antena = new Cilindro(
  faces = 5,
  scale = vec3(ANTENA_RADIUS, ANTENA_HEIGHT, ANTENA_RADIUS),
  trans = vec3(0, ROBOT_HEIGHT_HEAD + ROBOT_HEIGHT_CORPO + ROBOT_HEIGHT_LEGS + ANTENA_HEIGHT / 2, 0),
  mat = MAT_ROBOT,
);

const ROBOT = [corpo, head, leg1, leg2, arm1, arm2, antena];

for (const part of ROBOT) {
  part.id = "robot"
  part.isJumping = false;
}

// creating functions and pushing to gObjetos
function createObjects() {
  gObjetos.push(floor);
  gObjetos.push(sun);

  for (const part of ROBOT) {
    gObjetos.push(part);
  }

  generateGrid() // Creating houses
  settingCars() // Creating cars
}
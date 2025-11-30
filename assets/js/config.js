// Light source properties
const LUZ = {
  pos: vec4(50.0, 100.0, 50.0, 1.0), // position
  amb: vec4(0.5, 0.5, 0.5, 1.0), // ambient
  dif: vec4(1.0, 1.0, 1.0, 1.0), // diffuse
  esp: vec4(1.0, 1.0, 1.0, 1.0), // specular
};

// Material properties
var MAT = {
  amb: vec4(0.0, 0.0, 0.8, 1.0),
  dif: vec4(1.0, 1.0, 1.0, 1.0),
  alfa: 50.0,    // shininess
};

const MAT_ESFERA = {
  amb: vec4(0.8, 0.8, 0.8, 1.0),
  dif: vec4(1.0, 0.0, 1.0, 1.0),
  alfa: 50.0,    // shininess
};

// Camera
const FOVY = 100;
const ASPECT = 1;
const NEAR = 0.1;
const FAR = 500;

// ==================================================================
// global constants

const FUNDO = [0.0, 0.0, 0.0, 1.0];
const EIXO_X_IND = 0;
const EIXO_Y_IND = 1;
const EIXO_Z_IND = 2;
const EIXO_X = vec3(1, 0, 0);
const EIXO_Y = vec3(0, 1, 0);
const EIXO_Z = vec3(0, 0, 1);

const COR_ESFERA = vec4(0.1, 0, 0, 1.0);
// ==================================================================
// global variables

// ==================================================================
/* Robot
*/

const MAT_ROBOT = {
  amb: vec4(0.1, 0.1, 0.1, 1.0),
  dif: vec4(0.8, 0.8, 0.8, 1.0),
  spec: vec4(0.9, 0.9, 0.9, 1.0),
  alfa: 50.0,    // shininess
}
const ROBOT_HEIGHT = 1.8; // height of the robot body
const ROBOT_HEIGHT_HEAD = (1.5/8)*ROBOT_HEIGHT; // height of the robot head
const ROBOT_HEIGHT_CORPO = (3.5/8)*ROBOT_HEIGHT; // height of the robot head
const ROBOT_HEIGHT_LEGS = (3/8)*ROBOT_HEIGHT; // height of the robot head
const CORPO_RADIUS = 0.5; // radius of the body

const HEAD_RADIUS = 0.25; // radius of the head

const LEG_RADIUS = 0.15; // radius of the legs
const LEG_SEPARATION = 0.12; // separation between the legs


const ARMS_SEPARATION = 0.25; // separation between the arms
const ARMS_LENGTH = 0.5; // length of the arms
const ARMS_RADIUS = 0.15; // radius of the arms
const ARMS_HEIGHT = 0.5; // height of the arms

const ANTENA_RADIUS = 0.05; // radius of the antenna
const ANTENA_HEIGHT = 0.2; // height of the antenna

// ==================================================================
/* Houses
*/
// Parameters for the grid of house blocks
const GRID_ROWS = 4;
const GRID_COLS = 4;
const BLOCK_WIDTH = 15;    // Width of each block region (meters)
const BLOCK_LENGTH = 20;  // Length of each block region (meters)
const STREET_WIDTH = 20;   // Distance between blocks (meters)
const TOTAL_BLOCK_WIDTH = GRID_COLS*BLOCK_WIDTH + (GRID_COLS-1)*STREET_WIDTH;  
const TOTAL_BLOCK_LENGTH = GRID_ROWS*BLOCK_LENGTH + (GRID_ROWS-1)*STREET_WIDTH; 

const MIN_NO_ANDARES = 1;
const MAX_NO_ANDARES = 5;
const ALTURA_ANDAR = 2.5; // meters
const LARGURA_CASA = 6;    // width of a house (meters)
const LARGO_CASA = 8;      // length of a house (meters)
const NO_CASAS_LINEAS = 4; // houses per row in a block

// ==================================================================
/* Floor
*/
let scale_floor = 1000;
var MAT_FLOOR = {
  amb: vec4(0.1, 0.1, 0.1, 1.0),
  dif: vec4(1.0, 1.0, 1.0, 1.0),
  alfa: 50.0,    // shininess
};

// ==================================================================
/* sun
*/
const sizeSun = 10;


// ==================================================================
/* Cars
*/
const NO_CARROS = 10; // number of cars
const STREET_MARGIN = 1; // margin from the edge of the street
const CAR_SPACING = 20; // minimum space between cars
const CAR_SPEED = 0.5; // minimum/maximum car velocity
// Dynamically generate street positions between blocks
let streetPositions = [];
// Vertical streets (along Z, between columns)


// ==================================================================
/* Auxiliary functions
*/
function randomRange(min=0, max=1) {
  return Math.random() * (max - min) + min;
}

function sorteie_corRGB() {
  let r = randomRange(0, 1);
  let g = randomRange(0, 1);
  let b = randomRange(0, 1);
  return `rgb( ${r}, ${g}, ${b} )`;
}

function randomCor() {
  let r = randomRange(0, 1);
  let g = randomRange(0, 1);
  let b = randomRange(0, 1);
  return vec4(r,g,b,1);
}

function RandomMat(random_amb = false) {
  let amb;
  if (random_amb) amb = randomCor();
  else amb = vec4(1.0, 1.0, 1.0, 1.0)
  
  return {
    amb: amb,
    dif: vec4(1.0, 1.0, 1.0, 1.0),
    alfa: randomRange(10, 500), // shininess
  };
}
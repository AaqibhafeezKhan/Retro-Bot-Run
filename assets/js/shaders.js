// ========================================================
// GLSL Shader Source Code
// The first line must contain "#version 300 es" for WebGL 2.0

var gVertexShaderSrc = `#version 300 es

in vec4 aPosition;
in vec3 aNormal;
in vec2 aTexCoord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uPerspective;
uniform mat4 uInverseTranspose;

uniform vec4 uLuzPos;

out vec3 vNormal;
out vec3 vLight;
out vec3 vView;
out vec2 vTexCoord;

void main() {
    mat4 modelView = uView * uModel;
    gl_Position = uPerspective * modelView * aPosition;

    // Orient normals as seen by the camera
    vNormal = mat3(uInverseTranspose) * aNormal;
    vec4 pos = modelView * aPosition;

    // Light vector from the fragment position to the light source
    vLight = (uView * uLuzPos - pos).xyz;
    // View vector from the fragment position to the camera (viewing position)
    vView = -(pos.xyz);

    vTexCoord = aTexCoord;  
}
`;

var gFragmentShaderSrc = `#version 300 es

precision highp float;

in vec3 vNormal;
in vec3 vLight;
in vec3 vView;
in vec2 vTexCoord;

out vec4 corSaida;

// Color = light * material
uniform vec4 uCorAmbiente;
uniform vec4 uCorDifusao;
uniform vec4 uCorEspecular;
uniform float uAlfaEsp; // Shininess exponent
uniform sampler2D uTextureMap;


void main() {
    vec3 normalV = normalize(vNormal);
    vec3 lightV = normalize(vLight);
    vec3 viewV = normalize(vView);
    vec3 halfV = normalize(lightV + viewV);
    
    // Diffuse component (Lambertian reflection)
    float kd = max(0.0, dot(normalV, lightV) );
    vec4 difusao = kd * uCorDifusao;

    // Specular component (Blinn-Phong reflection)
    float ks = pow( max(0.0, dot(normalV, halfV)), uAlfaEsp);
    
    vec4 especular = vec4(0, 0, 0, 1); // Unlit part
    if (kd > 0.0) {  // Lit part
        especular = ks * uCorEspecular;
    }

    // Final color (Ambient + Diffuse + Specular)
    corSaida = difusao + especular + uCorAmbiente;    
    corSaida.a = 1.0;
    
    // Apply texture color
    corSaida = texture(uTextureMap, vTexCoord) * corSaida;
    
}
`;
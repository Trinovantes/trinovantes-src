#version 300 es

in vec3 vertex_modelspace;
in vec3 normal_modelspace;

uniform mat4 modelMatrix;
uniform mat4 modelNormalMatrix;
uniform mat4 mvpMatrix;

out vec3 vertex_worldspace;
out vec3 normal_worldspace;

void main() {
    vertex_worldspace = (modelMatrix * vec4(vertex_modelspace, 1.0)).xyz;
    normal_worldspace = normalize(modelNormalMatrix * vec4(normal_modelspace, 0.0)).xyz;

    gl_Position = mvpMatrix * vec4(vertex_modelspace, 1.0);;
}

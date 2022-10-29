#version 300 es
precision mediump float;

in vec3 vertex_worldspace;
in vec3 normal_worldspace;

uniform vec3 cameraPos_worldspace;
uniform vec3 lightPos_worldspace;

struct Material {
    // Color values
    vec3 ia; // ambiant
    vec3 id; // diffuse
    vec3 is; // specular

    // Material strengths
    float ka;
    float kd;
    float ks;
    float shininess;
};
uniform Material material;

out vec4 finalColor;

void main()
{
    vec3 cameraDir_worldspace = normalize(cameraPos_worldspace - vertex_worldspace);
    vec3 lightDir_worldspace = normalize(lightPos_worldspace - vertex_worldspace);
    vec3 reflection_worldspace = normalize(reflect(-lightDir_worldspace, normal_worldspace));

    float cosNormalLight = clamp(dot(normal_worldspace, lightDir_worldspace), 0.0, 1.0);
    float cosReflectionCamera = clamp(dot(cameraDir_worldspace, reflection_worldspace), 0.1, 0.9);

    vec3 ambiant  = material.ka * material.ia;
    vec3 diffuse  = material.kd * material.id * cosNormalLight;
    vec3 specular = material.ks * material.is * pow(cosReflectionCamera, material.shininess);
    vec3 phongTotal = ambiant + diffuse + specular;

    finalColor = vec4(phongTotal, 1.0);
}

<script lang="ts" setup>
import TetrisGame from './TetrisGame.vue'

const TITLE = 'Tetris in WebGL'
const CREATED_AT = new Date('2022-11-01').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            I'm currently experiencing bit of burnout from developing my indie game in Unreal Engine.
            Rather than just continuing my marathon and risk total burnout,
            I decided to go back to my roots and look at some of my past projects.
        </p>

        <p>
            One of the games I've made back in my undergrad was a Tetris game implemented in OpenGL.
            Since I've been doing a lot of web development on the side, I figured I should try to rebuild that project in WebGL.
        </p>

        <p>
            The conversion was surprisingly straightforward:
        </p>
        <ul>
            <li>
                The game state logic, previously written in C++, was rewritten to TypeScript
            </li>
            <li>
                The GUI and event handlers, previously handled by Qt, were converted into Vue.js
            </li>
            <li>
                The shaders were reused as-is because WebGL is essentially just a wrapper around OpenGL
            </li>
        </ul>

        <p>
            I was pleasantly surprised that the only change needed was updating the <a href="https://en.wikipedia.org/wiki/Vertex_buffer_object">Vertex Buffer Objects (VBO)</a> API calls from OpenGL 1.4 to OpenGL 3.0 ES.
        </p>

        <p>
            Overall, this was a fun experience and made me remember why I decided to pursue my indie game development journey in the first place.
            However, managing the direct GPU calls was a pain in the ass and I don't mind not ever having to deal with it again in modern game engines.
        </p>

        <TetrisGame />
    </BlogPost>
</template>

<script lang="ts" setup>
const TITLE = 'I Built a reStructuredText Compiler in TypeScript'
const CREATED_AT = new Date('2024-07-07').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            Over the last couple of months, I spent my free time building a reStructuredText (RST) to Markdown compiler (<code><a href="https://trinovantes.github.io/rst-compiler/">rst-compiler</a></code>) in TypeScript.
            As it turns out, it is also the world's first feature-complete pure-JavaScript RST compiler publicly available on NPM.
        </p>

        <p>
            For those confused: reStructuredText is implemented in <code>docutils</code> in Python, so it's generally not used in the JS ecosystem.
        </p>

        <TextHeading>
            Why?
        </TextHeading>

        <p>
            Mostly for fun because I enjoy writing parsers and compilers.
        </p>

        <SimpleImage
            :img="require('./img/doubt.png')"
            :enable-zoom="false"
        >
            Who just wakes up and decides to write a compiler?
        </SimpleImage>

        <p>
            Okay, the real reason was because I wanted to read the <a href="https://docs.godotengine.org/en/stable/index.html">Godot documentation</a> (written in RST) in VitePress because I hated their Sphinx theme:
            the sidebar navigation constantly shifts around as I click on different links, making it difficult to keep track of where I am.
        </p>

        <p>
            Since VitePress only supports Markdown inputs, I realized there were two possible solutions:
        </p>

        <ol>
            <li>
                Use VitePress' <a href="https://vitepress.dev/guide/routing#dynamic-routes">dynamic routes</a> and convert each RST file into Markdown on the fly inside Node.
                However, there were two problems with this approach:

                <ul>
                    <li>
                        Calling Sphinx or PandaDoc inside Node either though a subshell or Pyodide was incredibly slow
                    </li>
                    <li>
                        Using JS-based RST compilers was not possible because all of them were incomplete and were not actually able to parse non-trivial documents
                    </li>
                </ul>
            </li>
            <li>
                Use Sphinx or PandaDoc in standalone Python scripts to convert each RST file into Markdown file and point VitePress at the converted files instead.
            </li>
        </ol>

        <p>
            Since the first option was not feasible, I went with the second option.
            However, after tinkering around for a while, I realized that the Sphinx output files needed so much post-processing before they can be ingested by VitePress that I was essentially just creating a Sphinx-output to Markdown compiler.
            As a result, I decided it would be better to just create my own RST to Markdown compiler to bypass Sphinx as an unnecessary middleman.
        </p>

        <div class="callout positive">
            <p>
                You can see my VitePress rendered Godot documentation here: <br>
                <a href="https://trinovantes.github.io/godot-docs/">trinovantes.github.io/godot-docs/</a>
            </p>
        </div>

        <p>
            You might also be wondering why did I not just port the VitePress theme to Sphinx or literally use any other Sphinx theme?
            Uh&hellip; let's just ignore this plot hole.
        </p>
    </BlogPost>
</template>

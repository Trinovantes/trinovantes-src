<script lang="ts" setup>
const TITLE = 'My TypeScript Projects are Finally Free from Third Party Loaders'
const CREATED_AT = new Date('2025-11-02').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            I don't follow the latest trends in the JavaScript ecosystem so imagine my surprise while I was upgrading my projects dependencies,
            I learned that the latest Node LTS version can now execute native TypeScript code <strong>without</strong> precompiling to JavaScript or using third-party loaders like <code>tsx</code> or <code>ts-node</code>.
        </p>

        <CodeBlock
            language="bash"
            :code="require('./raw/basic.sh')"
        />

        <p>
            Under the hood, Node is simply stripping away the TypeScript syntax and is not actually compiling the code;
            therefore, I could not use any features that result in runtime code.
        </p>

        <div class="callout info">
            <p>
                It's a good idea to enable <code>"erasableSyntaxOnly": true</code> in your tsconfig so your IDE will warn you if you tried using any features that results in runtime code
            </p>
        </div>

        <p>
            This blog post documents some of the caveats that I found while refactoring my projects to be executable with Node.
        </p>

        <TextHeading>
            No Enums
        </TextHeading>

        <p>
            Unfortunately enums, although useful in many other languages, are not part of JavaScript and thus TypeScript has to generate runtime code to enumulate it.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/enum.ts')"
        />

        <p>
            As a result, I had to refactor all of my enum usage into one of the following workarounds:
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/enum-workaround-1.ts')"
        />

        <CodeBlock
            language="ts"
            :code="require('./raw/enum-workaround-2.ts')"
        />

        <TextHeading>
            No Parameter Properties
        </TextHeading>

        <p>
            This is a nice shortcut when writing classes but there's not much to say other than I had to manually rewrite my classes to be slightly more verbose.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/parameter-property.ts')"
        />

        <TextHeading>
            No Path Aliasing
        </TextHeading>

        <p>
            You'd think that Node would try to use my local tsconfig to resolve path aliases but alas it's not possible.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/path-alias.ts')"
        />

        <p>
            The simplest solution is to just rewrite all of my imports to use relative paths and not use any aliasing.
            However it's also possible to customize how Node resolves modules thanks to Node's <code>registerHooks</code> function.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/path-alias-preload.ts')"
        />

        <p>
            Then I can execute my code using this shell command:
        </p>

        <CodeBlock
            language="bash"
            :code="require('./raw/preload.sh')"
        />

        <TextHeading>
            Imports Must Include File Extensions
        </TextHeading>

        <p>
            There's also not much to say about this rule other than I had to rewrite all of my TypeScript imports to include the <code>.ts</code> file extension.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/import-extension.ts')"
        />

        <div class="callout info">
            <p>
                It's a good idea to enable <code>"rewriteRelativeImportExtensions": true</code> in your tsconfig so your IDE will warn you if you are missing the file extension
            </p>
        </div>

        <TextHeading>
            Executing Compiled Code in Electron Projects
        </TextHeading>

        <p>
            In Electron projects with compiled code (e.g. database drivers), the binaries will be compiled against the Node version inside Electron instead of the system's Node version.
            As a result, callers to the compiled code will also need to be executed using <code>electron</code> instead of <code>node</code> (assuming Electron is also using Node 22.18 or later):
        </p>

        <CodeBlock
            language="bash"
            :code="require('./raw/electron.sh')"
        />

        <TextHeading>
            Custom Import Loader
        </TextHeading>

        <p>
            Before migrating my projects to use Node as my TypeScript executor, I was using Bun.js.
            One of its non-standard features that I made extensive use of was custom import loaders.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/loader.ts')"
        />

        <p>
            Obviously the above code will not be able to run inside Node.
            Thankfully, I can again use Node's <code>registerHooks</code> function to customize how this "module" is resolved.
        </p>

        <CodeBlock
            language="ts"
            :code="require('./raw/loader-preload.ts')"
        />
    </BlogPost>
</template>

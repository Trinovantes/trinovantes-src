<script lang="ts" setup>
const TITLE = 'Docker HEALTHCHECK Does Not Actually Do Anything without an Orchestrator'
const CREATED_AT = new Date('2024-07-31').getTime()

const healthcheckCode = `
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl –fail localhost:80/ping || exit 1
`.trim()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            I was setting up a Docker image for a web server the other day when I discovered Docker has a <code>HEALTHCHECK</code> instruction.
            From a cursory glance, it seems like a straightforward way to monitor if my container is still running properly even if the main process hasn't terminated yet (e.g. not stuck in an infinite loop):
        </p>

        <CodeBlock
            :code="healthcheckCode"
            language="docker"
            :popout="true"
        />

        <p>
            I intuitively expected Docker to kill and restart the container if it's unhealthy.
            However, to my disappointment, Docker doesn't do anything if the command fails. It simply marks the container as "unhealthy" and nothing else.
        </p>

        <SimpleImage
            :img="require('./img/docker-ps.png')"
        >
            Okay, now what?
        </SimpleImage>

        <p>
            It turns out that you would need something else like Kubernetes or Docker Swarm if you want automatic container restarts.
            I think this is a bad separation of concerns considering that Docker already restarts containers when the main process fails.
            Why not just add a flag that treats unhealthy containers as failed containers thus can make use of the built-in restart policies?
        </p>

        <p>
            Since full-blown orchestrators are complete overkill for my use-case as I only needed to run a single container on a single machine, I decided to create a very basic Python script to use the Docker REST API to monitor my other containers:
        </p>

        <CodeBlock
            :code="require('./raw/autoheal.py')"
            language="py"
            :popout="true"
        />

        <p>
            I then put this Python script inside its own container and mount the Docker socket inside of it:
        </p>

        <div class="grid-2 popout">
            <CodeBlock
                :code="require('./raw/autoheal.Dockerfile')"
                language="docker"
            />
            <CodeBlock
                :code="require('./raw/autoheal.sh')"
                language="sh"
            />
        </div>

        <p>
            Overall, this was a frustrating experience of discovering something that intuitively should exist but doesn't for whatever reason.
        </p>
    </BlogPost>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const stateName = ref<string>('Example')

const index = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require('./raw/store/index') as string
    return raw.replace(/Example/g, stateName.value)
})

const mutations = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require('./raw/store/mutations') as string
    return raw.replace(/Example/g, stateName.value)
})

const actions = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require('./raw/store/actions') as string
    return raw.replace(/Example/g, stateName.value)
})

const getters = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const raw = require('./raw/store/getters') as string
    return raw.replace(/Example/g, stateName.value)
})
</script>

<template>
    <div class="border-box flex-vgap">
        <label for="stateName">
            State Name
            <input
                id="stateName"
                v-model.trim="stateName"
                type="text"
                placeholder="Example"
            >
        </label>

        <h2>
            <code>{{ stateName }}/index.ts</code>
        </h2>
        <CodeBlock
            :code="index"
            language="ts"
        />

        <h2>
            <code>{{ stateName }}/mutations.ts</code>
        </h2>
        <CodeBlock
            :code="mutations"
            language="ts"
        />

        <h2>
            <code>{{ stateName }}/actions.ts</code>
        </h2>
        <CodeBlock
            :code="actions"
            language="ts"
        />

        <h2>
            <code>{{ stateName }}/getters.ts</code>
        </h2>
        <CodeBlock
            :code="getters"
            language="ts"
        />
    </div>
</template>

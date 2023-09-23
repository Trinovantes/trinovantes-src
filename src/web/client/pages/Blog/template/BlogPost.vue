<script lang="ts">
import { defineComponent } from 'vue'

export const TITLE = ''
export const CREATED_AT = new Date('1970-01-01').getTime()

export default defineComponent({
    setup() {
        return {
            TITLE,
            CREATED_AT,
        }
    },
})
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <!--  -->
    </BlogPost>
</template>

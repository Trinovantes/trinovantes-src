<script lang="ts">
import dayjs from 'dayjs'
import { defineComponent } from 'vue'

export const TITLE = ''
export const CREATED_AT = dayjs.utc('1970-01-01').unix()

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

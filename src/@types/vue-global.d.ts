import ClientOnly from '@/web/components/ClientOnly.vue'
import CodeBlock from '@/web/components/CodeBlock.vue'
import SimpleImage from '@/web/components/SimpleImage.vue'
import SimpleTable from '@/web/components/SimpleTable.vue'
import TextHeading from '@/web/components/TextHeading.vue'
import BlogPost from '@/web/pages/Blog/BlogPost.vue'

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        ClientOnly: typeof ClientOnly
        SimpleImage: typeof SimpleImage
        SimpleTable: typeof SimpleTable
        CodeBlock: typeof CodeBlock
        BlogPost: typeof BlogPost
        TextHeading: typeof TextHeading
    }
}

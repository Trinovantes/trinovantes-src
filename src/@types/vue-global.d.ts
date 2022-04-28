import BlogPost from '@/web/components/Global/BlogPost.vue'
import ClientOnly from '@/web/components/Global/ClientOnly.vue'
import CodeBlock from '@/web/components/Global/CodeBlock.vue'
import SimpleImage from '@/web/components/Global/SimpleImage.vue'
import SimpleTable from '@/web/components/Global/SimpleTable.vue'
import TextHeading from '@/web/components/Global/TextHeading.vue'

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

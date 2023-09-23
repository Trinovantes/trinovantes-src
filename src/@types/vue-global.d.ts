import CodeBlock from '@/web/client/components/CodeBlock.vue'
import SimpleImage from '@/web/client/components/SimpleImage.vue'
import SimpleTable from '@/web/client/components/SimpleTable.vue'
import TextHeading from '@/web/client/components/TextHeading.vue'
import BlogPost from '@/web/client/pages/Blog/BlogPost.vue'

declare module '@vue/runtime-core' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface GlobalComponents {
        SimpleImage: typeof SimpleImage
        SimpleTable: typeof SimpleTable
        CodeBlock: typeof CodeBlock
        TextHeading: typeof TextHeading
        BlogPost: typeof BlogPost
    }
}

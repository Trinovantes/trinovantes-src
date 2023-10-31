import CodeBlock from '@/web/client/components/CodeBlock.vue'
import MathBlock from '@/web/client/components/MathBlock.vue'
import MathInline from '@/web/client/components/MathInline.vue'
import SimpleImage from '@/web/client/components/SimpleImage.vue'
import SimpleTable from '@/web/client/components/SimpleTable.vue'
import TextHeading from '@/web/client/components/TextHeading.vue'
import BlogPost from '@/web/client/pages/Blog/BlogPost.vue'

declare module '@vue/runtime-core' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface GlobalComponents {
        SimpleImage: typeof SimpleImage
        SimpleTable: typeof SimpleTable
        MathBlock: typeof MathBlock
        MathInline: typeof MathInline
        CodeBlock: typeof CodeBlock
        TextHeading: typeof TextHeading
        BlogPost: typeof BlogPost
    }
}

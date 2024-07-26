import type CodeBlock from '@/web/client/components/CodeBlock.vue'
import type MathBlock from '@/web/client/components/MathBlock.vue'
import type MathInline from '@/web/client/components/MathInline.vue'
import type SimpleImage from '@/web/client/components/SimpleImage.vue'
import type SimpleTable from '@/web/client/components/SimpleTable.vue'
import type TextHeading from '@/web/client/components/TextHeading.vue'
import type BlogPost from '@/web/client/pages/Blog/BlogPost.vue'

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

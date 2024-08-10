<script lang="ts" setup>
import { Project } from '@/common/Project'
import { formatUrl } from '@/common/utils/formatUrl'
import { getRepoUrl } from '@/common/utils/getRepoUrl'

withDefaults(defineProps<{
    projects: Array<Project>
    enablePreview?: boolean
    enableTech?: boolean
}>(), {
    enablePreview: true,
    enableTech: true,
})
</script>

<template>
    <section class="flex-vgap category">
        <slot />

        <div
            v-for="project of projects"
            :key="project.name"
            :class="{
                project: true,
            }"
        >
            <div
                v-if="enablePreview"
                class="preview"
            >
                <img
                    v-if="project.img"
                    :srcset="`
                        ${project.img.small} 320w,
                        ${project.img.medium} 640w,
                        ${project.img.original} 1280w`"
                    :sizes="`
                        (max-width: 640px) 640px,
                        (max-width: 1280px) 1280px,
                        320px
                    `"
                    :src="project.img.original"
                    :title="project.name"
                    loading="lazy"
                >
            </div>

            <div class="desc flex-vgap">
                <TextHeading :size="2">
                    {{ project.name }}
                </TextHeading>

                <div class="links flex-vgap">
                    <a
                        v-if="project.url"
                        :href="project.url"
                        :title="project.url"
                        target="_blank"
                        rel="noopener"
                    >
                        <SvgIcon
                            v-if="project.url.includes('npmjs.com/package')"
                            name="npm"
                        />
                        <SvgIcon
                            v-else
                            name="open"
                        />
                        {{ formatUrl(project.url) }}
                    </a>

                    <a
                        v-if="project.slug && !project.isPrivate"
                        :href="getRepoUrl(project.slug)"
                        :title="getRepoUrl(project.slug)"
                        target="_blank"
                        rel="noopener"
                    >
                        <SvgIcon name="github" />
                        GitHub
                    </a>
                </div>

                <p>
                    {{ project.desc }}
                </p>

                <div
                    v-if="enableTech && project.tech.length > 0"
                    class="tech"
                >
                    <span
                        v-for="tech of project.tech"
                        :key="tech"
                    >
                        {{ tech }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
section.category{
    gap: $hspace * 2;

    div.project{
        display: grid;
        gap: $hspace;

        &:has(.preview) {
            grid-template-columns: (100% - math.div(1, $ratio) * 100%) 1fr;

            @media (max-width: $mobile-breakpoint) {
                gap: $padding * 2;
                grid-template-columns: 1fr;
            }

            .preview{
                img{
                    border: math.div($padding, 2) solid $dark;
                    display: block;
                    width: 100%;
                    min-height: math.div(1, $ratio) * 100%;
                    object-fit: cover;
                    object-position: center;
                }
            }
        }

        .desc{
            gap: $padding;

            h2{
                font-size: 2rem;
                line-height: 1;
            }

            p{
                line-height: $padding * 2;
            }

            .links{
                font-size: 1rem;
                gap: math.div($padding, 2);

                a{
                    align-items: center;
                    display: flex;
                    gap: math.div($padding, 2);
                    line-height: $icon-size;

                    .icon{
                        align-items: center;
                        display: flex;

                        :deep(svg){
                            width: $icon-size;
                            height: $icon-size;
                        }
                    }
                }
            }

            .tech{
                display: flex;
                flex-wrap: wrap;
                gap: math.div($padding, 2) $padding;

                span{
                    color: lighten($dark, 30%);
                    font-size: 1rem;
                }
            }
        }
    }
}
</style>

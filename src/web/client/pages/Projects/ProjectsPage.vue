<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import { projects as unhydratedProjects } from '@/common/Project'
import { formatUrl } from '@/common/utils/formatUrl'
import { useAppContext } from '@/web/AppContext'
import { getIconSvgRaw } from '@/web/client/utils/ResponsiveLoaderAsset'
import { loadProjects } from './loadProjects'
import { getRepoUrl } from '@/common/utils/getRepoUrl'

const title = 'Projects'
useSeoMeta({
    title,
    description: Object.values(unhydratedProjects)
        .flatMap((projects) => projects.map((project) => project.name))
        .join(', '),
})

const ssrContext = useAppContext()
const projects = await loadProjects(ssrContext)
</script>

<template>
    <article class="container text-container full">
        <section
            v-for="[category, categoryProjects] of Object.entries(projects)"
            :key="category"
            class="flex-vgap category"
        >
            <TextHeading :size="1">
                {{ category }}
            </TextHeading>

            <div
                v-for="project of categoryProjects"
                :key="project.name"
                class="project"
            >
                <div class="preview">
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
                            <template v-if="project.url.includes('npmjs.com/package/')">
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <span class="icon" v-html="getIconSvgRaw('npm')" />
                            </template>
                            <template v-else>
                                <!-- eslint-disable-next-line vue/no-v-html -->
                                <span class="icon" v-html="getIconSvgRaw('open')" />
                            </template>

                            {{ formatUrl(project.url) }}
                        </a>

                        <a
                            v-if="project.slug && !project.isPrivate"
                            :href="getRepoUrl(project.slug)"
                            :title="getRepoUrl(project.slug)"
                            target="_blank"
                            rel="noopener"
                        >
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <span class="icon" v-html="getIconSvgRaw('github')" />

                            GitHub
                        </a>
                    </div>

                    <p>
                        {{ project.desc }}
                    </p>

                    <div class="tech">
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
    </article>
</template>

<style lang="scss" scoped>
article{
    gap: $vspace;

    section.category{
        gap: $hspace * 2;

        div.project{
            display: grid;
            gap: $hspace;
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
                    object-fit: cover;
                    object-position: center;
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
}
</style>

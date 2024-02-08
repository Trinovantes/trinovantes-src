<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import { projects as unhydratedProjects } from '@/common/Project'
import { formatUrl } from '@/common/utils/formatUrl'
import { useAppContext } from '@/web/AppContext'
import { getIconSvgRaw } from '@/web/client/utils/ResponsiveLoaderAsset'
import { loadProjects } from './loadProjects'

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
                    <SimpleImage
                        v-if="project.img"
                        :img="{ src: project.img }"
                        :title="project.name"
                        :enable-zoom="false"
                        :enable-border="false"
                        :aspect-ratio="2"
                        class="preview-img"
                    />
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
                            v-if="project.repoUrl && !project.isPrivate"
                            :href="project.repoUrl"
                            :title="project.repoUrl"
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
                .preview-img{
                    border: math.div($padding, 2) solid $dark;
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

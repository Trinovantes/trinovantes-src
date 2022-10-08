<script lang="ts" setup>
import { useMeta } from 'vue-meta'
import { projects as unhydratedProjects } from '@/common/Project'
import { formatUrl } from '@/common/utils/formatUrl'
import { getIconSvgRaw, getProfilePicture, ResponsiveImage } from '@/web/client/utils/ResponsiveImage'
import { createPageHeadOptions, TwitterCard } from '@/web/client/utils/createPageHeadOptions'
import { loadProjects } from './loadProjects'

const title = 'Projects'
useMeta(createPageHeadOptions({
    title,
    desc: Object.values(unhydratedProjects).flatMap((projects) => projects.map((project) => project.name)).join(', '),
    image: getProfilePicture().src,
    imageSize: TwitterCard.Summary,
}))

const getImage = (fileName: string): ResponsiveImage => {
    if (fileName.startsWith('https')) {
        return {
            src: fileName,
            width: 0,
            height: 0,
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`./img/${fileName}`) as ResponsiveImage
}

const projects = await loadProjects()
</script>

<template>
    <article
        v-for="[category, categoryProjects] of Object.entries(projects)"
        :key="category"
        class="container project-category"
    >
        <TextHeading :size="1">
            {{ category }}
        </TextHeading>

        <section
            v-for="project of categoryProjects"
            :key="project.name"
            class="project"
        >
            <div class="preview">
                <SimpleImage
                    v-if="project.img"
                    :img="getImage(project.img)"
                    :title="project.name"
                    :enable-zoom="false"
                    :enable-border="false"
                />
            </div>

            <div class="desc">
                <TextHeading :size="2">
                    {{ project.name }}
                </TextHeading>

                <div class="links">
                    <a
                        v-if="project.url"
                        :href="project.url"
                        :title="project.url"
                        target="_blank"
                        rel="noopener"
                    >
                        <!-- eslint-disable-next-line vue/no-v-html -->
                        <span class="icon" v-html="getIconSvgRaw('open')" />

                        {{ formatUrl(project.url) }}
                    </a>

                    <a
                        v-if="project.repo && !project.isPrivate"
                        :href="project.repo"
                        :title="project.repo"
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
        </section>
    </article>
</template>

<style lang="scss" scoped>
article.project-category{
    display: flex;
    flex-direction: column;
    gap: $column-gap;
    margin-top: $vspace;
    margin-bottom: $vspace;

    .project{
        display: grid;
        gap: $column-gap;
        grid-template-columns: (100% - $container-width) 1fr;

        @media (max-width: $large-mobile-breakpoint) {
            gap: $padding * 2;
            grid-template-columns: 1fr;
        }

        .preview{
            .simple-image{
                border: math.div($padding, 2) solid $dark;
            }
        }

        .desc{
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: $padding;

            p{
                line-height: $padding * 2;
            }

            .links{
                display: flex;
                flex-direction: column;
                gap: $padding;

                a{
                    $icon-size: $padding * 1.5;

                    align-items: center;
                    display: flex;
                    gap: math.div($padding, 2);
                    line-height: $icon-size;

                    .icon{
                        align-items: center;
                        display: flex;

                        svg{
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

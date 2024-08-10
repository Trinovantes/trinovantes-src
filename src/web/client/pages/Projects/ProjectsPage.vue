<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import { ProjectCategory, projects as unhydratedProjects } from '@/common/Project'
import { useAppContext } from '@/web/AppContext'
import { loadProjects } from './loadProjects'
import CategoryProjectsList from './CategoryProjectsList.vue'

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
        <CategoryProjectsList
            :projects="projects[ProjectCategory.Apps] ?? []"
        >
            <TextHeading :size="1">
                {{ ProjectCategory.Apps }}
            </TextHeading>
        </CategoryProjectsList>

        <CategoryProjectsList
            :projects="projects[ProjectCategory.Userscript] ?? []"
        >
            <TextHeading :size="1">
                {{ ProjectCategory.Userscript }}
            </TextHeading>
        </CategoryProjectsList>

        <CategoryProjectsList
            :projects="projects[ProjectCategory.Node] ?? []"
        >
            <TextHeading :size="1">
                {{ ProjectCategory.Node }}
            </TextHeading>
        </CategoryProjectsList>
    </article>
</template>

<style lang="scss" scoped>
article{
    gap: $vspace;
}
</style>

<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import { projects as unhydratedProjects } from '@/common/Project'
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
            :projects="projects['Apps'] ?? []"
        >
            <TextHeading :size="1">
                Apps
            </TextHeading>
        </CategoryProjectsList>

        <CategoryProjectsList
            :projects="projects['Userscripts'] ?? []"
        >
            <TextHeading :size="1">
                Userscripts
            </TextHeading>
        </CategoryProjectsList>

        <CategoryProjectsList
            :projects="projects['Node Projects'] ?? []"
        >
            <TextHeading :size="1">
                Node Projects
            </TextHeading>
        </CategoryProjectsList>
    </article>
</template>

<style lang="scss" scoped>
article{
    gap: $vspace;
}
</style>

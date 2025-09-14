<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import { loadProjects } from './loadProjects.ts'
import CategoryProjectsList from './CategoryProjectsList.vue'
import { useAppContext } from '../../../AppContext.ts'
import { projects as unhydratedProjects } from '../../../../common/Project.ts'

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

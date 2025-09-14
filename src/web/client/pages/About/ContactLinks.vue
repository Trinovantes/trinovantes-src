<script lang="ts" setup>
import { CONTACTS } from '../../../../common/Constants.ts'
import { slugify } from '../../../../common/utils/slugify.ts'

defineProps<{
    isDark?: boolean
}>()
</script>

<template>
    <div
        :class="{
            contact: true,
            dark: isDark,
        }"
    >
        <div
            v-for="contact of CONTACTS"
            :key="contact.label"
            class="link"
        >
            <SvgIcon
                :name="slugify(contact.service)"
                :is-dark="isDark"
            />

            <a
                :href="contact.url"
                :title="contact.service"
                target="_blank"
                rel="noopener"
            >
                {{ contact.label }}
            </a>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.contact{
    display: flex;
    flex-direction: column;
    gap: $padding;

    &.dark{
        a{
            color: white;
        }
    }

    .link{
        align-items: center;
        display: flex;
        gap: $padding;
        line-height: $icon-size;
    }
}
</style>

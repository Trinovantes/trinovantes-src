<script lang="ts" setup>
import { CONTACTS } from '@/common/Constants'
import { slugify } from '@/common/utils/slugify'
import { getIconSvgRaw } from '@/web/utils/ResponsiveImage'

defineProps({
    isDark: {
        type: Boolean,
        default: false,
    },
})
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
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div :class="`svg-wrapper ${slugify(contact.service)}`" v-html="getIconSvgRaw(slugify(contact.service))" />

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
        $icon-size: $padding * 1.5;

        align-items: center;
        display: flex;
        gap: $padding;
        line-height: $icon-size;

        .svg-wrapper{
            svg{
                width: $icon-size;
                height: $icon-size;
            }
        }
    }
}
</style>

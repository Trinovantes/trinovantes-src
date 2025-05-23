<script lang="ts" setup>
import mangaJson from './manga.json'

const TITLE = 'Manga Plus vs. Shonen Jump vs. Viz'
const CREATED_AT = new Date('2025-05-20').getTime()

const mangaPlusUrl = 'https://mangaplus.shueisha.co.jp/manga_list/ongoing'
const shonenJumpUrl = 'https://www.viz.com/manga-books/shonenjump/section/free-chapters'
const vizUrl = 'https://www.viz.com/manga-books/vizmanga/section/free-chapters'
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            The most iconic manga like One Piece, Dragon Ball, and Bleach, are published in the Japanese Shonen Jump magazine.
            It's not an exaggeration to say that many mangakas dream to be published in Jump.
        </p>

        <p>
            Here in Canada, English translations of Jump manga are available on the <a :href="mangaPlusUrl">Manga Plus app</a>.
            However, I also found a <a :href="shonenJumpUrl">Shonen Jump app</a> and a <a :href="vizUrl">Viz app</a> that both seems to publish similar titles as Manga Plus.
        </p>

        <p>
            From what I understand, Viz is the North American publisher of Shonen Jump manga and is also partially owned by the Japanese publisher Shueisha.
            Now that Shueisha publishes their own English translations on Manga Plus, there seems to be an overlap in titles.
        </p>

        <p>
            Since all three apps have a subscription of varying prices, I decided to scape each of their catalogs to figure out how much they overlap and where to read specific manga.
        </p>

        <div class="callout info">
            <p>
                <strong>TLDR:</strong>
                <br>
                <a :href="mangaPlusUrl">Manga Plus app (by Shueisha)</a> and <a :href="shonenJumpUrl">Shonen Jump app (by Viz)</a> have a lot of overlapping titles but both also have their own unique titles.
                The <a :href="vizUrl">Viz app (by Viz)</a> does not have any overlaps and consists of mainly older titles.
            </p>
        </div>

        <table
            id="manga-catalog"
            class="popout"
        >
            <thead>
                <tr>
                    <td>
                        Manga
                    </td>
                    <td>
                        Manga Plus
                        <br>($6.49)
                    </td>
                    <td>
                        Shonen Jump
                        <br>($3.99)
                    </td>
                    <td>
                        Viz
                        <br>($2.79)
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="manga in mangaJson"
                    :key="manga.slug"
                >
                    <td>
                        {{ manga.title }}
                    </td>
                    <td>
                        <span
                            v-if="manga.isOnMangaPlus"
                            title="Manga Plus"
                        >
                            ✅
                        </span>
                    </td>
                    <td>
                        <span
                            v-if="manga.isOnShonenJump"
                            title="Shonen Jump"
                        >
                            ✅
                        </span>
                    </td>
                    <td>
                        <span
                            v-if="manga.isOnViz"
                            title="Viz"
                        >
                            ✅
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </BlogPost>
</template>

<style lang="scss" scoped>
table#manga-catalog{
    thead{
        background: #fff;
        position: sticky;
        top: 0;

        // Borders do not work with sticky position so we emulate fake borders with 1px box shadow
        box-shadow:
            inset 0 1px 0 $dark,
            inset 0 -1px 0 $dark;

        tr{
            border: none;
        }
    }

    td:not(:first-child){
        text-align: center;
        width: 160px;
    }
}
</style>

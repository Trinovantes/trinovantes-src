<script lang="ts" setup>
const TITLE = 'Using LLM to Automatically Translate Manga'
const CREATED_AT = new Date('2025-04-23').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <p>
            This long weekend I decided to jump into this new Large Language Models (LLM) hype and see for myself what it's all about.
        </p>

        <p>
            Since only the most popular and profitable manga series can get official releases, many obscure but equally entertaining manga will never get licensed in the west.
            One idea that's been in my backburner for the longest time was building a tool to automatically translate these manga for me.
        </p>

        <TextHeading>
            Process
        </TextHeading>

        <p>
            To translate manga, there's generally three steps:
        </p>

        <ul>
            <li>
                Translate the original text
            </li>
            <li>
                Remove the original text (also called "cleaning")
            </li>
            <li>
                Add the translated text back into the same place (also called "typesetting")
            </li>
        </ul>

        <TextHeading :size="3">
            Cleaning
        </TextHeading>

        <p>
            In official translations, this step can be skipped since the artist will have the original manga panels without text available for the overseas publisher.
        </p>

        <p>
            In fan translations, this step is opening the manga panel in Photoshop and tediously using the eraser and pen-brush tool to remove the original text.
        </p>

        <p>
            To automate this process, I decided to use the <a href="https://github.com/VoxelCubes/PanelCleaner">Panel Cleaner</a> tool that I found on GitHub.
            To my surprise, the Docker image it provided worked off the shelf with no configuration needed (I know, Docker working as designed right?).
        </p>

        <p>
            Using Panel Cleaner, I was able to get a mask to cover up the original texts.
            In addition, I used a simple flood fill algorithm to get bounding boxes of where the original texts are located.
        </p>

        <div class="grid-3">
            <SimpleImage :img="require('./img/page-raw.webp')">
                Original (from Nobunaga Concerto Chapter 70)
            </SimpleImage>

            <SimpleImage :img="require('./img/page-mask.webp')">
                Mask output from Panel Cleaner and their bounding boxes
            </SimpleImage>

            <SimpleImage :img="require('./img/page-clean.webp')">
                Combined together results in a clean manga page
            </SimpleImage>
        </div>

        <TextHeading :size="3">
            Translating
        </TextHeading>

        <p>
            This step is where I used LLMs.
            Since Google's Gemini 2.5 was the newest model released at the beginning of this weekend, I decided to use that.
        </p>

        <p>
            Using the bounding boxes from the previous step, I created this prompt:
        </p>

        <CodeBlock
            :code="require('./raw/prompt.txt')"
            language="txt"
        />

        <p>
            The first problem I encountered was that some text was not translated.
            After searching around, I discovered that LLMs (at least Gemini) sees images in 1000x1000 format.
            Once I normalized the bounding box coordinates, I was able to get translations of all the text as now Gemini can see everything.
        </p>

        <p>
            The next problem I encountered was when characters have multiple speech bubbles in the same manga panel (e.g. long speech or thought), the resulting multi-part translation was often disjointed and incoherent.
            After playing around with some settings in Google AI Studio (the online playground), I was able to get it to output much more accurate translations by enabling thinking mode so that it can consider the full panel.
        </p>

        <p>
            Another problem that I encountered was inaccuracies in short, isolated sentences and conversations.
            Since Japanese is a high-context language, the subject is often omitted and thus making pronouns in translations difficult to infer.
        </p>

        <div class="grid-2">
            <SimpleImage :img="require('./img/context-before.webp')">
                This character is talking about getting stronger himself but without the subject in the sentence, it got translated as "you" instead.
            </SimpleImage>
            <SimpleImage :img="require('./img/context-after.webp')">
                By taking into account of the previous page, this translation makes much more sense.
            </SimpleImage>
        </div>

        <p>
            For a native human reader, the gender of pronouns and subject of conversations can be inferred from previous dialogs.
            To mimic this in LLMs, I switched from a one-off text generation request per page to a multi-part chat.
            This allowed Gemini to use context from previous pages to determine the subject of ambiguous sentences.
        </p>

        <p>
            With these three changes, Gemini's translations were actually pretty good.
            However, I found that there's still a few cases where it falls short of human translation:
        </p>

        <ul>
            <li>
                Sentences where pronouns are derived from the context of the overarching story rather than just the previous pages
            </li>
            <li>
                Very short sentences or partial sentences due to characters stuttering in the moment
            </li>
            <li>
                Pop-culture references, wordplay, portmanteaus, onomatopoeias, etc. that are heavily reliant on the Japanese language itself
            </li>
        </ul>

        <p>
            For now, I'll just accept these inaccuracies as it's still "better-than-nothing" as I can still get an idea of the overarching story.
        </p>

        <TextHeading :size="3">
            Typesetting
        </TextHeading>

        <p>
            For this step, I took the simple approach of creating a textbox where each bounding box was and just insert the translated text into each box.
            This worked surprisingly well for most cases.
        </p>

        <p>
            However, manga often have text that "pop" out, rotate, or have other special effects that are hard to automatically detect.
        </p>

        <div class="grid-2">
            <SimpleImage :img="require('./img/nonstandard-dialog.webp')">
                These texts are incredibly dense and resulted in merged bounding boxes
            </SimpleImage>
            <SimpleImage :img="require('./img/nonstandard-dialog-translated.webp')">
                With incorrect bounding boxes, the typesetting is also incorrectly placed
            </SimpleImage>
        </div>

        <p>
            While I think it's possible to fix this bounding box issue by fine-tuning Panel Cleaner and my flood fill algorithm,
            I have decided to hold off on fixing this issue because these text boxes are usually used for comedic effect and rarely used for plot-relevant text.
        </p>

        <TextHeading :size="3">
            Conclusion
        </TextHeading>

        <p>
            Despite the roadblocks I've encountered, I'm still satisfied with what I've built.
            My tool can take in a directory of Japanese manga pages and automatically clean, translate, and typeset all of them in just a few minutes.
        </p>

        <div class="grid-2">
            <SimpleImage :img="require('./img/translated-reference.webp')">
                Reference translation from human-made scanlation
            </SimpleImage>
            <SimpleImage :img="require('./img/translated-automatic.webp')">
                Final output of my automatic translation
            </SimpleImage>
        </div>

        <p>
            In the past, I've been skeptical of machine translations, but I can't deny seeing some side-by-side comparisons that machine translation is getting a lot better nowadays.
            If my weekend project is the worst machine translations can do today, then I look forward to seeing what can be done in the next few years.
        </p>
    </BlogPost>
</template>

<script lang="ts" setup>
const TITLE = "Getting Windows Explorer's Current Directory Sort Order"
const CREATED_AT = new Date('2024-10-17').getTime()
</script>

<template>
    <BlogPost
        :title="TITLE"
        :created-at="CREATED_AT"
    >
        <div class="callout positive">
            <p>
                If you just want the solution, you can skip to the <a href="#solution">bottom</a>.
            </p>
        </div>

        <TextHeading>
            Motivation
        </TextHeading>

        <p>
            When I upgraded from Windows 7 to Windows 10 a few years ago, I noticed Windows Photo Viewer was replaced with the "Photos App".
            Thankfully for backwards compatibility reasons, it still exists in Windows and can be re-enabled by editing the Windows Registry.
        </p>

        <div class="grid-2 popout">
            <SimpleImage
                :img="require('./img/windows-photo-app.png')"
            >
                The new Photos App is way too bloated for me
            </SimpleImage>

            <SimpleImage
                :img="require('./img/windows-photo-viewer.png')"
            >
                I prefer the minimalist UI of the old Windows Photo Viewer
            </SimpleImage>
        </div>

        <p>
            Since Windows Photo Viewer probably hasn't been updated since Windows XP days, it doesn't support modern image formats like <code>webp</code>.
            In the above example, while it can still decode the image, the colours are slightly off.
        </p>

        <p>
            For the past couple of years, this hasn't been a major issue for me but was still an irritating annoyance.
            Last month, I finally decided to build my own Windows Photo Viewer replacement as an excuse to play with new C++23 features.
        </p>

        <p>
            One feature from both Windows Photo Viewer and Photos App that I wanted to implement was the ability to browse through all the images in the same directory as my initial image.
            In addition, the browsing was in the same order as the Explorer window.
        </p>

        <SimpleImage
            :img="require('./img/windows-explorer.png')"
        >
            When I open one of these images I want to be able to navigate to other images sorted by file size
        </SimpleImage>

        <p>
            I initially tried using <code>std::filesystem::directory_iterator</code>; however, the order was not what I expected.
            From my personal observation and this <a href="https://devblogs.microsoft.com/oldnewthing/20140304-00/?p=1603">Raymond Chen blog post</a>, the order appears to be dependant on the underlying filesystem:
        </p>

        <ul>
            <li>
                On <code>NTFS</code>, files are returned in B-tree order which is <em>approximately</em> alphabetical
            </li>
            <li>
                ON <code>FAT32</code>, files are returned in order that they appear on disk i.e. file creation date
            </li>
        </ul>

        <p>
            And thus began my journey to figure out how to obtain the Explorer sort order&hellip;
        </p>

        <TextHeading>
            First Attempt with ChatGPT
        </TextHeading>

        <p>
            A quick Google search led me to the Win32 API <code><a href="https://learn.microsoft.com/en-us/windows/win32/api/shobjidl_core/nf-shobjidl_core-ifolderview2-getsortcolumns">IFolderView2::GetSortColumns</a></code>.
            I initially thought this would be easy as it's just a simple function that returns exactly what I wanted.
            Turns out that couldn't be further from the truth.
        </p>

        <p>
            The first problem was how do I get a Windows object that implements the <code>IFolderView2</code> interface?
            For my first attempt, I tried using ChatGPT to figure out which Win32 API functions to call.
            I was surprised I got code that almost compiled but I still had to fix a few errors.
        </p>

        <CodeBlock
            :code="require('./raw/chatgpt.cpp')"
            language="cpp"
        />

        <p>
            To my disappointment, calling <code>GetSortColumns</code> from this <code>IFolderView2</code> always returned <code>PKEY_ItemNameDisplay</code> i.e. telling me to sort files alphabetically.
            With no additional information on why in the Windows documentation, I decided to mark this approach as a deadend.
        </p>

        <TextHeading>
            Second Attempt with Windows Registry
        </TextHeading>

        <p>
            My next thought was to check the Windows Registry since information about Explorer sort order must be saved somewhere on my computer and the Registry is usually where this kind of data is stored.
        </p>

        <p>
            As it turns out, the Registry does indeed store information about Explorer in what's colloquially known as "ShellBags".
        </p>

        <p>
            Since all the ShellBag data is encoded in binary, it would be a lot of wasted work if it didn't contain the exact information that I wanted.
            Instead I decided to first use a third-party application to inspect my computer's ShellBags before doing it manually.
        </p>

        <SimpleImage
            :img="require('./img/shellbag-explorer.png')"
        />

        <p>
            While ShellBags Explorer didn't reveal the sort order, one key thing that I've noticed was that my desired directory's last registry write time was over a month ago.
            Therefore even if it's possible to get the sort order out of ShellBags, that information would probably be stale and thus this is another deadend.
        </p>

        <TextHeading>
            Third Attempt by Reverse Engineering Windows Photo Viewer
        </TextHeading>

        <p>
            At this point I was pretty frustrated.
            Before I gave up and settle with sorting my file list alphabetically, I decided one last attempt to try and reverse engineer Windows Photo Viewer.
        </p>

        <p>
            I began by opening up <code>PhotoViewer.dll</code> in IDA and looked for Win32 API symbols since this is the same library where <code>IFolderView2::GetSortColumns</code> is from.
        </p>

        <SimpleImage
            :img="require('./img/ida.png')"
        >
            That's an interesting Win32 API symbol!
        </SimpleImage>

        <p>
            One particular symbol that caught my eye was <code><a href="https://learn.microsoft.com/en-us/windows/win32/api/shlobj_core/nf-shlobj_core-shcocreateinstance">SHCoCreateInstance</a></code> (now deprecated in favor of <code><a href="https://learn.microsoft.com/en-us/windows/win32/api/combaseapi/nf-combaseapi-cocreateinstance">CoCreateInstance</a></code>).
            From what I understand from the documentation, this function is used to start a communication bridge with Explorer process itself.
        </p>

        <p>
            This was when it hit me: Windows Photo Viewer and Photos App were probably just communicating directly with the Explorer window process (<code>explorer.exe</code>) when the image is initially opened to get the sort order.
        </p>

        <SimpleImage
            :img="require('./img/multiple-explorer-windows.png')"
        >
            In hindsight, this also makes since if there are two open Explorer windows, both windows' sort order cannot be saved in the same place on my computer &mdash; thus it probably only exists in memory.
        </SimpleImage>

        <TextHeading>
            Solution
        </TextHeading>

        <ol>
            <li>
                At the start of the program (e.g. at the top of <code>main()</code> and before creating own window), get a reference <code>HWND</code> to the computer's current foreground window.
                This should be the Explorer window process containing the image that I just opened i.e. the window that I just double-clicked to open said image.
            </li>
            <li>
                Create a communication bridge with all open Explorer window processes with <code>CoCreateInstance</code>.
            </li>
            <li>
                Iterate over all the windows to find the one with the same handle as the initial window handle recorded in step one.
                In addition, this window should also have the same directory as the image's directory.
            </li>
            <li>
                Starting from the <code>IDispatch</code> interface that the Explorer window implements, query my way down to the <code>IFolderView2</code> interface (thanks ChatGPT).
            </li>
        </ol>

        <CodeBlock
            :code="require('./raw/solution.cpp')"
            language="cpp"
        />

        <p>
            For the sake of brevity, I ommited error checking and garbage collection. However if you wish to use this code, you should also:
        </p>

        <ul>
            <li>
                Check the return codes of each API call to ensure there's no error and you don't have null pointers
            </li>
            <li>
                Clean up the communication bridge with <code>CoUninitialize</code> and every queried interface with <code>Release()</code>
            </li>
        </ul>
    </BlogPost>
</template>

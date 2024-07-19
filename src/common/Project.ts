export const enum Tech {
    // General
    CPP = 'C++',

    // Frontend
    Typescript = 'Typescript',
    VueJs = 'Vue.js',

    // Backend
    NodeJs = 'Node.js',
    ExpressJs = 'Express.js',
    Sqlite = 'SQLite',
    Electron = 'Electron',

    // Devops
    Docker = 'Docker',
}

export const enum ProjectCategory {
    Apps = 'Apps',
    Userscript = 'Userscripts',
    Node = 'Node Projects',
}

export type ProjectImgUrl = {
    original: string
    small: string
    medium: string
}

export type Project = {
    name: string
    slug: string
    isPrivate?: boolean // Do not show repo url on frontend if private
    tech: Array<Tech>

    // Populated from GitHub
    desc?: string
    url?: string
    img?: ProjectImgUrl
}

export type Projects = Partial<Record<ProjectCategory, Array<Project>>>

export const projects: Projects = {
    [ProjectCategory.Apps]: [
        {
            name: 'StarRail Warp Tracker',
            slug: 'starrail-warp-tracker',
            tech: [
                Tech.Typescript,
                Tech.Electron,
                Tech.Sqlite,
                Tech.VueJs,
            ],
        },
        {
            name: 'HoloMemes',
            slug: 'holomemes',
            isPrivate: true,
            tech: [
                Tech.Typescript,
                Tech.NodeJs,
                Tech.Sqlite,
                Tech.ExpressJs,
                Tech.VueJs,
                Tech.Docker,
            ],
        },
        {
            name: 'WoWPay2Win',
            slug: 'wowpay2win',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
                Tech.Docker,
            ],
        },
        {
            name: 'MAL Cover CSS',
            slug: 'mal-cover-css',
            tech: [
                Tech.Typescript,
                Tech.NodeJs,
                Tech.Sqlite,
                Tech.ExpressJs,
                Tech.VueJs,
                Tech.Docker,
            ],
        },
        {
            name: 'Quest Schedule Exporter',
            slug: 'quest-schedule-exporter',
            tech: [
                Tech.Typescript,
            ],
        },
    ],
    [ProjectCategory.Userscript]: [
        {
            name: 'YouTube Playlist Organizer',
            slug: 'userscript-youtube-playlist-organizer',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'Delete Workflow Runs',
            slug: 'userscript-delete-workflow-runs',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'GitHub Repository Categories',
            slug: 'userscript-github-repository-categories',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'WoWProgress Character Page',
            slug: 'userscript-wowprogress-character-page',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'Old Reddit Emotes',
            slug: 'userscript-old-reddit-emotes',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
    ],
    [ProjectCategory.Node]: [
        {
            name: 'rst-compiler',
            slug: 'rst-compiler',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'bbcode-compiler',
            slug: 'bbcode-compiler',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'puppeteer-prerender-plugin',
            slug: 'puppeteer-prerender-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'vue-ssr-assets-plugin',
            slug: 'vue-ssr-assets-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'quasar-unused-plugin',
            slug: 'quasar-unused-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
    ],
}

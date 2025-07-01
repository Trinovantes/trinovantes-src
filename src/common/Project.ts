export type Tech =
    // General
    | 'C++'

    // Frontend
    | 'Typescript'
    | 'Vue.js'

    // Backend
    | 'Node.js'
    | 'Express.js'
    | 'SQLite'
    | 'Electron'

    // Devops
    | 'Docker'

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

export const ALL_PROJECT_CATEGORIES = [
    'Apps',
    'Userscripts',
    'Node Projects',
] as const

export type ProjectCategory = typeof ALL_PROJECT_CATEGORIES[number]
export type Projects = Partial<Record<ProjectCategory, Array<Project>>>

export const projects: Required<Projects> = {
    ['Apps']: [
        {
            name: 'StarRail Warp Tracker',
            slug: 'starrail-warp-tracker',
            tech: [
                'Typescript',
                'Electron',
                'SQLite',
                'Vue.js',
            ],
        },
        {
            name: 'HoloMemes',
            slug: 'holomemes',
            isPrivate: true,
            tech: [
                'Typescript',
                'Node.js',
                'SQLite',
                'Express.js',
                'Vue.js',
                'Docker',
            ],
        },
        {
            name: 'WoWPay2Win',
            slug: 'wowpay2win',
            tech: [
                'Typescript',
                'Vue.js',
                'Docker',
            ],
        },
        {
            name: 'MAL Cover CSS',
            slug: 'mal-cover-css',
            tech: [
                'Typescript',
                'Node.js',
                'SQLite',
                'Express.js',
                'Vue.js',
                'Docker',
            ],
        },
        {
            name: 'Quest Schedule Exporter',
            slug: 'quest-schedule-exporter',
            tech: [
                'Typescript',
            ],
        },
    ],
    ['Userscripts']: [
        {
            name: 'YouTube Playlist Organizer',
            slug: 'userscript-youtube-playlist-organizer',
            tech: [
                'Typescript',
                'Vue.js',
            ],
        },
        {
            name: 'Delete Workflow Runs',
            slug: 'userscript-delete-workflow-runs',
            tech: [
                'Typescript',
                'Vue.js',
            ],
        },
        {
            name: 'GitHub Repository Categories',
            slug: 'userscript-github-repository-categories',
            tech: [
                'Typescript',
                'Vue.js',
            ],
        },
        {
            name: 'WoWProgress Character Page',
            slug: 'userscript-wowprogress-character-page',
            tech: [
                'Typescript',
                'Vue.js',
            ],
        },
        {
            name: 'Old Reddit Emotes',
            slug: 'userscript-old-reddit-emotes',
            tech: [
                'Typescript',
                'Vue.js',
            ],
        },
    ],
    ['Node Projects']: [
        {
            name: 'rst-compiler',
            slug: 'rst-compiler',
            tech: [
                'Typescript',
            ],
        },
        {
            name: 'bbcode-compiler',
            slug: 'bbcode-compiler',
            tech: [
                'Typescript',
            ],
        },
        {
            name: 'puppeteer-prerender-plugin',
            slug: 'puppeteer-prerender-plugin',
            tech: [
                'Typescript',
            ],
        },
        {
            name: 'vue-ssr-assets-plugin',
            slug: 'vue-ssr-assets-plugin',
            tech: [
                'Typescript',
            ],
        },
        {
            name: 'quasar-unused-plugin',
            slug: 'quasar-unused-plugin',
            tech: [
                'Typescript',
            ],
        },
    ],
}

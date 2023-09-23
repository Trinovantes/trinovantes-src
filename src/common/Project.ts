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

    // Devops
    Docker = 'Docker',
    Nginx = 'Nginx',
}

export const enum ProjectCategory {
    Web = 'Web Apps',
    Userscript = 'Userscripts',
    Misc = 'Misc. Projects',
}

export type Project = {
    name: string
    repoUrl: string
    isPrivate?: boolean // Do not show repo url on frontend if private
    tech: Array<Tech>

    // Populated from GitHub
    desc?: string
    url?: string
    img?: string
}

export type Projects = Partial<Record<ProjectCategory, Array<Project>>>

export const projects: Projects = {
    [ProjectCategory.Web]: [
        {
            name: 'HoloMemes',
            repoUrl: 'https://github.com/Trinovantes/HoloMemes',
            img: 'holomemes.jpg',
            isPrivate: true,
            tech: [
                Tech.Typescript,
                Tech.NodeJs,
                Tech.Sqlite,
                Tech.ExpressJs,
                Tech.VueJs,
                Tech.Docker,
                Tech.Nginx,
            ],
        },
        {
            name: 'WoWPay2Win',
            repoUrl: 'https://github.com/Trinovantes/WoWPay2Win',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
                Tech.Docker,
                Tech.Nginx,
            ],
        },
        {
            name: 'MAL Cover CSS',
            repoUrl: 'https://github.com/Trinovantes/MAL-Cover-CSS',
            tech: [
                Tech.Typescript,
                Tech.NodeJs,
                Tech.Sqlite,
                Tech.ExpressJs,
                Tech.VueJs,
                Tech.Docker,
                Tech.Nginx,
            ],
        },
        {
            name: 'Quest Schedule Exporter',
            repoUrl: 'https://github.com/Trinovantes/Quest-Schedule-Exporter',
            tech: [
                Tech.Typescript,
            ],
        },
    ],
    [ProjectCategory.Userscript]: [
        {
            name: 'YouTube Playlist Organizer',
            repoUrl: 'https://github.com/Trinovantes/userscript-youtube-playlist-organizer',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'Delete Workflow Runs',
            repoUrl: 'https://github.com/Trinovantes/userscript-delete-workflow-runs',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'GitHub Repository Categories',
            repoUrl: 'https://github.com/Trinovantes/userscript-github-repository-categories',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'WoWProgress Character Page',
            repoUrl: 'https://github.com/Trinovantes/userscript-wowprogress-character-page',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
        {
            name: 'Old Reddit Emotes',
            repoUrl: 'https://github.com/Trinovantes/userscript-old-reddit-emotes',
            tech: [
                Tech.Typescript,
                Tech.VueJs,
            ],
        },
    ],
    [ProjectCategory.Misc]: [
        {
            name: 'BBCode Compiler',
            repoUrl: 'https://github.com/Trinovantes/bbcode-compiler',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'Puppeteer Prerender Plugin',
            repoUrl: 'https://github.com/Trinovantes/puppeteer-prerender-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'Vue SSR Assets Plugin',
            repoUrl: 'https://github.com/Trinovantes/vue-ssr-assets-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'Quasar Unused Plugin',
            repoUrl: 'https://github.com/Trinovantes/quasar-unused-plugin',
            tech: [
                Tech.Typescript,
            ],
        },
        {
            name: 'capted',
            repoUrl: 'https://github.com/Trinovantes/capted',
            tech: [
                Tech.CPP,
            ],
        },
    ],
}

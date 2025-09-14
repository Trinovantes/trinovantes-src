import './client/assets/css/main.scss'
import { createVueApp } from './createVueApp.ts'
import { createHead } from '@unhead/vue/client'

async function main() {
    console.info('Release', __GIT_HASH__)
    const head = createHead()
    const { app } = await createVueApp(head)
    app.mount('#app')
}

main().catch((err: unknown) => {
    console.error(err)
})

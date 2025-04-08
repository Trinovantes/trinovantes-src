import './client/assets/css/main.scss'
import { createVueApp } from './createVueApp'
import { createHead } from '@unhead/vue/client'

async function main() {
    console.info('Release', DEFINE.GIT_HASH)
    const head = createHead()
    const { app } = await createVueApp(head)
    app.mount('#app')
}

main().catch((err: unknown) => {
    console.error(err)
})

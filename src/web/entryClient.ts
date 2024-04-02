import './client/assets/css/main.scss'
import { createVueApp } from './createVueApp'

async function main() {
    console.info('Release', DEFINE.GIT_HASH)
    const { app } = await createVueApp()
    app.mount('#app')
}

main().catch((err: unknown) => {
    console.error(err)
})

import { createApp } from './app'
import './assets/css/main.scss'

async function main() {
    const { app } = await createApp()
    app.mount('#app')
}

main().catch((err) => {
    console.warn(err)
})

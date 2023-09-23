import './client/assets/css/main.scss'
import { createVueApp } from './createVueApp'

async function main() {
    const { app } = await createVueApp()
    app.mount('#app')
}

main().catch((err) => {
    console.error(err)
})

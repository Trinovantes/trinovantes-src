import './client/assets/css/main.scss'
import { createVueApp } from './createVueApp'

async function main() {
    const { app } = await createVueApp()
    app.mount('#app')
}

window.addEventListener('error', console.warn)
window.addEventListener('unhandledrejection', console.warn)
void main()

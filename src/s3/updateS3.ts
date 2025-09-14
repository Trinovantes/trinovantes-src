import { ImageCache } from './ImageCache.ts'

const imageCache = new ImageCache()
await imageCache.init()
await imageCache.updateProjects()

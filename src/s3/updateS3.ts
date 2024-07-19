import { ImageCache } from './ImageCache'

const imageCache = new ImageCache()
await imageCache.init()
await imageCache.updateProjects()

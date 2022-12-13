import { createRenderer } from '@xiaoyu/runtime-core'

let renderer = null
function ensureRenderer() {
  return renderer || (renderer = createRenderer())
}

export const createApp = (...args) => {
  return ensureRenderer().createApp(...args)
}

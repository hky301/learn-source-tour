import { createAppAPI } from './apiCreateApp'

export function createRenderer() {
  function patch(n1, n2, container) {
    if (n1 === n2)
      return

    const { type, shapeFlag } = n2 // 新的vnode类型和组件类型

    switch (type) {
      case Text:
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {

        }
    }
  }

  function unmount() {

  }

  function render(vnode, container) {
    const preVnode = container._vnode
    if (vnode === null) {
      if (preVnode) {
        // 卸载
        unmount(preVnode, null, container)
      }
    }
    else {
      patch(preVnode, vnode, container)
    }
    container._vnode = vnode
  }

  return {
    createApp: createAppAPI(render),
  }
}

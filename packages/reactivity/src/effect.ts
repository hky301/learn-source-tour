import { COL_KEY } from './reactive'

const targetMap = new WeakMap()

let activeEffect
const effectStack: any[] = []

export function track(obj, type, key) {
  if (!activeEffect)
    return

  let depsMap = targetMap.get(obj)

  if (!depsMap)
    targetMap.set(obj, (depsMap = new Map()))

  let deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, (deps = new Set()))

  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(obj, type, key) {
  const depsMap = targetMap.get(obj)
  if (!depsMap)
    return
  if (type === 'collection-add' || type === 'collection-delete' || type === 'collection-has')
    key = COL_KEY
  const deps = depsMap.get(key)
  if (deps) {
    const depsToRun = new Set(deps)
    depsToRun.forEach(effect => effect())
  }
}

function cleanup(effectFn) {
  // 全部清理，track时重新收集，vue3.2优化 位运算
  for (let i = 0; i < effectFn.deps.length; i++)
    effectFn.deps[i].delete(effectFn)
  effectFn.deps = []
}

export function effect(fn) {
  const effectFn = () => {
    let ret
    try {
      activeEffect = effectFn
      effectStack.push(activeEffect)
      cleanup(effectFn)
      ret = fn()
    }
    finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
    return ret
  }
  effectFn.deps = []
  effectFn()
  return effectFn
}

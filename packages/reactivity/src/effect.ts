import { COL_KEY } from './reactive'

const targetMap = new WeakMap()

let activeEffect
const effectStack = []

export function effect(fn) {
  activeEffect = fn
  effectStack.push(activeEffect)
  fn()
  effectStack.pop()
  activeEffect = effectStack[effectStack.length - 1]
}

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
}

export function trigger(obj, type, key) {
  const depsMap = targetMap.get(obj)
  if (!depsMap)
    return
  if (type === 'collection-add')
    key = COL_KEY
  const deps = depsMap.get(key)
  if (deps)
    deps.forEach(effect => effect())
}

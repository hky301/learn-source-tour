import { isObject } from '@xiaoyu/utils'
import { track, trigger } from './effect'
import { ReactiveFlags, reactive } from './reactive'

function createGetter(isShallow: boolean) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE)
      return true

    // 收集依赖
    const value = Reflect.get(target, key, receiver)
    // const value = obj[key]
    track(target, 'get', key)
    if (isObject(value))
      return isShallow ? value : reactive(value)

    return value
  }
}

function set(target, key, value, receiver) {
  const ret = Reflect.set(target, key, value, receiver)
  // target[key] = value
  // 触发依赖
  trigger(target, 'set', key)
  return ret
}

function deleteProperty(target, key) {
  Reflect.deleteProperty(target, key)
  trigger(target, 'delete', key)
  return true
}

export const baseHandlers = {
  get: createGetter(false),
  set,
  deleteProperty,
  // has
  // ownKeys
}

export const shallowReactiveHandlers = {
  get: createGetter(true),
  set,
  deleteProperty,
}

import { isObject, toRawType } from '@xiaoyu/utils'
import { track, trigger } from './effect'

export const COL_KEY = Symbol('collection')

const enum TargetType {
  INVALID = 0,
  COMMON = 1, // object array
  COLLECTION = 2, // set map (weak)
}

function targetTypeMap(type: string) {
  switch (type) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Set':
    case 'Map':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

const baseHandlers = {
  get(target, key, receiver) {
    // 收集依赖
    const value = Reflect.get(target, key, receiver)
    // const value = obj[key]
    track(target, 'get', key)
    return isObject(value) ? reactive(value) : value
  },
  set(target, key, value, receiver) {
    const ret = Reflect.set(target, key, value, receiver)
    // target[key] = value
    // 触发依赖
    trigger(target, 'set', key)
    return ret
  },
  deleteProperty(target, key) {
    Reflect.deleteProperty(target, key)
    trigger(target, 'delete', key)
    return true
  },
  // has
  // ownKeys
}

const collectionActions = {
  add(key) {
    const target = this.__reactive_raw
    const ret = target.add(key)
    trigger(target, 'collection-add', key)
    return ret
  },
  delete() {

  },
  has() {

  },
}

const collectionHandlers = {
  get(target, key) {
    if (key === '__reactive_raw')
      return target

    if (key === 'size') {
      track(target, 'collection-size', COL_KEY)
      return Reflect.get(target, key)
    }
    return collectionActions[key]
  },
}

export function reactive(obj: any) {
  const handlers = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? baseHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}

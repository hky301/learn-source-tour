import { toRawType } from '@xiaoyu/utils'
import { baseHandlers, shallowReactiveHandlers } from './basehandlers'
import { collectionHandlers } from './collectionHandlers'

export const COL_KEY = Symbol('collection')

const enum TargetType {
  INVALID = 0,
  COMMON = 1, // object array
  COLLECTION = 2, // set map (weak)
}

export const ReactiveFlags = {
  RAW: '__v_raw',
  IS_REACTIVE: '__is_reactive',
}

export function isReactive(val: any) {
  return !!val[ReactiveFlags.IS_REACTIVE]
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

export function shallowReactive(obj: any) {
  const handlers = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? shallowReactiveHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}

export function reactive(obj: any) {
  const handlers = targetTypeMap(toRawType(obj)) === TargetType.COMMON ? baseHandlers : collectionHandlers
  return new Proxy(obj, handlers)
}

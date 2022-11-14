import { isObject } from '@xiaoyu/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'

export function ref(value: any) {
  return new RefImpl(value)
}

class RefImpl {
  private _isRef: boolean
  private _val: any

  constructor(val) {
    this._isRef = true
    this._val = convert(val)
  }

  get value() {
    track(this, 'ref-get', 'value')
    return this._val
  }

  set value(newVal: any) {
    if (newVal !== this._val) {
      this._val = newVal
      trigger(this, 'ref-set', 'value')
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}

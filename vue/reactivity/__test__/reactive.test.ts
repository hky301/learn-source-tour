import { describe, expect, it, vi } from 'vitest'
import { effect, isReactive, isRef, reactive, ref, shallowReactive } from '../src/index'

describe('响应式', () => {
  it('reactive基本功能', () => {
    const obj = reactive({ count: 1 })
    let val
    effect(() => {
      val = obj.count
    })
    expect(val).toBe(1)

    obj.count++

    expect(val).toBe(2)
  })

  it('reactive支持嵌套', () => {
    const obj = reactive({ count: 1, info: { username: 'foo' } })
    let val
    effect(() => {
      val = obj.info.username
    })

    expect(val).toBe('foo')

    obj.info.username = 'vue3'

    expect(val).toBe('vue3')
  })

  it('响应式的清理', () => {
    const obj = reactive({ ok: true, name: 'foo' })

    let val
    const fn = vi.fn(() => {
      val = obj.ok ? obj.name : 'vue3'
    })
    effect(fn)
    expect(val).toBe('foo')
    expect(fn).toBeCalledTimes(1)

    obj.ok = false
    expect(val).toBe('vue3')
    expect(fn).toBeCalledTimes(2)

    obj.name = 'bar'
    expect(fn).toBeCalledTimes(2)
  })

  it('es6 set遍历的缺陷', () => {
    const fn = () => {
      const set = new Set([1])
      let n = 1
      set.forEach((v) => {
        set.delete(1)
        set.add(1)
        n += 1
        if (n > 99)
          throw new Error('死循环')
      })
    }
    expect(() => fn()).toThrowError('死循环')
  })

  it('删除属性', () => {
    const obj = reactive({ name: 'foo', count: 1 })

    let val
    effect(() => {
      val = obj.name
    })

    expect(val).toBe('foo')
    delete obj.name
    expect(val).toBeUndefined()
  })

  it('why reflect', () => {
    const obj = {
      _count: 1,
      get count() {
        return this._count
      },
    }

    const ret = reactive(obj)

    const fn = vi.fn((args) => { })

    effect(() => {
      fn(ret.count)
    })

    expect(fn).toBeCalledTimes(1)
    ret._count++
    expect(fn).toBeCalledTimes(2)
  })

  it('ref', () => {
    const num = ref(1)
    let val
    effect(() => {
      val = num.value
    })
    expect(val).toBe(1)

    num.value++
    expect(val).toBe(2)
  })

  it('ref支持复杂数据类型', () => {
    const num = ref({ count: 1 })
    let val
    effect(() => {
      val = num.value.count
    })
    expect(val).toBe(1)

    num.value.count++
    expect(val).toBe(2)
  })

  it('工具函数', () => {
    const val1 = ref(1)
    const val2 = reactive({ count: 1 })
    const val3 = shallowReactive({ count: 1 })
    expect(isRef(val1)).toBe(true)
    expect(isReactive(val2)).toBe(true)
    expect(isReactive(val3)).toBe(true)
  })
})

describe('浅层响应式', () => {
  it('reactive支持嵌套', () => {
    const obj = shallowReactive({ count: 1, info: { username: 'foo' } })
    let val1
    let val2
    effect(() => {
      val1 = obj.count
    })
    effect(() => {
      val2 = obj.info.username
    })

    expect(val1).toBe(1)
    expect(val2).toBe('foo')

    obj.count++
    obj.info.username = 'vue3'

    expect(val1).toBe(2)
    expect(val2).toBe('foo')
  })
})

describe('支持set/map', () => {
  it('set', () => {
    const set = reactive(new Set([1]))

    let val
    effect(() => {
      val = set.size
    })

    expect(val).toBe(1)
    set.add(2)
    expect(val).toBe(2)
  })

  it('set的删除', () => {
    const set = reactive(new Set([1, 2]))
    let val
    effect(() => {
      val = set.size
    })
    expect(val).toBe(2)
    set.delete(2)
    expect(val).toBe(1)
  })

  it('set的has', () => {
    const set = reactive(new Set([1, 2]))
    expect(set.has(2)).toBe(true)
    set.delete(2)
    expect(set.has(2)).toBe(false)
  })
})

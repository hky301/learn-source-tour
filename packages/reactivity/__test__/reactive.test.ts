import { describe, expect, it, vi } from 'vitest'
import { effect, reactive, ref } from '../src/index'

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
})

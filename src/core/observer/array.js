/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

// 1. 获取数组的原型
const arrayProto = Array.prototype
// 2. 克隆一份(因为不能把数组全给变了，如果直接在数组的原型上(Array.prototype)直接改，那将来所有的数组都被改了，这样是不合理的，只能改想改的，应该改的)
export const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 数组的原始方法
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    // 先执行原始的行为
    const result = original.apply(this, args)
    // 变更通知
    // 1. 如果是响应式对象，先获取ob实例
    const ob = this.__ob__
    // 如果是新增元素的操作：比如push，unshift或者增加元素的splice操作
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    // 新加入的对象仍然需要响应式处理
    if (inserted) ob.observeArray(inserted)
    // notify change
    // 2. 让内部的dep通知更新(如果数组发生了变化，那么就应该让dep去通知和它相关的组件去更新，那些组件是watcher管的，dep就通知那个watcher去更新)
    ob.dep.notify()
    return result
  })
})

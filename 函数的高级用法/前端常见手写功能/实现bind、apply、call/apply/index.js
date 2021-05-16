Function.prototype.myApply = function (context = globalThis) {
    // 关键步骤，在 context 上调用方法，触发 this 绑定为 context，使用 Symbol 防止原有属性的覆盖
    const key = Symbol('key')
    context[key] = this
    let res
    if (arguments[1]) {
      res = context[key](...arguments[1])
    } else {
      res = context[key]()
    }
    delete context[key]
    return res
  }
  

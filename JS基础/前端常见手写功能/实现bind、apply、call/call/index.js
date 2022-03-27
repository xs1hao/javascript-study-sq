Function.prototype.myCall = function (context = globalThis) {
    // 关键步骤，在 context 上调用方法，触发 this 绑定为 context，使用 Symbol 防止原有属性的覆盖
    const key = Symbol('key');
    context[key] = this
    // es5 可通过 for 遍历 arguments 得到参数数组
    const args = [...arguments].slice(1); // 得到 myCall 第一个参数之 后的参数；
    const res = context[key](args);
    delete context[key]; // delete 后 context上的 就不存在 绑定的 this 了；
    return res
  };
  
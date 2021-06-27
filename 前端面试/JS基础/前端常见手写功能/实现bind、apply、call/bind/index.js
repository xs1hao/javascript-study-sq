Function.prototype.myBind = function (context = globalThis) {
	const fn = this
	const args = Array.from(arguments).slice(1)
	const newFunc =  function() {
		const newArgs = args.concat(...arguments)
		if (this instanceof newFunc) {
			// 通过 new 调用，绑定 this 为实例对象
			fn.apply(this, newArgs)
		} else {
			// 通过普通函数形式调用，绑定 context
			fn.apply(context, newArgs)
		}
	}
	// 支持 new 调用方式
    /**
     * Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
     * 语法： Object.create(proto，[propertiesObject])
     * proto：
     *  新创建对象的原型对象。
     * 返回值： 一个新对象，带着指定的原型对象和属性。
     * **/
	newFunc.prototype = Object.create(fn.prototype)
	return newFunc
}

function myNew(Func, ...args) {
	const instance = {};
	if (Func.prototype) {
        /**
         * Object.setPrototypeOf() 方法设置一个指定的对象的原型 ( 即, 内部[[Prototype]]属性）到另一个对象或  null。
         * 语法： Object.setPrototypeOf(obj, prototype)；
         * obj：
         *  要设置其原型的对象。.
         * prototype：
         *  该对象的新原型(一个对象 或 null).
         * **/
		Object.setPrototypeOf(instance, Func.prototype);
	}
	const res = Func.apply(instance, args);
	if (
		typeof res === 'function' ||
		(typeof res === 'object' && res !== null)
	) {
		return res;
	}
	return instance;
}

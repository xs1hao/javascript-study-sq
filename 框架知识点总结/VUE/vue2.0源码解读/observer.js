/**
 * 通过 Object.defineProperty 劫持数据的 读 和 写；
 * **/
class Observer {
	constructor(data) {
		this.observer(data)
	}
	/**
	 * data: new vue 时传进来的 data;
	 * **/
	observer(data) {
		if (data && typeof data === 'object') {
			Object.keys(data).forEach((key) => {
				this.defineReactive(data, key, data[key])
			})
		}
	}
	defineReactive(obj, key, value) {
		// 递归遍历
		this.observer(value)
		const dep = new Dep()
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get() {
				// 订阅数据变化时，往 Dep（订阅器） 中添加观察者；
				Dep.target && dep.addSub(Dep.target)
				return value
			},
			set: (newValue) => {
				this.observer(newValue)
				if (newValue !== value) {
					value = newValue
				}
				// 告诉 Dep 通知变化
				dep.notify()
			},
		})
	}
}

/**
 * Dep 的作用：
 * 1. 收集；
 * 2. 通知，告我 watcher 去更新视图；
 * **/
class Dep {
	constructor() {
		this.subs = []
	}
	// 收集观察者
	addSub(watcher) {
		this.subs.push(watcher)
	}
	// 通知观察者去更新
	notify() {
		console.log('通知-变化')
		this.subs.forEach((w) => w.update())
	}
}

class Watcher {
	// 看一下 新值和旧值是不是一样
	constructor(vm, expr, cb) {
		this.vm = vm
		this.expr = expr
		this.cb = cb
		this.oldValue = this.getOldValue()
	}
	update() {
		const newValue = compileUtil.getVaule(this.expr, this.vm)
		if (this.oldValue !== newValue) {
			this.cb(newValue)
		}
	}
	getOldValue() {
		Dep.target = this // 挂载；
		/**
		 * compileUtil.getVaule
		 * 触发了 data对象中属性的 get 方法；
		 * 然后就将watcher 添加到收集器中；
		 *
		 * **/
		const oldValue = compileUtil.getVaule(this.expr, this.vm)
		Dep.target = null // 销毁；
		return oldValue
	}
}

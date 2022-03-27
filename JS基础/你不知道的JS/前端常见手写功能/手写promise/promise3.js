const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function resolvePromise(promise2, x, resolve, reject) {
	// 循环引用，自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise
	if (promise2 === x) {
		return reject(new TypeError('Channing cycle detected for promise'))
	}

	// 防止多次调用
	let called
	// x为对象或者函数
	if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
		try {
			// 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）
			let then = x.then
			if (typeof then === 'function') {
				// 让then执行，第一个参数是this，后面是成功的回调 和 失败的回调
				then.call(
					x,
					(res) => {
						// 成功和失败只能调用一个
						if (called) return
						called = true
						// 递归解析的过程（因为可能 promise 中还有 promise）
						resolvePromise(promise2, res, resolve, reject)
					},
					(err) => {
						// 成功和失败只能调用一个
						if (called) return
						called = true
						reject(err) // 失败了就失败了
					}
				)
			} else {
				resolve(x)
			}
		} catch (error) {
			if (called) return
			called = true
			reject(error)
		}
	} else {
		// 普通值直接resolve
		resolve(x)
	}
}

class sqPromise {
	constructor(executor) {
		this.status = PENDING
		this.value = undefined
		this.reason = undefined
		this.onFulfilledFn = []
		this.onRejectedFn = []

		let resolve = (value) => {
			if (this.status === PENDING) {
				this.status = FULFILLED
				this.value = value
				this.onFulfilledFn.forEach((fn) => fn())
			}
		}
		let reject = (value) => {
			if (this.status === PENDING) {
				this.status = REJECTED
				this.reason = value
				this.onRejectedFn.forEach((fn) => fn())
			}
		}

		try {
			executor(resolve, reject)
		} catch (error) {
			reject(error)
		}
	}

	then(onFulfilled, onRejected) {
		// 解决值穿透
		// onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
		onFulfilled =
			typeof onFulfilled === 'function' ? onFulfilled : (val) => val
		// onRejected如果不是函数，就忽略onRejected，直接扔出错误
		onRejected =
			typeof onRejected === 'function'
				? onRejected
				: (err) => {
						throw err
				  }

		let promise2 = new sqPromise((resolve, reject) => {
			if (this.status === FULFILLED) {
				// 模拟异步
				setTimeout(() => {
					try {
						let x = onFulfilled(this.value)
						resolvePromise(promise2, x, resolve, reject)
					} catch (e) {
						reject(e)
					}
				}, 0)
			}
			if (this.status === REJECTED) {
				setTimeout(() => {
					try {
						let x = onRejected(this.reason)
						resolvePromise(promise2, x, resolve, reject)
					} catch (error) {
						reject(error)
					}
				}, 0)
			}
			if (this.status === PENDING) {
				this.onFulfilledFn.push(() => {
					setTimeout(() => {
						try {
							// 执行第一个(当前)Promise的成功回调，并获取返回值
							let x = onFulfilled(this.value)
							// resolvePromise函数，处理自己return的promise和默认的promise2的关系
							resolvePromise(promise2, x, resolve, reject)
						} catch (error) {
							reject(error)
						}
					}, 0)
				})

				this.onRejectedFn.push(() => {
					setTimeout(() => {
						try {
							// 执行第一个(当前)Promise的失败回调，并获取返回值
							let x = onRejected(this.reason)
							// resolvePromise函数，处理自己return的promise和默认的promise2的关系
							resolvePromise(promise2, x, resolve, reject)
						} catch (error) {
							reject(error)
						}
					}, 0)
				})
			}
		})

		return promise2
	}
}

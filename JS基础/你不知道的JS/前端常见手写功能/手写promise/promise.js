const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用，自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise
  if (promise2 === x) {
    return reject(new TypeError("Channing cycle detected for promise"));
  }

  // 防止多次调用
  let called;
  // x为对象或者函数
  if ((typeof x === "object" && x !== null) || typeof x === "function") {
    try {
      // 为了判断 resolve 过的就不用再 reject 了（比如 reject 和 resolve 同时调用的时候）
      let then = x.then;
      if (typeof then === "function") {
        // 让then执行，第一个参数是this，后面是成功的回调 和 失败的回调
        then.call(
          x,
          (res) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // 递归解析的过程（因为可能 promise 中还有 promise）
            resolvePromise(promise2, res, resolve, reject);
          },
          (err) => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err); // 失败了就失败了
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    // 普通值直接resolve
    resolve(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledFn = [];
    this.onRejectedFn = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onFulfilledFn.forEach((fn) => fn());
      }
    };
    let reject = (value) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = value;
        this.onRejectedFn.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    // 解决值穿透
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected = typeof onRejected === "function" ? onRejected : (err) => { throw err; };

    let promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onFulfilledFn.push(() => {
          setTimeout(() => {
            try {
              // 执行第一个(当前)Promise的成功回调，并获取返回值
              let x = onFulfilled(this.value);
              // resolvePromise函数，处理自己return的promise和默认的promise2的关系
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0)
        });
        this.onRejectedFn.push(() => {
          setTimeout(() => {
            try {
              // 执行第一个(当前)Promise的失败回调，并获取返回值
              let x = onRejected(this.reason);
              // resolvePromise函数，处理自己return的promise和默认的promise2的关系
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0)
        });
      }
    });

    return promise2;
  }

  static resolve(value) {
    // 根据规范, 如果参数是Promise实例, 直接return这个实例
    if(value instanceof MyPromise) return value;
    return new MyPromise((resolve, reject) => {
      resolve(value);
    })
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    })
  }

  static all(promiseArr) {
    if (!Array.isArray(promiseArr)) {
      const type = typeof promiseArr;
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      let counts = 0;
      let result = [];
      let len = promiseArr.length;

      for (let i = 0; i < len; i++) {
        let instance = promiseArr[i];

        // Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(instance).then(val => {
          counts++;
          result[i] = val;
          if (counts === len) {
            resolve(result);
          }
        }, err => {
          reject(err);
        })
      }
    })
  }

  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promiseArr.length; i++) {
        let instance = promiseArr[i];
        Promise.resolve(instance).then(resolve, reject)
      }
    })
  }

  static allSettled(promiseArr) {
    if (!Array.isArray(promiseArr)) {
      const type = typeof promiseArr;
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      let counts = 0;
      let result = [];
      let len = promiseArr.length;

      for (let i = 0; i < len; i++) {
        let instance = promiseArr[i];

        // Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(instance).then(res => {
          counts++;
          result.push({ status: "fulfilled", value: res });
          if (counts === len) {
            resolve(result);
          }
        }, err => {
          counts++;
          result.push({ status: "rejected", value: err });
          if (counts === len) {
            resolve(result);
          }
        })
      }
    })
  }

  static any(promiseArr) {
    if (!Array.isArray(promiseArr)) {
      const type = typeof promiseArr;
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }

    return new MyPromise((resolve, reject) => {
      let hasOneResolved = false;
      let counts = 0;
      let len = promiseArr.length;

      for (let i = 0; i < len; i++) {
        let instance = promiseArr[i];

        // Promise.resolve(p)用于处理传入值不为Promise的情况
        MyPromise.resolve(instance).then(res => {
          if (hasOneResolved) return;
          hasOneResolved = true;
          resolve(res);
        }, err => {
          counts++;
          if (counts === len) {
            reject('AggregateError: All promises were rejected');
          }
        })
      }
    })
  }
}

MyPromise.prototype.catch = function(onRejected){
  return this.then(null, onRejected);
}

MyPromise.prototype.finally = function(callback){
  return this.then((value) => {
    return MyPromise.resolve(callback()).then(() => value);
  }, (reason) => {
    return MyPromise.resolve(callback()).then(() => { throw reason })
  })
}

// 包装想要控制中断的promise, 提供一个abort方法外部调用中断promise
function promiseAbort(promise) {
  let abort = null;
  let abortPromise = new Promise((resolve, reject) => {
    abort = reject;
  })
  let p = Promise.race([promise, abortPromise]);
  p.abort = abort;
  return p;
}

function promiseTimeout(promise, time = 5000) {
  let abortPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('timeout');
    }, time);
  })
  return Promise.race([promise, abortPromise]);
}
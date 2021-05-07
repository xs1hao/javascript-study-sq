const PENDING = 'pendening';
const FULLFILLED = 'fullfilled';
const REJECT = 'reject';

// 实现异步的promise
class sqPromise {
    constructor(executrt) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.fullfilledArr = [];
        this.rejectArr = [];

        let resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULLFILLED;
                this.value = value
                this.fullfilledArr.forEach(fn => fn());
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECT;
                this.reason = reason;
                this.rejectArr.forEach(fn => fn());
            }
        }

        try {
            executrt(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(fullfilledFn,rejectFn) {
        if (this.status === FULLFILLED) {
            fullfilledFn(this.value);
        }
        if (this.status === REJECT) {
            rejectFn(this.reason)
        }
        if (this.status === PENDING) {
            this.fullfilledArr.push(() => fullfilledFn(this.value));
            this.rejectArr.push(() => rejectFn(this.reason));
        }
    }
}
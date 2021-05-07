const PENDING = 'pendening';
const FULLFILLED = 'fullfilled';
const REJECT = 'reject';

// 实现同步的promise
class sqPromise {
    constructor(executrt) {
        this.status = PENDING;
        this.value = undefined;
        this.reason = undefined;

        let resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULLFILLED;
                this.value = value
            }
        }
        let reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECT;
                this.reason = reason;
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
    }
}
// https://www.bilibili.com/video/BV1ik4y1B7rm?from=search&seid=9977143695598969848
let _Vue;
class VueRouter {
    constructor() {
        
    }
}

VueRouter.install = function(Vue) {
    _Vue = Vue;
    _Vue.mixin({
        beforeCreate() {
            let vm = this; // vue 实例；
        }
    })
}

if (typeof Vue !== 'undefined') {
    Vue.use(VueRouter);
}
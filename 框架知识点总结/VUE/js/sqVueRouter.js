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
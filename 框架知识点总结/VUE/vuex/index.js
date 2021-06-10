let Vue;

let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
};

class Store {
  constructor(options) {
    // 用户获取的是这个 Store 类的实例；
    // 获取实例创建时 传入的所有属性；
    this.vm = new Vue({
      data: {
        // 默认这个状态 会使用 Objct.defineProperty 重新定义
        state: options.state
      }
    });

    let getters = options.getters;
    this.getters = {};
    forEach(getters, (getterName, value) => {
      Object.defineProperty(this.getters, getterName, {
        get: () => {
          return value(this.state);
        }
      });
    });

    // 需要将用户定义的 mutations 放到store上 订阅 （将函数订阅到一个数组中） 发布 （将数组中的函数 依次执行）；
    let mutations = options.mutations;
    this.mutations = {};
    forEach(mutations, (mutstionName, value) => {
      this.mutations[mutstionName] = payload => {
        value(this.state, payload);
      };
    });

    let actions = options.actions;
    this.actions = {};
    forEach(actions, (actionName, value) => {
      // 如果是异步方法则在 action 中执行，否则在 mutation 中执行；
      this.actions[actionName] = payload => {
        value(this, payload);
      };
    });
  }
  // es6 中类的访问器；
  // 对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
  get state() {
    // 获取实例上的 state 属性就会执行这个方法；
    return this.vm.state;
  }

  commit = (mutationName, payload) => {
    this.mutations[mutationName](payload);
  };

  dispatch = (actionName, payload) => {
    // 发布订阅找到对应的 action 执行；
    this.actions[actionName](payload);
  };
}

const install = _Vue => {
  // Vue的构造函数
  Vue = _Vue; // Vue 的构造函数；
  // 只当前的根实例开始，所有的根实例的子组件才有 $store 发放；
  Vue.mixin({
    // 组件的创建过程是先 父 后 子；混入的生命周期函数 优先组件内的 生命周期执行；
    beforeCreate() {
      // 把父组件的store 属性放到每个组件的实例上；
      if (this.$options.store) {
        this.$store = this.$options.store;
      } else {
        this.$store = this.$parent && this.$parent.$store;
      }
    }
  });
};

export default {
  Store,
  install
};

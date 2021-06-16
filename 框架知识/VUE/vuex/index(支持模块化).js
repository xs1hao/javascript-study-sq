let Vue;

let forEach = (obj, callback) => {
  Object.keys(obj).forEach(key => {
    callback(key, obj[key]);
  });
};

class ModuleCollection {
  constructor(options) {
    // 深度遍历所有的子模块
    this.register([],options);
  }

  register(path,rootModule) {
    let rawModule = {
      _raw: rootModule,
      _children: {},
      state: rootModule.state
    }
    if (!this.root) {
      this.root = rawModule;
    } else {
      // 找到要定义的模块，将这个模块定义到他的父上；
      let parentModule = path.slice(0,-1).reduce((root,current)=> {
        return root._children[current];
      },this.root)
      parentModule._children[path[path.length -1]] = rawModule;
    }

    if (rootModule.modules) {
      forEach(rootModule.modules,(moduleName, module) => {
        this.register(path.concat(moduleName),module)
      })
    }
  }

}

function installModule(store,rootState,path,rawModule) {

  // 需要将子模块的状态定义到rootState上；
  if (path.length > 0) { // 当前path 的length 大于0； 说明有子模块
    // vue 的响应式原理 不能增加不存在的属性；
    let parentState = path.slice(0,-1).reduce((root,current) => {
      return rootState[current];
    },rootState)
    // 给这个根状态定义当前的模块名称是path 的最后一项；
    Vue.set(parentState,path[path.length - 1],rawModule.state);
  }

  let getters = rawModule._raw.getters;
  if (getters) {
    forEach(getters,(getterName,value) => {
      Object.defineProperty(store.getters,getterName,{
        get: () => {
          return value(rawModule.state);
        }
      })
    })
  }

  let mutations = rawModule._raw.mutations;
  if (mutations) {
    forEach(mutations,(mutationName,value) => {
      let arr = store.mutations[mutationName] || (store.mutations[mutationName] = []);
      arr.push((payload) => {
        value(rawModule.state,payload);
      })
    })
  }

  let actions = rawModule._raw.actions;
  if (actions) {
    forEach(actions, (actionName,value) => {
      let arr = store.actions[actionName] || (store.actions[actionName] = []);
      arr.push((payload) => {
        value(store,payload);
      })
    })
  }

  forEach(rawModule._children,(moduleName,rawModule) => {
    installModule(store,rootState,path.concat(moduleName),rawModule);
  })

}

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
    // forEach(getters, (getterName, value) => {
    //   Object.defineProperty(this.getters, getterName, {
    //     get: () => {
    //       return value(this.state);
    //     }
    //   });
    // });

    // 需要将用户定义的 mutations 放到store上 订阅 （将函数订阅到一个数组中） 发布 （将数组中的函数 依次执行）；
    // let mutations = options.mutations;
    this.mutations = {};
    // forEach(mutations, (mutstionName, value) => {
    //   this.mutations[mutstionName] = payload => {
    //     value(this.state, payload);
    //   };
    // });

    // let actions = options.actions;
    this.actions = {};
    // forEach(actions, (actionName, value) => {
    //   // 如果是异步方法则在 action 中执行，否则在 mutation 中执行；
    //   this.actions[actionName] = payload => {
    //     value(this, payload);
    //   };
    // });

    /**
     * 要支持 store 模块化
     * 
     * **/
    //  1. 将数据格式化处理
    this.modules = new ModuleCollection(options);
    // 递归安装模块
    installModule(this,this.state,[],this.modules.root);

  }
  // es6 中类的访问器；
  // 对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
  get state() {
    // 获取实例上的 state 属性就会执行这个方法；
    return this.vm.state;
  }

  commit = (mutationName, payload) => {
    this.mutations[mutationName].forEach(fn => fn(payload));
  };

  dispatch = (actionName, payload) => {
    // 发布订阅找到对应的 action 执行；
    this.actions[actionName].forEach(fn => fn(payload));
  };

  registerModule(moduleName,module){
    if (!Array.isArray(moduleName)) {
      moduleName = [moduleName];
    }
    this.modules.register(moduleName,module); // 将模块格式化
    installModule(this,this.state,[],this.module.root);

  }
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

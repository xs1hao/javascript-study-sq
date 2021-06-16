

1. VUE是采用数据劫持，结合发布者-订阅者模式的方式；通过 Object.defineProperty()来劫持各个属性的setter 和getter;
在数据变化时，发布消息给依赖收集器，去通知观察者，做出对应的回调函数，去更新视图。

2. MVVM作为绑定的入口，整合 Observer,Compile 和 Watcher 三者，通过 Observer 来监听
model 数据变化表，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，
达到数据变化 ==>> 视图交互变化 ==>> 数据 model 变更的双向绑定效果。
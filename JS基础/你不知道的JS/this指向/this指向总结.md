1、``` <script>
    // 类上面的箭头函数 和 对象上面的箭头函数的结果不同；
    class Person {
     log = () => {
       console.log(this);
      }
    }
    // Person类通过new 实例后，他的this 指向了 实例；
    // 对象上的箭头函数，则指向的不一定是这个对象；
    var obj = {
     log: () => {
       console.log(this);
      }
    }
    obj.log(); // 此时this 指向的是 window；
  </script>
```
2、箭头函数的 this 指向最近的非箭头函数的 this, 找不到就指向 window；箭头函数的 this 始终指向函数定义时的 this, 而非执行时。
3、当函数不作为对象的属性被调用，而是以普通函数的方式，this总是指向全局对象（在浏览器中，通常是Window对象）；
4、普通函数内的this 是是调用，就指向谁；
```<script>
    // 函数作为对象属性调用；
    var obj = {
        name: 'yuguang',
        getName: function () {
            console.log(this.name);
        }
    };
    obj.getName(); // yuyang
    </script>```
```
  <script>
    // 函数以普通函数的方式调用；
    window.name = 'yuguang';
    var getName = function () {
        var name = '王二小';
        console.log(name); // 王二小
        console.log(this.name); // 严格模式下 报错； Uncaught TypeError: Cannot read properties of undefined (reading 'name')
    };
    getName(); // yuguang； 
</script>```
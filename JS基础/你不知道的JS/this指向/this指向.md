### this:上下文,会根据执行环境变化而发生指向的改变 [https://www.jb51.net/article/151599.htm]
1、严格模式中，普通函数中的this则表现不同，表现为undefined。
  (```)
  <script>
    'use strict';
    function demo() {
      alert(this); // undefined
    }
   demo();
   </script>
  (```)
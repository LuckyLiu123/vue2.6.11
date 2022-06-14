**Vue 源码分析**

目录
src
  |- compiler  编译器相关
  |- core  核心代码，要常来这里看看呀
    |- components  通用组件如 keep-alive
    |- global-api  全局API
    |- instance  构造函数等
    |- observer  响应式相关
    |- util
    |- vdom  虚拟DOM相关


  - scripts\config.js
    |- src\platforms\web\entry-runtime-with-compiler.js  打包的入口文件
      (该文件主要做处理template或者el选项，处理编译这件事)

整个程序的入口(初始化的流程)
  - src\platforms\web\runtime\index.js
    · 1. 安装补丁函数(更新函数): 将虚拟vdom 转换为真实dom
    · 2. 实现$mount方法: 将虚拟dom转换成真实dom并追加到宿主元素上(vdom -> dom -> append)
  - src\core\index.js
    · 1. 初始化全局静态API: Vue.set/delete/component/use/...
  - src\core\instance\index.js
    · 1. 构造函数的声明
    · 2. 各种实例属性和方法的声明
  - src\core\instance\init.js


1. 如果 new Vue() 中同时设置了 el, template, render, 代码如何执行?
  先去判断 render, 如果没有就去判断 template，如果还没有才去判断 el.

2. new Vue() 后面为什么可以不加 $mount()?
  在 src\core\instance\init.js 文件中自动执行了挂载。

3. $mount函数做了什么?

4. new Vue()都做了哪些事情?
  new Vue()的核心是: 初始化(得到渲染函数render)，最终目的是得到一个根实例，得到根实例之后是为了挂载$mout，挂载的内部会执行render函数，
  执行render函数之后会得到一个vdom，然后将vdom转换成真实dom(vdom转换成真实dom使用 patch(vdom) 函数)，最后再执行追加append，添加到真正的
  宿主元素上。这就是整个初始化的过程

5. render函数什么时候执行?

6. Observer 的作用是什么?
  · 1. 分辨传入的对象value的类型，将传入的value做响应式处理。
  · 2. 响应式对象中动态属性的添加或者删除时，dep负责通知更新。

7. Observer类的构造函数中的dep的作用是什么(src/core/observer/index.js)?
  如果一个响应式对象里面要动态的添加或删除一个属性(Vue.set/delete), defineProperty方法是没有办法拦截的。既然没有办法拦截，谁去通知更新呢。
  所以此处dep的目的就是: 如果当前响应式对象的属性被删除了或者添加了新的属性，dep负责通知更新。
  包括数组里面有一个元素被删除或者添加进去了，都是通过该dep去通知的。

8. dep和watcher之间的依赖关系?
  只要有对象就会有Observer实例，一个Observer实例里面会有一个对应的dep，data对象里面的每个key也会对应一个dep，不管是对象发生了变化还是对象里面的属性发生了变化，都可以通过dep去通知更新。

9. Vue的批量异步更新策略?
  浏览器的Event Loop: 浏览器每次事件循环的时候会从宏任务队列里面拿出一个宏任务去执行，执行完之后再在执行下一次宏任务之前会拿出微任务队列中的所有任务，全部执行完，清空微任务队列。然后这次循环就算结束，再执行下一次宏任务。一次浏览器的事件循环只会做一个宏任务。
  宏任务：script执行脚本，setTimeout，setInterval，xhr;
  微任务：promise，mutation observer...
  Vue的异步执行策略：Vue把组件的更新函数都以微任务的形式放在微任务队列里面去。如果在同步代码中对数据有很多行的修改，但是，可以使用一种机制，使得对这些数据的修改不会立刻导致Watcher去执行更新，而是尝试着把这些watcher的更新任务放到微任务队列里面去，在未来的某个时刻统一执行，这就是所谓的异步批量更新策略，

10. 请说一下你对nextTick的理解?
    src/core/util/next-tick.js
    概念：nextTick是Vue中批量异步更新策略真正的执行者。如何触发的呢？它的底层利用了异步任务(浏览器事件循环机制)，大概率会利用异步的方式往里面放回调函数。组件在更新的时候，不会立刻执行，而是通过nextTick异步启动。这样将来组件更新的时候会一起批量的更新，效率更高，而且大概率是用微任务的方式，巧妙的利用了浏览器中的宏任务和微任务的机制，更新的效率会更高。等这些更新全部结束只会一次性的去render，界面会一次更新，用户体验会更好。
    作用：nextTick(cb)中会传入一个回调函数，回调函数会先到队列(callbacks数组)中排队，然后在未来批量去调用。
    应用：数据变化之后，需要访问dom最新的值的时候。
    如何工作：源码描述，数据变化的时候，watcher不会立刻走更新函数，虽然触发了watcher的update函数，但实际上会先让watcher去入队，再异步的冲刷队列，最后才真正的执行watcher.run()，组件才真正的调用更新函数。
    结合实践：项目中什么场景下会用到nextTick?





代码检查(package.json中配置)
```js
  "gitHooks": {
    "pre-commit": "lint-staged",
    "commit-msg": "node scripts/verify-commit-msg.js"
  },
```
























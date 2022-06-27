class KVue {
  constructor(options) {
    this.$options = options;
    this.$el = options.el;
    this.$data = options.data;

    // 1. 对数据做响应式
    observe(this.$data);

    proxy(this, "$data");
  }
}

function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }

  // 每遇到一个对象就创建一个Observer实例，去做拦截操作
  new Observer(obj);
}

function proxy(vm, key) {
  Object.keys(vm[key]).forEach((k) => {
    Object.defineProperty(vm, k, {
      get() {
        return vm[key][k];
      },
      set(val) {
        vm[key][k] = val;
      },
    });
  });
}

class Observer {
  constructor(value) {
    this.value = value;
    this.walk(value);
  }

  walk(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
}

function defineReactive(obj, key, val) {
  observe(val);

  const dep = new Dep();

  Object.defineProperty(obj, key, {
    get() {
      console.log("get:", val);
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(newVal) {
      if (val !== newVal) {
        observe(newVal);
        console.log("set:", newVal);
        val = newVal;
        dep.notify();
      }
    },
  });
}

class Watcher {
  constructor(vm, key, updateFn) {
      this.vm = vm;
      this.key = key;
      this.updateFn = updateFn;

      Dep.target = this;
      this.vm[this.key];
      Dep.target = null;
  }

  update(){
    this.updateFn.call(this.vm, this.vm[this.key]);
  }
}


class Dep {
    constructor() {
        this.deps = [];
    }
    
    addDep(watcher) {
        this.deps.push(watcher);
    }
    
    notify() {
        this.deps.forEach((watcher) => {
            watcher.update();
        });
    }
}

Dep.target = null;
/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // ['component', 'directive', 'filter']
  ASSET_TYPES.forEach(type => {
    // Vue.component = function(id, def){}
    // Vue.component('comp', {...})
    Vue[type] = function (
      id: string,
      definition: Function | Object  //组件配置对象
    ): Function | Object | void {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }

        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 构造函数获取：Vue.extend(obj) => VueComponent
          // Vue.extend() 返回的是一个构造函数 Ctor, 然后通过 new Ctor()得到组件的实例
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }

        // 2. 注册到全局配置项中
        // options.components['comp'] = Ctor
        // 全局注册就是添加到系统选项中，以后所有组件初始化的时候，会有一
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}

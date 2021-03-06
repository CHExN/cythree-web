/**
 * 定义一些和权限有关的 Vue指令
 *
 * 验证权限时为了增速使用Set的has()函数，具体详情见（废弃）
 * https://medium.com/@bretcameron/how-to-make-your-code-faster-using-javascript-sets-b432457a4a77
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Set/has
 *
 */

let permissions = {}

// 必须包含列出的所有权限，元素才显示
export const hasPermission = {
  install (Vue) {
    Vue.directive('hasPermission', {
      bind (el, binding, vnode) {
        let value = binding.value.split(',')
        let flag = true
        for (let v of value) {
          if (permissions[v] === undefined) {
            permissions[v] = vnode.context.$store.state.account.permissions.includes(v)
            if (!permissions[v]) {
              flag = false
            }
          } else if (!permissions[v]) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 当不包含列出的权限时，渲染该元素
export const hasNoPermission = {
  install (Vue) {
    Vue.directive('hasNoPermission', {
      bind (el, binding, vnode) {
        let value = binding.value.split(',')
        let flag = true
        for (let v of value) {
          if (permissions[v] === undefined) {
            permissions[v] = vnode.context.$store.state.account.permissions.includes(v)
            if (permissions[v]) {
              flag = false
            }
          } else if (permissions[v]) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 只要包含列出的任意一个权限，元素就会显示
export const hasAnyPermission = {
  install (Vue) {
    Vue.directive('hasAnyPermission', {
      bind (el, binding, vnode) {
        let value = binding.value.split(',')
        let flag = false
        for (let v of value) {
          if (permissions[v] === undefined) {
            permissions[v] = vnode.context.$store.state.account.permissions.includes(v)
            if (permissions[v]) {
              flag = true
            }
          } else if (permissions[v]) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 必须包含列出的所有角色，元素才显示
export const hasRole = {
  install (Vue) {
    Vue.directive('hasRole', {
      bind (el, binding, vnode) {
        let value = binding.value.split(',')
        let flag = true
        for (let v of value) {
          if (!vnode.context.$store.state.account.roles.includes(v)) {
            flag = false
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

// 只要包含列出的任意一个角色，元素就会显示
export const hasAnyRole = {
  install (Vue) {
    Vue.directive('hasAnyRole', {
      bind (el, binding, vnode) {
        let value = binding.value.split(',')
        let flag = false
        for (let v of value) {
          if (vnode.context.$store.state.account.roles.includes(v)) {
            flag = true
          }
        }
        if (!flag) {
          if (!el.parentNode) {
            el.style.display = 'none'
          } else {
            el.parentNode.removeChild(el)
          }
        }
      }
    })
  }
}

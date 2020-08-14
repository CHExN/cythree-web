import request from '@/utils/request'

let tools = {
  // 下划线转换驼峰
  toHump (name) {
    return name.replace(/_(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })
  },

  // 驼峰转换下划线
  toLine (name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase()
  },

  // 千分位加点
  toNumFormant (value) {
    if (!value) return value
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  // 小数点留后两位
  addZero (value) {
    if (!value) return value
    const thousandsOfPointsArr = `${value}`.split('.')
    if (thousandsOfPointsArr.length === 1) { // 判断整数
      return `${value}.00`
    } else if (thousandsOfPointsArr[1].length === 1) { // 一位小数
      return `${value}0`
    }
    return value
  },

  zero (number) {
    if (number < 10 && number > 0) {
      return `0${number}`
    }
    return `${number}`
  },

  // 深复制
  deepClone (data) {
    let type = typeof data
    let obj
    if (type === 'array') {
      obj = []
    } else if (type === 'object') {
      obj = {}
    } else {
      // 不再具有下一层次
      return data
    }
    if (type === 'array') {
      for (let i = 0, len = data.length; i < len; i++) {
        obj.push(tools.deepClone(data[i]))
      }
    } else if (type === 'object') {
      obj = JSON.parse(JSON.stringify(data))
    }
    return obj
  },

  // 四舍五入
  rounding (number, index) {
    let numString = number.toString()
    let numStringArr = numString.split('.')
    if (numStringArr.length === 1) {
      return Number(numString)
    }
    let numAfterArr = numStringArr[1].split('')
    let amountArr = [...numStringArr[0].split(''), ...(numAfterArr.slice(0, index))].reverse()
    // console.log(amountArr)
    if (numAfterArr[index] && numAfterArr[index] >= 5) {
      // 判断要进一位的那个数是不是9
      if (numAfterArr[index - 1] === '9') {
        let n = 1
        let amountArrLength = amountArr.length
        for (let i = 0; i < amountArrLength; i++) {
          if (n === 0) continue
          if (amountArr[i] === '9') {
            amountArr[i] = '0'
            if (i + 1 === amountArrLength) {
              amountArr[i + 1] = '1'
            }
          } else {
            amountArr[i] = (Number(amountArr[i]) + n).toString()
            n = 0
          }
        }
        amountArr.splice(index, 0, '.')
        // console.log(amountArr.reverse().join(''))
        return Number(amountArr.reverse().join(''))
      } else {
        numAfterArr[index - 1] = (Number(numAfterArr[index - 1]) + 1).toString()
      }
    }
    return Number(`${numStringArr[0]}.${numAfterArr.slice(0, index).join('')}`)
  },

  // number数组之和
  sumArr (arr) {
    return arr.reduce(function (prev, cur) {
      return prev + cur
    }, 0)
  },

  /*
   * 判断obj是否为一个整数
   */
  isInteger (obj) {
    return Math.floor(obj) === obj
  },

  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  toInteger (floatNum) {
    var ret = {times: 1, num: 0}
    if (this.isInteger(floatNum)) {
      ret.num = floatNum
      return ret
    }
    var strfi = floatNum + ''
    var dotPos = strfi.indexOf('.')
    var len = strfi.substr(dotPos + 1).length
    var times = Math.pow(10, len)
    var intNum = Number(floatNum.toString().replace('.', ''))
    ret.times = times
    ret.num = intNum
    return ret
  },

  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  operation (a, b, op) {
    var o1 = this.toInteger(a)
    var o2 = this.toInteger(b)
    var n1 = o1.num
    var n2 = o2.num
    var t1 = o1.times
    var t2 = o2.times
    var max = t1 > t2 ? t1 : t2
    var result = null
    switch (op) {
      case 'add':
        if (t1 === t2) { // 两个小数位数相同
          result = n1 + n2
        } else if (t1 > t2) { // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2)
        } else { // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2
        }
        return result / max
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2)
        } else {
          result = n1 * (t2 / t1) - n2
        }
        return result / max
      case 'multiply':
        result = (n1 * n2) / (t1 * t2)
        return result
      case 'divide':
        result = (n1 / n2) * (t2 / t1)
        return result
    }
  },

  // 加减乘除的四个接口
  accAdd (a, b) {
    return this.operation(a, b, 'add')
  },
  accSubtract (a, b) {
    return this.operation(a, b, 'subtract')
  },
  accMultiply (a, b) {
    return this.operation(a, b, 'multiply')
  },
  accDivide (a, b) {
    return this.operation(a, b, 'divide')
  },

  // 根据身份证号获取出生日期
  getBirthday (identityCard) {
    let len = (identityCard + '').length
    if (len === 18) { // 处理18位的身份证号码从号码中得到生日和性别代码
      return new Date(identityCard.substr(6, 4) + '/' + identityCard.substr(10, 2) + '/' + identityCard.substr(12, 2))
    }
    if (len === 15) {
      const PREFIX = parseInt(identityCard.charAt(6) + identityCard.charAt(7)) < 10 ? '20' : '19'
      return new Date(PREFIX + identityCard.substr(6, 2) + '/' + identityCard.substr(8, 2) + '/' + identityCard.substr(10, 2))
    }
  },

  // 根据出生日期计算年龄
  getAge (birthDate) {
    if (!birthDate) {
      return 0
    }
    let nowDateTime = new Date()
    birthDate = new Date(birthDate)
    // birthDate = birthDate.toDate()
    let age = nowDateTime.getFullYear() - birthDate.getFullYear()
    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() === birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  },

  // 根据身份证得到籍贯
  getBirthplace (identityCard) {
    const CITY = {11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外'}
    if (CITY[identityCard.substr(0, 2)] === undefined) return '非法地区'
    return CITY[identityCard.substr(0, 2)]
  },

  // 根据出生日期与性别计算退休日期 (sex 1:男 0：女)
  getRetirement (birthday, sex) {
    birthday = birthday.toDate()
    if (sex === 1 || sex === 0) {
      return birthday.getFullYear() + (sex === 1 ? 60 : 50)
    }
    return 0
  },

  // 根据身份证号获取性别
  getGender (idNum) {
    return idNum.slice(14, 17) % 2 ? 1 : 0 // 1代表男性，0代表女性
  },

  // 去除datetime里的T
  getDateTime (dateTime) {
    if (!dateTime) return dateTime
    return dateTime.replace(/T/, ' ')
  },

  verification (entity, callback) {
    request.post('reviewModify', {
      ...entity
    }).then((r) => {
      callback(r)
    })
  },

  // 这是比较函数
  compare (p) {
    return function (m, n) {
      let a = m[p]
      let b = n[p]
      return a - b // 升序
    }
  }
}

export default tools

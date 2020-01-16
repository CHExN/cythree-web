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
    return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  // 千分位加点,小数点留后两位
  addZero (value) {
    const thousandsOfPointsArr = `${value}`.split('.')
    if (thousandsOfPointsArr.length === 1) { // 判断整数
      return `${value}.00`
    } else if (thousandsOfPointsArr[1].length === 1) { // 一位小数
      return `${value}0`
    }
    return value
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
      for (let key in data) {
        obj[key] = tools.deepClone(data[key])
      }
    }
    return obj
  },

  // number数组之和
  sumArr (arr) {
    return arr.reduce(function (prev, cur) {
      return prev + cur
    }, 0)
  },

  // 两浮点数之乘
  accMul (arg1, arg2) {
    let m = 0
    let s1 = arg1.toString()
    let s2 = arg2.toString()
    try { m += s1.split('.')[1].length } catch (e) {}
    try { m += s2.split('.')[1].length } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
  },

  // 两浮点数之和
  accAdd (arg1, arg2) {
    let r1, r2, m
    try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
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

  verification (entity, callback) {
    request.post('reviewModify', {
      ...entity
    }).then((r) => {
      callback(r)
    })
  }
}

export default tools

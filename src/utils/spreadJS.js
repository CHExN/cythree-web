// import { message } from 'ant-design-vue/es'
import message from 'ant-design-vue/es/message'

/* eslint-disable no-undef */
const newSpread = tableName => {
  let spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'))
  // 从本地读取JSON模板 导入到spread里
  spread.fromJSON(require(`../../static/file/${fileNameData[tableName]}`))
  return spread
}

// 固定形式
const fixedForm = (spread, tableName, dataObject) => {
  let sheet = spread.getActiveSheet()
  sheet.suspendPaint()
  let data = rowColData[tableName]
  Object.keys(dataObject).forEach(key => { // key就是列名
    if (data[key]) {
      sheet.setValue(data[key].row, data[key].col, dataObject[key])
    }
  })
  sheet.resumePaint()
  return spread
}

// 浮动形式
const floatForm = (spread, tableName, dataSource) => {
  let sheet = spread.getActiveSheet()
  sheet.suspendPaint()
  let startRow = startRowData[tableName] // startRowData里记录的是编号 index为 编号减1
  sheet.addRows(startRow, dataSource.length - 1) // length - 1 是因为原本就有一行
  for (let i = 0, len = dataSource.length - 1; i < len; i++) {
    sheet.copyTo(startRow - 1, 1, startRow + i, 1, 1, sheet.getColumnCount() - 1, GC.Spread.Sheets.CopyToOptions.all)
    sheet.setRowHeight(startRow + i, sheet.getRowHeight(startRow - 1))
  }
  // 这里开始插入数据
  sheet.setArray(startRow - 1, 1, dataSource)
  sheet.resumePaint()
  return spread
}

const floatReset = (spread, tableName, dataSourceLength) => {
  let sheet = spread.getActiveSheet()
  let startRow = startRowData[tableName]
  sheet.deleteRows(startRow, dataSourceLength - 1)
}

// 导出操作
const saveExcel = (spread, fileName) => {
  let excelIo = new GC.Spread.Excel.IO()
  excelIo.save(spread.toJSON(), blob => {
    const link = document.createElement('a')
    link.download = fileName
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }, e => {
    console.log(e)
    message.error('Failed to export file')
  })
}

// 表名对应的JSON模板文件名
const fileNameData = {
  StoreroomPut: '入库单.json',
  StoreroomOut: '出库单.json',
  Application: '采购申请单.json',
  Plan: '采购计划单.json',
  WcCostAccount: '公厕每月台账.json',
  WcCostAccountFirstHalf: '公厕上半年台账.json',
  WcCostAccountSecondHalf: '公厕下半年台账.json',
  OfficeSuppliesApplicationForm: '办公用品申领单.json',
  Canteen: '食堂用品.json',
  CanteenSupplier: '食堂用品供应商分类.json',
  FixedAssets: '固定资产申请单.json',
  FixedAssetsAcceptance: '固定资产验收单.json',
  Attendance: '考勤.json',
  Staff: '人员变动.json',
  InsideAnnualLeave: '编内人员年假.json',
  Vacation: '人员休假.json',
  Insurance: '社保明细.json',
  Condolences: '职工慰问管理单.json',
  BilateralMeeting: '上会议题.json',
  WcStatusDay: '公厕状态日报.json',
  WcStatusWeek: '公厕状态周报.json'
}

// 表名对应的开始行index
const startRowData = {
  StoreroomPut: 8,
  StoreroomOut: 8,
  Plan: 5,
  WcCostAccount: 3,
  WcCostAccountFirstHalf: 4,
  WcCostAccountSecondHalf: 4,
  OfficeSuppliesApplicationForm: 4,
  Canteen: 3,
  CanteenSupplier: 3,
  FixedAssets: 5,
  Attendance: 5,
  Staff: 2,
  InsideAnnualLeave: 3,
  Vacation: 3,
  BilateralMeeting: 7,
  WcStatusDay: 4,
  WcStatusWeek: 4
}

// 表名对应的各列名，列名又对应行数和列数
const rowColData = {
  StoreroomPut: {
    num: {row: 2, col: 12},
    toDeptName: {row: 4, col: 2},
    storage: {row: 9, col: 6},
    handle: {row: 9, col: 15},
    year: {row: 4, col: 6},
    month: {row: 4, col: 9},
    day: {row: 4, col: 12},
    supplier: {row: 4, col: 15},
    f: {row: 8, col: 14},
    j: {row: 8, col: 13},
    y: {row: 8, col: 12},
    s: {row: 8, col: 11},
    b: {row: 8, col: 10},
    q: {row: 8, col: 9},
    w: {row: 8, col: 8},
    sw: {row: 8, col: 7},
    bw: {row: 8, col: 6}
  },
  StoreroomOut: {
    num: {row: 2, col: 12},
    toDeptName: {row: 4, col: 2},
    storage: {row: 9, col: 6},
    handle: {row: 9, col: 15},
    year: {row: 4, col: 6},
    month: {row: 4, col: 9},
    day: {row: 4, col: 12},
    supplier: {row: 4, col: 15},
    f: {row: 8, col: 14},
    j: {row: 8, col: 13},
    y: {row: 8, col: 12},
    s: {row: 8, col: 11},
    b: {row: 8, col: 10},
    q: {row: 8, col: 9},
    w: {row: 8, col: 8},
    sw: {row: 8, col: 7},
    bw: {row: 8, col: 6}
  },
  Application: {
    num: {row: 1, col: 6},
    typeApplicationToDict: {row: 2, col: 2},
    deptName: {row: 2, col: 4},
    handle: {row: 2, col: 6},
    description: {row: 3, col: 1},
    money: {row: 3, col: 2},
    isIn: {row: 4, col: 2}
  },
  Plan: {
    typeApplicationToDict: {row: 2, col: 2},
    deptName: {row: 2, col: 10},
    purDept: {row: 5, col: 3},
    appDept: {row: 5, col: 6},
    handle: {row: 5, col: 8},
    date: {row: 5, col: 10}
  },
  WcCostAccount: {
    title: {row: 0, col: 1}
  },
  WcCostAccountFirstHalf: {
    title: {row: 0, col: 1}
  },
  WcCostAccountSecondHalf: {
    title: {row: 0, col: 1}
  },
  OfficeSuppliesApplicationForm: {
    deptName: {row: 1, col: 1},
    date: {row: 1, col: 5}
  },
  Canteen: {
    title: {row: 0, col: 1}
  },
  CanteenSupplier: {
    title: {row: 0, col: 1}
  },
  FixedAssets: {
    deptName: {row: 1, col: 2},
    createDate: {row: 1, col: 4},
    handle: {row: 2, col: 2},
    num: {row: 2, col: 4},
    money: {row: 5, col: 4},
    description: {row: 7, col: 1},
    appDept: {row: 9, col: 1}
  },
  FixedAssetsAcceptance: {
    name: {row: 1, col: 2},
    num: {row: 2, col: 2},
    manager: {row: 2, col: 4},
    money: {row: 3, col: 2},
    moneyTrue: {row: 3, col: 4},
    isMatch: {row: 5, col: 4},
    isApplicability: {row: 7, col: 4},
    isIndicators: {row: 9, col: 4},
    isAccessories: {row: 11, col: 4},
    isNew: {row: 13, col: 4},
    isComplete: {row: 15, col: 4},
    remarkO: {row: 17, col: 2},
    remark: {row: 19, col: 2},
    location: {row: 20, col: 2},
    installCompleteDate: {row: 21, col: 2},
    acceptanceDate: {row: 21, col: 4},
    acceptanceResult: {row: 22, col: 2},
    asset0: {row: 6, col: 1},
    asset1: {row: 7, col: 1},
    asset2: {row: 8, col: 1},
    asset3: {row: 9, col: 1},
    asset4: {row: 10, col: 1},
    asset5: {row: 11, col: 1},
    asset6: {row: 12, col: 1},
    asset7: {row: 13, col: 1},
    asset8: {row: 14, col: 1},
    asset9: {row: 15, col: 1},
    asset10: {row: 16, col: 1}
  },
  InsideAnnualLeave: {
    title: {row: 0, col: 1}
  },
  Vacation: {
    title: {row: 0, col: 1}
  },
  Insurance: {
    title: {row: 0, col: 0},
    pensionInsuranceUnit0: {row: 2, col: 1},
    pensionInsuranceIndividual0: {row: 3, col: 1},
    unemploymentInsuranceUnit0: {row: 4, col: 1},
    unemploymentInsuranceIndividual0: {row: 5, col: 1},
    workInjuryInsuranceUnit0: {row: 6, col: 1},
    maternityInsuranceUnit0: {row: 7, col: 1},
    medicalInsuranceUnit0: {row: 8, col: 1},
    medicalInsuranceIndividual0: {row: 9, col: 1},
    medicalMutualAidUnit0: {row: 10, col: 1},
    medicalMutualAidIndividual0: {row: 11, col: 1},
    publicTherapySupplementUnit0: {row: 12, col: 1},
    corporateAnnuityUnit0: {row: 13, col: 1},
    corporateAnnuityIndividual0: {row: 14, col: 1},

    pensionInsuranceUnit1: {row: 2, col: 2},
    pensionInsuranceIndividual1: {row: 3, col: 2},
    unemploymentInsuranceUnit1: {row: 4, col: 2},
    unemploymentInsuranceIndividual1: {row: 5, col: 2},
    workInjuryInsuranceUnit1: {row: 6, col: 2},
    maternityInsuranceUnit1: {row: 7, col: 2},
    medicalInsuranceUnit1: {row: 8, col: 2},
    medicalInsuranceIndividual1: {row: 9, col: 2},
    medicalMutualAidUnit1: {row: 10, col: 2},
    medicalMutualAidIndividual1: {row: 11, col: 2},
    publicTherapySupplementUnit1: {row: 12, col: 2},
    corporateAnnuityUnit1: {row: 13, col: 2},
    corporateAnnuityIndividual1: {row: 14, col: 2}
  },
  Condolences: {
    name: {row: 1, col: 2},
    sexx: {row: 1, col: 4},
    age: {row: 2, col: 2},
    deptName: {row: 2, col: 4},
    address: {row: 3, col: 2},
    phone: {row: 3, col: 4},
    text: {row: 4, col: 2}
  },
  WcStatusDay: {
    title1: {row: 0, col: 1},
    title2: {row: 1, col: 1}
  },
  WcStatusWeek: {
    title1: {row: 0, col: 1},
    title2: {row: 1, col: 1}
  }
}

export { newSpread, fixedForm, floatForm, floatReset, saveExcel }

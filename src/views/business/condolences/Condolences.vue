<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="职工姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-tree-select
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                  :treeData="deptTreeData"
                  @change="handleDeptChange">
                </a-tree-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="电话"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.phone"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="地址"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.address"/>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" ghost @click="add" v-hasPermission="'condolences:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'condolences:delete'">删除</a-button>
        <a-button @click="exportCondolences" v-hasPermission="'fixedAssetsAcceptance:export'">导出管理单</a-button>
        <!-- <a-button @click="saveExcel">导出Excel</a-button> -->
        <!-- <a-button @click="importTemplate">导入模板</a-button> -->
        <!-- <a-button @click="setColor">设置颜色</a-button> -->
      </div>
      <!-- <div ref="excelView" id="excelView" :style="spreadStyle"></div> -->
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="id"
               @change="handleTableChange">
        <template slot="address" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="text" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-if="record.status==='1'" v-hasPermission="'condolences:update'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
          <a-badge v-hasNoPermission="'condolences:update'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增职工慰问 -->
    <condolences-add
      :condolencesAddVisiable="condolencesAdd.visiable"
      @close="handleCondolencesAddClose"
      @success="handleCondolencesAddSuccess">
    </condolences-add>
  </a-card>
</template>
<script>
import CondolencesAdd from './CondolencesAdd'
import { newSpread, fixedForm, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'Condolences',
  components: { CondolencesAdd },

  data () {
    return {
      excelIo: {},
      spread: {},
      // data,
      spreadStyle: {
        width: '100%',
        height: '430px'
      },
      advanced: false,
      condolencesInfo: {
        visiable: false,
        data: {}
      },
      condolencesAdd: {
        visiable: false
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      deptTreeData: [],
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },
  computed: {
    columns () {
      // 受控属性
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '职工姓名',
        dataIndex: 'name'
      }, {
        title: '性别',
        dataIndex: 'sexx',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return '男'
            case '2':
              return '女'
            default:
              return text
          }
        },
        filters: [
          { text: '男', value: '1' },
          { text: '女', value: '2' }
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.sexx || null,
        onFilter: (value, record) => record.sexx.includes(value)
      }, {
        title: '年龄',
        dataIndex: 'age'
      }, {
        title: '部门',
        dataIndex: 'deptName'
      }, {
        title: '电话',
        dataIndex: 'phone'
      }, {
        title: '地址',
        dataIndex: 'address',
        scopedSlots: { customRender: 'address' },
        width: 200
      }, {
        title: '情况说明',
        dataIndex: 'text',
        scopedSlots: { customRender: 'text' },
        width: 200
      }, {
        title: '状态',
        dataIndex: 'status',
        width: 150,
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-tag color="purple">待审核</a-tag>
            case '2':
              return <a-tag color="cyan">已通过</a-tag>
            case '3':
              return <a-tag color="pink">未通过</a-tag>
            default:
              return text
          }
        },
        filters: [
          { text: '待审核', value: '1' },
          { text: '已通过', value: '2' },
          { text: '未通过', value: '3' }
        ],
        filterMultiple: true,
        filteredValue: filteredInfo.status || null,
        onFilter: (value, record) => record.status.includes(value)
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 100
      }]
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    // this.spread = new GC.Spread.Sheets.Workbook(document.getElementById('excelView'))
    // eslint-disable-next-line no-undef
    // this.excelIo = new GC.Spread.Excel.IO()
    this.loadSelect()
    this.fetch()
  },
  methods: {
    saveExcel () {
      // saveExcel('test1', [1, 2, 3, 5, 6, 7])
      // let datattt = [1, 2, 3, 5, 6, 7]
      // let length = datattt.length
      // let sheet = this.spread.getActiveSheet()
      // let startRow = 5 // 编号为5 index为4
      // sheet.addRows(startRow, length - 1)
      // for (let i = 0, len = length - 1; i < len; i++) {
      //   sheet.copyTo(startRow - 1, 1, startRow + i, 1, 1, sheet.getColumnCount() - 1, GC.Spread.Sheets.CopyToOptions.all)
      //   sheet.setRowHeight(startRow + i, sheet.getRowHeight(startRow - 1))
      // }
      // let fileName = new Date().getTime() + '.xlsx'
      // let json = this.spread.toJSON()
      // this.excelIo.save(json, (blob) => {
      //   this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
      //     // eslint-disable-next-line no-undef
      //     saveAs(blob, fileName)
      //   })
      // }, function (e) {
      //   console.log(e)
      // })
    },
    importTemplate () {
      this.spread.fromJSON(this.data)
    },
    setColor () {
      let sheet = this.spread.getActiveSheet()
      // sheet.addRows(8, 1) // 添加行 (开始行, 添加的行数))

      // sheet.currentTheme('Concourse') // 设置文档主题

      sheet.getCell(3, 2).backColor('#FF5B38')
      sheet.getCell(4, 3).backColor('#FF5B38') // 设置颜色
      sheet.getCell(5, 4).backColor('#FF5B38')
      sheet.getCell(6, 5).backColor('#FF5B38')
      sheet.getCell(7, 6).backColor('#FF5B38')
      sheet.getCell(8, 7).backColor('#FF5B38')

      // sheet.addSpan(6, 0, 1, 5) // 合并单元格 (开始行, 开始列, 延申列 ,延申行)

      // sheet.setValue(7, 0, "Asset Type") // 设置值 (行, 列, 值)

      // sheet.setArray(7, 7, [['value1', 'value2', undefined, 'value4'], ['value5', undefined, 'value7', 'value8']]) // 设置一系列值给一片区域内的单元格

      // this.spread.invalidateLayout()
      // this.spread.repaint()

      // 通过以下代码构造一个新的表单(参数为表单的名字)。
      // var sheet = new GC.Spread.Sheets.Worksheet('NewSheet')

      // 通过以下代码将表单实例插入到 Spread 控件的指定索引位置。
      // spread.addSheet(0, sheet)

      // 如果你想从 Spread 控件上删除一个表单, 可以通过以下代码. 示例代码展示从 Spread 控件删除第一个表单。
      // spread.removeSheet(0)

      // 如果你想从 Spread 控件上删除所有的表单, 可以调用 clearSheets 方法。
      // spread.clearSheets()

      // 如果你想自定制表单的名字, 可以调用 name 方法来获取和设置表单的名字。
      // var sheetName = sheet.name()
      // sheet.name('sheet1')
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.phone = ''
        this.queryParams.address = ''
      }
    },
    isPass (is, record) {
      let data = {
        id: record.id,
        name: record.name,
        username: record.username,
        status: is ? 2 : 3
      }
      if (is) {
        this.$message.success('通过')
      } else {
        this.$message.success('不通过')
      }
      this.loading = true
      this.$put('condolences', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
      })
    },
    add () {
      this.condolencesAdd.visiable = true
    },
    handleCondolencesAddClose () {
      this.condolencesAdd.visiable = false
    },
    handleCondolencesAddSuccess () {
      this.condolencesAdd.visiable = false
      this.$message.success('新增职工慰问管理单成功')
      this.search()
    },
    handleDeptChange (value) {
      this.queryParams.deptId = value || ''
    },
    batchDelete () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要删除的记录')
        return
      }
      let that = this
      this.$confirm({
        title: '确定删除所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被彻底删除',
        centered: true,
        onOk () {
          that.$delete('condolences/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.selectedRows = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
          that.selectedRows = []
        }
      })
    },
    exportCondolences () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      this.$message.loading('正在生成', 1, () => { // 3s后关闭执行关闭回调函数
        this.selectedRows.forEach(item => {
          item.sexx = item.sexx === '1' ? '男' : '女'
          let spread = newSpread('Condolences')
          spread = fixedForm(spread, 'Condolences', item)
          let fileName = `职工慰问管理单_${item.name}.xlsx`
          saveExcel(spread, fileName)
        })
      })
    },
    search () {
      let {sortedInfo, filteredInfo} = this
      let sortField, sortOrder
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field
        sortOrder = sortedInfo.order
      }
      this.fetch({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    reset () {
      // 取消选中
      this.selectedRowKeys = []
      this.selectedRows = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {}
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('dept').then((r) => {
        this.deptTreeData = r.data.rows.children
      })
    },
    fetch (params = {}) {
      // 显示loading
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }
      this.$get('condolences', {
        ...params
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.rows
        this.pagination = pagination
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>

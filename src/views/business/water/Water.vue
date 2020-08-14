<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcNum"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="创建日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleCreateDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="修改日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleModifyDateChange" ref="modifyTime"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="月份选择"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-month-picker
                    style="width: 100%;"
                    :allowClear="false"
                    @change="handleMonthChange"
                  />
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'water:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'water:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'water:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="beforeUpload">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'water:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="waterId"
               @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'water:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"/>
          &nbsp;
          <a-icon v-hasPermission="'water:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"/>
        </template>
      </a-table>
      <div v-if="barData.length > 0" style="margin: 0px 0px -54px -24px">
        <bar :data="barData" position="date*实际用量"/>
      </div>
    </div>
    <!-- 水费信息 -->
    <water-info
      :waterInfoData="waterInfo.data"
      :waterInfoVisiable="waterInfo.visiable"
      @close="handleWaterInfoClose">
    </water-info>
    <!-- 新增水费信息 -->
    <water-add
      :waterAddVisiable="waterAdd.visiable"
      @close="handleWaterAddClose"
      @success="handleWaterAddSuccess">
    </water-add>
    <!-- 修改水费信息 -->
    <water-edit
      ref="waterEdit"
      :waterEditVisiable="waterEdit.visiable"
      @close="handleWaterEditClose"
      @success="handleWaterEditSuccess">
    </water-edit>
    <!-- 导入结果 -->
    <import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :successColumns="successColumns"
      :importResultVisible="importResultVisible">
    </import-result>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import WaterAdd from './WaterAdd'
import WaterEdit from './WaterEdit'
import WaterInfo from './WaterInfo'
import ImportResult from '@/components/view/ImportResult'
import { Bar } from '@/components'

export default {
  name: 'Water',
  components: { RangeDate, WaterAdd, WaterEdit, WaterInfo, ImportResult, Bar },
  data () {
    return {
      barData: [],
      fileList: [],
      importData: [],
      times: '',
      errors: [],
      successColumns: [],
      importResultVisible: false,
      advanced: false,
      waterAdd: {
        visiable: false,
        data: {}
      },
      waterEdit: {
        visiable: false,
        data: {}
      },
      waterInfo: {
        visiable: false,
        data: {}
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
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
      let { sortedInfo } = this
      sortedInfo = sortedInfo || {}
      return [{
        title: '公厕名',
        dataIndex: 'wcName',
        ellipsis: true,
        customRender: (text, row, index) => {
          return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
        }
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'wcNum' && sortedInfo.order
      }, {
        title: '月份',
        dataIndex: 'month',
        customRender: (text, row, index) => {
          return `${row.year}-${row.month}`
        },
        width: '8%'
      }, {
        title: '实际用量',
        dataIndex: 'actualAmount',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'actualAmount' && sortedInfo.order,
        width: '8%'
      }, {
        title: '单价',
        dataIndex: 'unitPrice',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'unitPrice' && sortedInfo.order,
        width: '8%'
      }, {
        title: '自来水费',
        dataIndex: 'tapWaterFee',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'tapWaterFee' && sortedInfo.order,
        width: '8%'
      }, {
        title: '水资源费',
        dataIndex: 'waterResourcesFee',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'waterResourcesFee' && sortedInfo.order,
        width: '8%'
      }, {
        title: '污水',
        dataIndex: 'sewageFee',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'sewageFee' && sortedInfo.order,
        width: '8%'
      }, {
        title: '金额合计',
        dataIndex: 'totalAmount',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'totalAmount' && sortedInfo.order,
        width: '8%'
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
    this.fetch()
  },
  methods: {
    handleClose () {
      this.importResultVisible = false
    },
    downloadTemplate () {
      this.$download('water/template', {}, '水费信息表_导入模板.xlsx')
    },
    beforeUpload (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$message.loading('处理中', 0)
      this.$upload('water/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.search()
        }
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.successColumns = [{
          title: '月份',
          dataIndex: 'year',
          customRender: (text, row, index) => {
            return `${row.year}-${row.month}`
          }
        }, {
          title: '公厕编号',
          dataIndex: 'wcNum'
        }, {
          title: '金额合计',
          dataIndex: 'totalAmount'
        }]
        this.importResultVisible = true
      }).catch((r) => {
        this.$message.destroy()
        console.error(r)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.tableDiagramDataProcessing(selectedRows)
    },
    tableDiagramDataProcessing (selectedRows) {
      if (selectedRows === []) {
        this.barData = []
        return
      }
      let data = []
      selectedRows.slice(0, 20).forEach((item) => {
        data.push({date: `${item.wcNum.substr(9)}_${item.year.substr(2)}年${item.month}月`, 实际用量: item.actualAmount})
      })
      this.barData = data
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.year = ''
        this.queryParams.month = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
        this.queryParams.modifyTimeFrom = ''
        this.queryParams.modifyTimeTo = ''
      }
    },
    add () {
      this.waterAdd.visiable = true
    },
    handleWaterAddClose () {
      this.waterAdd.visiable = false
    },
    handleWaterAddSuccess () {
      this.waterAdd.visiable = false
      this.$message.success('新增水费信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.waterEdit.setFormValues(record)
      this.waterEdit.visiable = true
    },
    handleWaterEditClose () {
      this.waterEdit.visiable = false
    },
    handleWaterEditSuccess () {
      this.waterEdit.visiable = false
      this.$message.success('修改水费信息成功')
      this.search()
    },
    view (record) {
      this.waterInfo.data = record
      this.waterInfo.visiable = true
    },
    handleWaterInfoClose () {
      this.waterInfo.visiable = false
    },
    handleMonthChange (value) {
      this.queryParams.year = value.format('YYYY') || ''
      this.queryParams.month = value.format('MM') || ''
    },
    handleCreateDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    handleModifyDateChange (value) {
      if (value) {
        this.queryParams.modifyTimeFrom = value[0]
        this.queryParams.modifyTimeTo = value[1]
      }
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
          that.$delete('water/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exportExcel () {
      let {sortedInfo, filteredInfo} = this
      let sortField, sortOrder, pageSize
      // 设置导出的数据为总数据条数
      if (this.pagination) {
        pageSize = this.pagination.total
      }
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        // 列名
        sortField = sortedInfo.field
        // 排序方式 ascend正序 descend倒序
        sortOrder = sortedInfo.order
      }
      this.$export('water/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
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
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
        // 清空时间选择
        this.$refs.modifyTime.reset()
      }
      // 重置条形图
      this.barData = []
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
      this.$get('water', {
        ...params
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.dataSource = data.rows
        this.pagination = pagination
        // 数据加载完毕，关闭loading
        this.loading = false
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>

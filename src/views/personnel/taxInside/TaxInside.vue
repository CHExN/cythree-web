<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="月份"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-month-picker
                  v-model="queryParams.nowMonth"
                  style="width: 100%;"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.staffName"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="证照类型"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleIdCardTypeChange">
                    <a-select-option v-for="i in Object.keys(dictData.idCardType||[])" :key="i">{{ dictData.idCardType[i] }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.staffIdCard"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'taxInside:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'taxInside:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'taxInside:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="beforeUpload">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'taxInside:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择月份"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="importExcel"
          okText="提交">
          <a-month-picker
            style="width: 100%;"
            @change="handleYearMonthChange"
          />
        </a-modal>
        <a-modal
          title="选择导出日期"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportExcel"
          okText="提交">
          <a-month-picker style="width: 100%;"/>
        </a-modal>
      </div>
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
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'taxInside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'taxInside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 新增编内个税信息 -->
    <tax-inside-add
      :dictData="dictData"
      :taxInsideAddVisiable="taxInsideAdd.visiable"
      @close="handleTaxInsideAddClose"
      @success="handleTaxInsideAddSuccess">
    </tax-inside-add>
    <!-- 修改编内个税信息 -->
    <tax-inside-edit
      ref="taxInsideEdit"
      :dictData="dictData"
      :taxInsideEditVisiable="taxInsideEdit.visiable"
      @close="handleTaxInsideEditClose"
      @success="handleTaxInsideEditSuccess">
    </tax-inside-edit>
    <!-- 编内个税详细信息 -->
    <tax-inside-info
      :taxInsideInfoData="taxInsideInfo.data"
      :taxInsideInfoVisiable="taxInsideInfo.visiable"
      @close="handleTaxInsideInfoClose">
    </tax-inside-info>
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
import TaxInsideAdd from './TaxInsideAdd'
import TaxInsideEdit from './TaxInsideEdit'
import TaxInsideInfo from './TaxInsideInfo'
import ImportResult from '@/components/view/ImportResult'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'TaxInside',
  components: { TaxInsideAdd, TaxInsideEdit, TaxInsideInfo, ImportResult },
  data () {
    return {
      monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      modalVisible: false,
      fileList: [],
      file: '',
      importData: [],
      times: '',
      errors: [],
      successColumns: [],
      importResultVisible: false,
      advanced: false,
      taxInsideAdd: {
        visiable: false,
        data: {}
      },
      taxInsideEdit: {
        visiable: false,
        data: {}
      },
      taxInsideInfo: {
        visiable: false,
        data: {}
      },
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      queryParams: {
        nowMonth: moment()
      },
      dictData: {},
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
      return [{
        title: '序号',
        dataIndex: 'sortNum',
        width: '6%'
      }, {
        title: '姓名',
        dataIndex: 'staffName',
        width: '10%'
      }, {
        title: '证照类型',
        dataIndex: 'idCardType',
        customRender: (text, row, index) => {
          return this.dictData.idCardType[text]
        },
        width: '10%'
      }, {
        title: '证照号码',
        dataIndex: 'staffIdCard',
        width: '16%'
      }, {
        title: '本期收入',
        dataIndex: 'currentIncomeSum'
      }, {
        title: '应扣税额',
        dataIndex: 'finalWageSum'
      }, {
        title: '月缴税数',
        dataIndex: 'id',
        customRender: (text, row, index) => {
          // return this.$tools.addZero(Math.round(row.monthTaxPaid * 100) / 100)
          return this.$tools.addZero(row.monthTaxPaid)
        }
      }, {
        title: '月份',
        dataIndex: 'year',
        customRender: (text, row, index) => {
          return `${text}-${row.month}`
        }
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
    this.loadSelect()
  },
  methods: {
    handleClose () {
      this.importResultVisible = false
    },
    downloadTemplate () {
      this.$download('taxInside/template', {}, '编内个税表_导入模板.xlsx')
    },
    beforeUpload (file) {
      this.modalVisible = true
      this.file = file
      return false
    },
    importExcel () {
      if (!this.dateData.dateTo.year || !this.dateData.dateTo.month) {
        this.$message.warning('请选择月份')
        return
      }
      this.modalVisible = false
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('date', `${this.dateData.dateTo.year}-${this.dateData.dateTo.month}`)
      this.$message.loading('处理中', 0)
      this.$upload('taxInside/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.search()
        }
        this.file = ''
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.successColumns = [{
          title: '姓名',
          dataIndex: 'staffName'
        }, {
          title: '月份',
          dataIndex: 'year',
          customRender: (text, row, index) => {
            return `${text}-${row.month}`
          }
        }, {
          title: '备注',
          dataIndex: 'remark'
        }, {
          title: '插入日期',
          dataIndex: 'createTime'
        }]
        this.importResultVisible = true
      }).catch((r) => {
        this.file = ''
        this.$message.destroy()
        console.error(r)
      })
    },
    handleYearMonthChange (value) {
      if (!value) {
        this.dateData.dateTo = {}
        return
      }
      this.dateData.dateTo = {
        year: value.format('YYYY'),
        month: value.format('MM')
      }
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.idCardType = ''
        this.queryParams.remark = ''
        this.queryParams.staffIdCard = ''
      }
    },
    add () {
      this.taxInsideAdd.visiable = true
    },
    handleTaxInsideAddClose () {
      this.taxInsideAdd.visiable = false
    },
    handleTaxInsideAddSuccess () {
      this.taxInsideAdd.visiable = false
      this.$message.success('新增编内个税信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.taxInsideEdit.setFormValues(record)
      this.taxInsideEdit.visiable = true
    },
    handleTaxInsideEditClose () {
      this.taxInsideEdit.visiable = false
    },
    handleTaxInsideEditSuccess () {
      this.taxInsideEdit.visiable = false
      this.$message.success('修改编内个税信息成功')
      this.search()
    },
    view (record) {
      Object.keys(this.dictData).forEach(key => {
        record[key + 'ToDict'] = this.dictData[key][record[key]]
      })
      this.taxInsideInfo.data = record
      this.taxInsideInfo.data.monthArr = this.monthData.slice(0, this.monthData.indexOf(record.month) + 1).join()
      this.taxInsideInfo.visiable = true
    },
    handleTaxInsideInfoClose () {
      this.taxInsideInfo.visiable = false
    },
    handleIdCardTypeChange (value) {
      this.queryParams.idCardType = value || ''
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
          that.$delete('taxInside/' + that.selectedRowKeys.join(',')).then(() => {
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
      let { sortedInfo, filteredInfo } = this
      let sortField, sortOrder, pageSize, params
      params = {...this.queryParams}
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
      if (params.nowMonth) {
        params.year = params.nowMonth.format('YYYY')
        params.month = params.nowMonth.format('MM')
        params.monthArr = this.monthData.slice(0, this.monthData.indexOf(params.month) + 1).join()
        delete params.nowMonth
      }
      this.$export('taxInside/excel', {
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...params,
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
      this.queryParams = {
        nowMonth: moment()
      }
      this.fetch({...this.queryParams})
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
      this.$get('dict/cy_tax', {
      }).then((r) => {
        let dictList = {}
        r.data.forEach((item) => {
          let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
          if (dictList[fieldName]) {
            dictList[fieldName][item.keyy] = item.valuee
          } else {
            dictList[fieldName] = {[item.keyy]: item.valuee}
          }
        })
        this.dictData = dictList
        this.fetch({...this.queryParams})
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
      if (params.nowMonth) {
        params.year = params.nowMonth.format('YYYY')
        params.month = params.nowMonth.format('MM')
        params.monthArr = this.monthData.slice(0, this.monthData.indexOf(params.month) + 1).join()
        delete params.nowMonth
      }
      this.$get('taxInside', {
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

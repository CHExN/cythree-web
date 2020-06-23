<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="编制类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select v-model="insOut">
                  <a-select-option value="2">全部</a-select-option>
                  <a-select-option value="0">编内</a-select-option>
                  <a-select-option value="1">编外</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="月份"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-month-picker
                  v-model="nowMonth"
                  style="width: 100%;"
                  :allowClear="false"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="姓名"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.name"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.idNum"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'insurance:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'insurance:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'insurance:export','insurance:add'">
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'insurance:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="beforeUpload">导入Excel</a-upload>
            </a-menu-item>
            <!-- <a-menu-item v-hasPermission="'insurance:export'" key="export-data" @click="exportExcel">导出Excel</a-menu-item> -->
            <a-menu-item v-hasPermission="'insurance:export'" key="export-detail" @click="showModal">导出明细</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择月份"
          v-model="modalVisible2"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="importExcel"
          okText="提交">
          <a-month-picker
            style="width: 100%;"
            @change="handleYearMonthChange2"
          />
        </a-modal>
        <a-modal
          title="选择导出日期"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportDetail"
          okText="提交">
          <div style="width: 100%; margin-top: -20px; margin-bottom: 10px">
            <a-radio-group @change="onRadioChange" v-model="radioValue">
              <a-radio-button :value="true">月选</a-radio-button>
              <a-radio-button :value="false">范围</a-radio-button>
            </a-radio-group>
          </div>
          <a-month-picker
            style="width: 100%;"
            v-if="radioValue"
            @change="handleMonthChange"
          />
          <a-range-picker
            v-else
            format="YYYY-MM"
            :placeholder="['开始月份', '结束月份']"
            :value="monthValue"
            :mode="mode"
            @panelChange="handlePanelChange"
          />
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
        <template slot="insuranceNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'insurance:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'insurance:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 新增保险信息 -->
    <insurance-add
      :insuranceAddVisiable="insuranceAdd.visiable"
      @close="handleInsuranceAddClose"
      @success="handleInsuranceAddSuccess">
    </insurance-add>
    <!-- 修改保险信息 -->
    <insurance-edit
      ref="insuranceEdit"
      :insuranceEditVisiable="insuranceEdit.visiable"
      @close="handleInsuranceEditClose"
      @success="handleInsuranceEditSuccess">
    </insurance-edit>
    <!-- 保险详细信息 -->
    <insurance-info
      :insuranceInfoData="insuranceInfo.data"
      :insuranceInfoVisiable="insuranceInfo.visiable"
      @close="handleInsuranceInfoClose">
    </insurance-info>
    <!-- 导入结果 -->
    <insurance-import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :insuranceImportResultVisible="insuranceImportResultVisible">
    </insurance-import-result>
  </a-card>
</template>
<script>
import InsuranceAdd from './InsuranceAdd'
import InsuranceEdit from './InsuranceEdit'
import InsuranceInfo from './InsuranceInfo'
import InsuranceImportResult from './InsuranceImportResult'
import { newSpread, fixedForm, saveExcel } from '@/utils/spreadJS'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'Insurance',
  components: { InsuranceAdd, InsuranceEdit, InsuranceInfo, InsuranceImportResult },
  data () {
    return {
      insOut: '2',
      nowMonth: moment(),
      radioValue: true,
      modalVisible: false,
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      dateTitle: '',
      monthValue: [],
      monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      mode: ['month', 'month'],
      modalVisible2: false,
      fileList: [],
      file: '',
      importData: [],
      times: '',
      errors: [],
      insuranceImportResultVisible: false,
      advanced: false,
      insuranceAdd: {
        visiable: false,
        data: {}
      },
      insuranceEdit: {
        visiable: false,
        data: {}
      },
      insuranceInfo: {
        visiable: false,
        data: {}
      },
      dateData2: {
        dateForm: {},
        dateTo: {}
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
      return [{
        title: '序号',
        dataIndex: 'sortNum'
      }, {
        title: '编制类别',
        dataIndex: 'insideOrOutside',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '编内'
            case '1':
              return '编外'
            default:
              return text
          }
        }
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '养老保险',
        dataIndex: 'pensionInsuranceUnit'
      }, {
        title: '失业保险',
        dataIndex: 'unemploymentInsuranceUnit'
      }, {
        title: '工伤保险',
        dataIndex: 'workInjuryInsuranceUnit'
      }, {
        title: '生育保险',
        dataIndex: 'maternityInsuranceUnit'
      }, {
        title: '医疗保险',
        dataIndex: 'medicalInsuranceUnit'
      }, {
        title: '医疗互助',
        dataIndex: 'medicalMutualAidUnit'
      }, {
        title: '公疗补充',
        dataIndex: 'publicTherapySupplementUnit'
      }, {
        title: '职业年金',
        dataIndex: 'corporateAnnuityUnit'
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
    this.fetch()
  },
  methods: {
    handleMonthChange (value) {
      if (!value) {
        this.dateData.dateForm = {}
        this.dateTitle = ''
        return
      }
      this.dateData.dateForm = {
        year: value.format('YYYY'),
        month: value.format('MM')
      }
      this.dateTitle = value.format('YYYY年MM月')
    },
    handlePanelChange (value, mode) {
      let yearForm = value[0].format('YYYY')
      let yearTo = value[1].format('YYYY')
      let monthForm = value[0].format('MM')
      let monthTo = value[1].format('MM')
      if (yearForm === yearTo) {
        this.dateData.dateForm = {
          year: yearForm,
          month: this.monthData.slice(this.monthData.indexOf(monthForm), this.monthData.indexOf(monthTo) + 1).join(',')
        }
      } else {
        this.dateData.dateForm = {
          year: yearForm,
          month: this.monthData.slice(this.monthData.indexOf(monthForm)).join(',')
        }
        this.dateData.dateTo = {
          year: yearTo,
          month: this.monthData.slice(0, this.monthData.indexOf(monthTo) + 1).join(',')
        }
      }
      this.monthValue = value
      this.mode = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
      this.dateTitle = `${value[0].format('YYYY年MM月')} ~ ${value[1].format('YYYY年MM月')}`
    },
    onRadioChange (e) {
      // 切换radio时 重置日期选择data
      this.dateData = {
        dateForm: {},
        dateTo: {}
      }
      this.monthValue = []
    },
    handleClose () {
      this.insuranceImportResultVisible = false
    },
    downloadTemplate () {
      this.$download('insurance/template', {}, '保险表_导入模板.xlsx')
    },
    showModal () {
      this.modalVisible = true
    },
    beforeUpload (file) {
      this.modalVisible2 = true
      this.file = file
      return false
    },
    importExcel () {
      if (!this.dateData2.dateTo.year || !this.dateData2.dateTo.month) {
        this.$message.warning('请选择月份')
        return
      }
      this.modalVisible2 = false
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('date', `${this.dateData2.dateTo.year}-${this.dateData2.dateTo.month}`)
      this.$message.loading('处理中', 0)
      this.$upload('insurance/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.fetch()
        }
        this.file = ''
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.insuranceImportResultVisible = true
      }).catch((r) => {
        this.file = ''
        this.$message.destroy()
        console.error(r)
      })
    },
    handleYearMonthChange2 (value) {
      if (!value) {
        this.dateData2.dateTo = {}
        return
      }
      this.dateData2.dateTo = {
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
        this.queryParams.name = ''
        this.queryParams.idNum = ''
      }
    },
    add () {
      this.insuranceAdd.visiable = true
    },
    handleInsuranceAddClose () {
      this.insuranceAdd.visiable = false
    },
    handleInsuranceAddSuccess () {
      this.insuranceAdd.visiable = false
      this.$message.success('新增保险信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.insuranceEdit.setFormValues(record)
      this.insuranceEdit.visiable = true
    },
    handleInsuranceEditClose () {
      this.insuranceEdit.visiable = false
    },
    handleInsuranceEditSuccess () {
      this.insuranceEdit.visiable = false
      this.$message.success('修改保险信息成功')
      this.search()
    },
    view (record) {
      this.insuranceInfo.data = record
      this.insuranceInfo.visiable = true
    },
    handleInsuranceInfoClose () {
      this.insuranceInfo.visiable = false
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
          that.$delete('insurance/' + that.selectedRowKeys.join(',')).then(() => {
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
    exportDetail () {
      if (JSON.stringify(this.dateData.dateForm) === '{}') {
        this.$message.warning('请选择日期')
        return
      }
      this.modalVisible = false
      this.$get('insurance/insuranceSummary', {
        yearForm: this.dateData.dateForm.year,
        monthForm: this.dateData.dateForm.month,
        yearTo: this.dateData.dateTo.year,
        monthTo: this.dateData.dateTo.month
      }).then((r) => {
        let data = {
          title: `${this.dateTitle}社保实际缴费金额`,
          pensionInsuranceIndividual0: r.data[0].pensionInsuranceIndividual,
          unemploymentInsuranceIndividual0: r.data[0].unemploymentInsuranceIndividual,
          medicalInsuranceIndividual0: r.data[0].medicalInsuranceIndividual,
          medicalMutualAidIndividual0: r.data[0].medicalMutualAidIndividual,
          corporateAnnuityIndividual0: r.data[0].corporateAnnuityIndividual,
          pensionInsuranceUnit0: r.data[0].pensionInsuranceUnit,
          unemploymentInsuranceUnit0: r.data[0].unemploymentInsuranceUnit,
          workInjuryInsuranceUnit0: r.data[0].workInjuryInsuranceUnit,
          maternityInsuranceUnit0: r.data[0].maternityInsuranceUnit,
          medicalInsuranceUnit0: r.data[0].medicalInsuranceUnit,
          medicalMutualAidUnit0: r.data[0].medicalMutualAidUnit,
          publicTherapySupplementUnit0: r.data[0].publicTherapySupplementUnit,
          corporateAnnuityUnit0: r.data[0].corporateAnnuityUnit,

          pensionInsuranceIndividual1: r.data[1].pensionInsuranceIndividual,
          unemploymentInsuranceIndividual1: r.data[1].unemploymentInsuranceIndividual,
          medicalInsuranceIndividual1: r.data[1].medicalInsuranceIndividual,
          medicalMutualAidIndividual1: r.data[1].medicalMutualAidIndividual,
          corporateAnnuityIndividual1: r.data[1].corporateAnnuityIndividual,
          pensionInsuranceUnit1: r.data[1].pensionInsuranceUnit,
          unemploymentInsuranceUnit1: r.data[1].unemploymentInsuranceUnit,
          workInjuryInsuranceUnit1: r.data[1].workInjuryInsuranceUnit,
          maternityInsuranceUnit1: r.data[1].maternityInsuranceUnit,
          medicalInsuranceUnit1: r.data[1].medicalInsuranceUnit,
          medicalMutualAidUnit1: r.data[1].medicalMutualAidUnit,
          publicTherapySupplementUnit1: r.data[1].publicTherapySupplementUnit,
          corporateAnnuityUnit1: r.data[1].corporateAnnuityUnit
        }
        this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
          let spread = newSpread('Insurance')
          spread = fixedForm(spread, 'Insurance', data)
          let fileName = `社保实际缴费金额_${this.dateTitle}.xlsx`
          saveExcel(spread, fileName)
        })
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
      this.$export('insurance/excel', {
        insideOrOutside: this.insOut,
        year: this.nowMonth.format('YYYY'),
        monthL: this.nowMonth.format('MM'),
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
      // 重置日期选择data
      this.dateData2 = {
        dateForm: {},
        dateTo: {}
      }
      // 重置月份
      this.nowMonth = moment()
      // 重置编制类别
      this.insOut = '2'
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
      if (this.nowMonth) {
        params.year = this.nowMonth.format('YYYY')
        params.month = this.nowMonth.format('MM')
      }
      this.$get('insurance', {
        insideOrOutside: this.insOut,
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

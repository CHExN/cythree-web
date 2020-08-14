<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="物资类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleTypeApplicationChange">
                  <a-select-option v-for="i in Object.keys(dictData.typeApplication||[])" :key="i">{{ dictData.typeApplication[i] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.num"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="申请日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="经办人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.handle"/>
                </a-form-item>
              </a-col>
              <!-- <a-col :md="12" :sm="24" >
                <a-form-item
                  label="申请部门负责人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.appDept"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="采购部门负责人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.purDept"/>
                </a-form-item>
              </a-col> -->
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'application:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'application:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'application:export'">
          <a-menu slot="overlay">
            <a-menu-item key="application-export-data" @click="exportApplication">导出申请单</a-menu-item>
            <a-menu-item key="plan-export-data" @click="exportPlan">导出计划单</a-menu-item>
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
               rowKey="id"
               @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'application:edit'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'application:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'application:update'" v-if="record.process===0 && record.review.split(',')[record.step-1]===user.username"
            type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
          <a-icon
            v-if="record.process===1 && (
                  (user.username==='wxclkg' && record.typeApplication==='4') ||
                  (user.username==='lbbjkg' && (record.typeApplication==='1' || record.typeApplication==='2')) ||
                  (user.username==='xzhqbm' && (record.typeApplication==='3' || record.typeApplication==='5' || record.typeApplication==='6' || record.typeApplication==='7' || record.typeApplication==='8' || record.typeApplication==='9')) ||
                  (user.username==='captain' || user.username==='vice' || user.username==='xzhisoft'))"
            v-hasPermission="'storeroomPut:add'"
            type="database" theme="twoTone" twoToneColor="#01c9c4" @click="storage(record)" title="入库"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 采购申请信息查看 -->
    <application-info
      :applicationInfoData="applicationInfo.data"
      :applicationInfoVisiable="applicationInfo.visiable"
      @close="handleApplicationInfoClose">
    </application-info>
    <!-- 新增采购申请 -->
    <application-add
      :dictData="dictData"
      :applicationAddVisiable="applicationAdd.visiable"
      @close="handleApplicationAddClose"
      @success="handleApplicationAddSuccess">
    </application-add>
    <!-- 修改采购申请 -->
    <application-edit
      ref="applicationEdit"
      :dictData="dictData"
      :applicationEditVisiable="applicationEdit.visiable"
      @close="handleApplicationEditClose"
      @success="handleApplicationEditSuccess">
    </application-edit>
    <!-- 入库 -->
    <put-add
      ref="putAdd"
      :putAddVisiable="putAdd.visiable"
      @close="handlePutAddClose"
      @success="handlePutAddSuccess">
    </put-add>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import ApplicationInfo from './ApplicationInfo'
import ApplicationAdd from './ApplicationAdd'
import ApplicationEdit from './ApplicationEdit'
import PutAdd from '../storeroomPut/StoreroomPutAdd'
import { mapState } from 'vuex'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'Application',
  components: { RangeDate, ApplicationInfo, ApplicationAdd, ApplicationEdit, PutAdd },

  data () {
    return {
      advanced: false,
      applicationInfo: {
        visiable: false,
        data: {}
      },
      applicationAdd: {
        visiable: false
      },
      applicationEdit: {
        visiable: false
      },
      putAdd: {
        visiable: false
      },
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      dictData: {},
      putingData: {},
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
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [{
        title: '编号',
        dataIndex: 'num',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'num' && sortedInfo.order
      }, {
        title: '物资类别',
        dataIndex: 'typeApplication',
        customRender: (text, row, index) => {
          return this.dictData.typeApplication[text]
        }
      }, {
        title: '申请部门',
        dataIndex: 'deptName'
      }, {
        title: '申请日期',
        dataIndex: 'createDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createDate' && sortedInfo.order
      }, {
        title: '流程状态',
        dataIndex: 'process',
        customRender: (text, row, index) => {
          switch (text) {
            case 2:
              return <a-tag color="green">已入库</a-tag>
            case 1:
              return <a-tag color="cyan">已通过</a-tag>
            case 0:
              return <a-tag color="purple">待审核</a-tag>
            case -1:
              return <a-tag color="pink">未通过</a-tag>
            default:
              return text
          }
        },
        filters: [
          { text: '未通过', value: '-1' },
          { text: '待审核', value: '0' },
          { text: '已通过', value: '1' },
          { text: '已入库', value: '2' }
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.process || null
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 150
      }]
    }
  },
  mounted () {
    this.loadSelect()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.handle = ''
        // this.queryParams.appDept = ''
        // this.queryParams.purDept = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    isPass (is, record) {
      let data = {
        id: record.id,
        num: record.num,
        createDate: record.createDate,
        typeApplication: record.typeApplication,
        process: 0,
        username: record.username
      }
      if (is) {
        if (record.review.split(',').length === record.step) { data.process = 1 } else { data.step = record.step + 1 }
      } else {
        data.process = -1
      }
      this.loading = true
      this.$put('application', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
      })
    },
    view (record) {
      Object.keys(this.dictData).forEach(key => {
        record[key + 'ToDict'] = this.dictData[key][record[key]]
      })
      this.applicationInfo.data = record
      this.applicationInfo.visiable = true
    },
    add () {
      this.applicationAdd.visiable = true
    },
    handleApplicationAddClose () {
      this.applicationAdd.visiable = false
    },
    handleApplicationAddSuccess () {
      this.applicationAdd.visiable = false
      this.$message.success('新增采购申请成功')
      this.search()
    },
    edit (record) {
      this.$refs.applicationEdit.setFormValues(record)
      this.applicationEdit.visiable = true
    },
    handleApplicationEditClose () {
      this.applicationEdit.visiable = false
    },
    handleApplicationEditSuccess () {
      this.applicationEdit.visiable = false
      this.$message.success('修改采购申请成功')
      this.search()
    },
    storage (record) {
      this.putingData = record
      this.$get('application/applicationPlan', {
        applicationId: this.putingData.id,
        status: true
      }).then((r) => {
        this.$refs.putAdd.setTableValues(record.typeApplication, record.id, r.data)
      })
      this.putAdd.visiable = true
    },
    handlePutAddClose () {
      this.putAdd.visiable = false
    },
    handlePutAddSuccess (isProcess) {
      this.putAdd.visiable = false
      this.$message.success('新增入库成功')
      if (isProcess) {
        this.loading = true
        this.$put('application', {
          num: this.putingData.num,
          id: this.putingData.id,
          typeApplication: this.putingData.typeApplication,
          username: this.putingData.username,
          process: 2
        }).then((r) => {
          this.search()
          this.putingData = {}
        })
      }
    },
    handleApplicationInfoClose () {
      this.applicationInfo.visiable = false
    },
    handleTypeApplicationChange (value) {
      this.queryParams.typeApplication = value || ''
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    loadSelect () {
      this.$get('dict/cy_application', {
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
        this.fetch()
      })
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
          that.$delete('application/' + that.selectedRowKeys.join(',')).then(() => {
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
    exportApplication () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      let newData = []
      this.selectedRows.forEach(item => {
        let data = {
          num: `NO.${item.num || ''}`,
          typeApplicationToDict: this.dictData.typeApplication[item.typeApplication],
          deptName: item.deptName,
          handle: item.handle,
          description: `采购说明 (采购用途、采购数量、功能要求等): ${item.description || ''}`,
          isIn: `采购计划:（ 内□ / 外□ ）`
        }
        this.$get('application/applicationPlan', {
          applicationId: item.id
        }).then((r) => {
          let planStrings = []
          r.data.forEach(item => planStrings.push(`${item.name}:${item.amount} ${item.unit}`.replace(/[（]/g, '(').replace(/[）]/g, ')')))
          if (item.money) planStrings.push(`预计金额: ${item.money}`)
          data.money1 = `${planStrings.length > 0 ? '采购计划:\n' : ''}${planStrings.slice(0, 27).join('\n')}`
          data.money2 = `${planStrings.length > 27 ? '\n' : ''}${planStrings.slice(27, 54).join('\n')}`
          data.money3 = `${planStrings.length > 54 ? '\n' : ''}${planStrings.slice(54).join('\n')}`
          newData.push(data)
        })
      })
      this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
        newData.forEach(item => {
          let spread = newSpread('Application')
          spread = fixedForm(spread, 'Application', item)
          let fileName = `采购申请单_${item.num}.xlsx`
          saveExcel(spread, fileName)
        })
      })
    },
    exportPlan () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      let newData = []
      let planArr = {}
      this.selectedRows.forEach(item => {
        newData.push({
          num: item.num,
          id: item.id,
          typeApplicationToDict: `类别:${this.dictData.typeApplication[item.typeApplication] || ''}`,
          deptName: `部门:${item.deptName || ''}`,
          purDept: `采购部门负责人:${item.purDept || ''}`, // 采购部门负责人
          appDept: `申请部门负责人:${item.appDept || ''}`, // 申请部门负责人
          handle: `经办人:${item.handle || ''}`,
          date: `日期:${item.createDate || ''}`
        })
        this.$get('application/applicationPlan', {
          applicationId: item.id
        }).then((r) => {
          let arr = []
          r.data.forEach((item, index) => {
            arr.push([
              index + 1, // 序号
              item.name, // 物品名称
              '', // 空格
              '', // 因为‘物品名称’这一项在excel里占了三列
              item.type, // 型号
              item.unit, // 单位
              item.amount,
              item.remark
            ])
          })
          planArr[item.id] = arr
        })
      })
      this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
        newData.forEach(item => {
          let spread = newSpread('Plan')
          spread = fixedForm(spread, 'Plan', item)
          spread = floatForm(spread, 'Plan', planArr[item.id])
          let fileName = `采购计划单_${item.num}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'Plan', planArr[item.id].length)
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
      this.queryParams = {
        createTimeFrom: '',
        createTimeTo: ''
      }
      this.putingData = {}
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.applicationInfo.visiable = false
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
      this.$get('application', {
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

<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="申请日期"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <range-date @change="handleDateChange" ref="createTime"></range-date>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin: 3px auto 1em;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button type="primary" ghost @click="add" v-hasPermission="'officeSupplies:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'officeSupplies:delete'">删除</a-button>
        <a-button v-hasPermission="'officeSupplies:view'" @click="exportExcel">导出申领单</a-button>
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
          <a-icon v-hasPermission="'officeSupplies:edit'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'officeSupplies:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'officeSupplies:update'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"
              v-if="record.process===0 && record.review.split(',')[record.step-1]===user.username"></a-icon>
          </a-popconfirm>
          <a-icon v-hasPermission="'storeroomPut:add'" type="database" theme="twoTone" twoToneColor="#01c9c4" @click="storage(record)" title="入库"
            v-if="record.process===1 && user.username!=='wxclkg' && user.username!=='lbbjkg'"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 办公用品申请信息查看 -->
    <office-supplies-info
      :officeSuppliesInfoData="officeSuppliesInfo.data"
      :officeSuppliesInfoVisiable="officeSuppliesInfo.visiable"
      @close="handleOfficeSuppliesInfoClose">
    </office-supplies-info>
    <!-- 新增办公用品申请 -->
    <office-supplies-add
      :officeSuppliesAddVisiable="officeSuppliesAdd.visiable"
      @close="handleOfficeSuppliesAddClose"
      @success="handleOfficeSuppliesAddSuccess">
    </office-supplies-add>
    <!-- 修改办公用品申请信息 -->
    <office-supplies-edit
      ref="officeSuppliesEdit"
      :officeSuppliesEditVisiable="officeSuppliesEdit.visiable"
      @close="handleOfficeSuppliesEditClose"
      @success="handleOfficeSuppliesEditSuccess">
    </office-supplies-edit>
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
import OfficeSuppliesInfo from './OfficeSuppliesInfo'
import OfficeSuppliesAdd from './OfficeSuppliesAdd'
import OfficeSuppliesEdit from './OfficeSuppliesEdit'
import PutAdd from '../storeroomPut/StoreroomPutAdd'
import { mapState } from 'vuex'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'OfficeSupplies',
  components: { RangeDate, OfficeSuppliesInfo, OfficeSuppliesAdd, OfficeSuppliesEdit, PutAdd },

  data () {
    return {
      advanced: false,
      officeSuppliesInfo: {
        visiable: false,
        data: {}
      },
      officeSuppliesAdd: {
        visiable: false
      },
      officeSuppliesEdit: {
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
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    isPass (is, record) {
      let data = {
        id: record.id,
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
      this.officeSuppliesInfo.data = record
      this.officeSuppliesInfo.visiable = true
    },
    add () {
      this.officeSuppliesAdd.visiable = true
    },
    handleOfficeSuppliesAddClose () {
      this.officeSuppliesAdd.visiable = false
    },
    handleOfficeSuppliesAddSuccess () {
      this.officeSuppliesAdd.visiable = false
      this.$message.success('新增办公用品申请成功')
      this.search()
    },
    edit (record) {
      this.$refs.officeSuppliesEdit.setFormValues(record)
      this.officeSuppliesEdit.visiable = true
    },
    handleOfficeSuppliesEditClose () {
      this.officeSuppliesEdit.visiable = false
    },
    handleOfficeSuppliesEditSuccess () {
      this.officeSuppliesEdit.visiable = false
      this.$message.success('修改办公用品申请成功')
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
          createDate: this.putingData.createDate,
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
    handleOfficeSuppliesInfoClose () {
      this.officeSuppliesInfo.visiable = false
    },
    handleTypeOfficeSuppliesChange (value) {
      this.queryParams.typeApplication = value || ''
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
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
    exportExcel () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      this.$message.loading('正在生成', 2)
      this.selectedRows.forEach((item, index) => {
        let dateArr = item.createDate.split('-')
        let date = `${dateArr[0]}年${dateArr[1]}月`
        this.$get('application/applicationPlan', { applicationId: item.id }).then((r) => {
          let planArr = []
          r.data.forEach(item => {
            planArr.push([
              item.name,
              item.type,
              item.amount,
              date,
              item.remark
            ])
          })
          let spread = newSpread('OfficeSuppliesApplicationForm')
          spread = fixedForm(spread, 'OfficeSuppliesApplicationForm', {deptName: `部门: ${item.deptName}`, date})
          spread = floatForm(spread, 'OfficeSuppliesApplicationForm', planArr)
          let fileName = `办公用品申领单_${item.deptName}_${date}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'OfficeSuppliesApplicationForm', planArr.length)
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
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.officeSuppliesInfo.visiable = false
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
        ...params,
        typeApplication: '3' // 办公用品
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

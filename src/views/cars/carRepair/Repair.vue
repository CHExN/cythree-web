<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="车牌号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.carNum"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="报修人"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.reporter"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="报修日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'carRepair:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'carRepair:delete'">删除</a-button>
        <a-button @click="exportExcel" v-hasPermission="'carRepair:export'">导出Excel</a-button>
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
        <template slot="carNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'carRepair:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-if="record.process===0" v-hasPermission="'carRepair:update','carRepair:review'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
          <a-badge v-hasNoPermission="'carRepair:update','carRepair:review'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增 -->
    <repair-add
      :repairAddVisiable="repairAdd.visiable"
      @close="handleRepairAddClose"
      @success="handleRepairAddSuccess">
    </repair-add>
    <!-- 修改 -->
    <repair-edit
      ref="repairEdit"
      @close="handleRepairEditClose"
      @success="handleRepairEditSuccess"
      :repairEditVisiable="repairEdit.visiable">
    </repair-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import RepairAdd from './RepairAdd'
import RepairEdit from './RepairEdit'

export default {
  name: 'Repair',
  components: { RangeDate, RepairAdd, RepairEdit },

  data () {
    return {
      advanced: false,
      repairAdd: {
        visiable: false
      },
      repairEdit: {
        visiable: false
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
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '报修日期',
        dataIndex: 'date'
      }, {
        title: '车牌号',
        dataIndex: 'carNum',
        scopedSlots: { customRender: 'carNum' }
      }, {
        title: '报修人',
        dataIndex: 'reporter'
      }, {
        title: '部门',
        dataIndex: 'deptName'
      }, {
        title: '驾驶员',
        dataIndex: 'dirver'
      }, {
        title: '状态',
        dataIndex: 'process',
        customRender: (text, row, index) => {
          switch (text) {
            case -1:
              return <a-tag color="pink">未通过</a-tag>
            case 0:
              return <a-tag color="purple">待审核</a-tag>
            case 1:
              return <a-tag color="cyan">已通过</a-tag>
            default:
              return text
          }
        },
        filters: [
          { text: '未通过', value: '-1' },
          { text: '待审核', value: '0' },
          { text: '已通过', value: '1' }
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.process || null
      }, {
        title: '故障描述',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' },
        width: 200
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    add () {
      this.repairAdd.visiable = true
    },
    handleRepairAddClose () {
      this.repairAdd.visiable = false
    },
    handleRepairAddSuccess () {
      this.repairAdd.visiable = false
      this.$message.success('新增车辆报修申请成功')
      this.search()
    },
    edit (record) {
      this.$refs.repairEdit.setFormValues(record)
      this.repairEdit.visiable = true
    },
    handleRepairEditClose () {
      this.repairEdit.visiable = false
    },
    handleRepairEditSuccess () {
      this.repairEdit.visiable = false
      this.$message.success('修改车辆报修申请成功')
      this.search()
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    isPass (is, record) {
      let data = {
        id: record.id,
        process: is ? 1 : -1
      }
      this.loading = true
      this.$put('repair', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
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
          that.$delete('repair/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$export('repair/excel', {
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
      this.$get('repair', {
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

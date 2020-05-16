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
                label="公厕状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.status"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="公厕编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="开始范围"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleStartDateChange" ref="startDate"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="结束范围"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleEndDateChange" ref="endDate"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'wcStatus:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'wcStatus:delete'">删除</a-button>
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
          <a-icon v-hasPermission="'wcStatus:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <a-badge v-hasNoPermission="'wcStatus:update'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增公厕状态 -->
    <wc-status-add
      :wcStatusAddVisiable="wcStatusAdd.visiable"
      @close="handleWcStatusAddClose"
      @success="handleWcStatusAddSuccess">
    </wc-status-add>
    <!-- 修改公厕状态 -->
    <wc-status-edit
      ref="wcStatusEdit"
      :wcStatusEditVisiable="wcStatusEdit.visiable"
      @close="handleWcStatusEditClose"
      @success="handleWcStatusEditSuccess">
    </wc-status-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import WcStatusAdd from './WcStatusAdd'
import WcStatusEdit from './WcStatusEdit'

export default {
  name: 'WcStatus',
  components: { RangeDate, WcStatusAdd, WcStatusEdit },
  data () {
    return {
      advanced: false,
      wcStatusAdd: {
        visiable: false,
        data: {}
      },
      wcStatusEdit: {
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
        dataIndex: 'wcName'
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum'
      }, {
        title: '公厕状态',
        dataIndex: 'status'
      }, {
        title: '开始日期',
        dataIndex: 'startDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order
      }, {
        title: '结束日期',
        dataIndex: 'endDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order
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
        this.queryParams.wcNum = ''
        this.queryParams.startDateFrom = ''
        this.queryParams.startDateTo = ''
        this.queryParams.endDateFrom = ''
        this.queryParams.endDateTo = ''
      }
    },
    add () {
      this.wcStatusAdd.visiable = true
    },
    handleWcStatusAddClose () {
      this.wcStatusAdd.visiable = false
    },
    handleWcStatusAddSuccess () {
      this.wcStatusAdd.visiable = false
      this.$message.success('新增公厕状态成功')
      this.search()
    },
    edit (record) {
      this.$refs.wcStatusEdit.setFormValues(record)
      this.wcStatusEdit.visiable = true
    },
    handleWcStatusEditClose () {
      this.wcStatusEdit.visiable = false
    },
    handleWcStatusEditSuccess () {
      this.wcStatusEdit.visiable = false
      this.$message.success('修改公厕状态成功')
      this.search()
    },
    handleStartDateChange (value) {
      if (value) {
        this.queryParams.startDateFrom = value[0]
        this.queryParams.startDateTo = value[1]
      }
    },
    handleEndDateChange (value) {
      if (value) {
        this.queryParams.endDateFrom = value[0]
        this.queryParams.endDateTo = value[1]
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
          that.$delete('wcStatus/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$export('wcStatus/excel', {
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
        this.$refs.startDate.reset()
        this.$refs.endDate.reset()
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
      this.$get('wcStatus', {
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

<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="日期"
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'carRefuel:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'carRefuel:delete'">删除</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="carRefuelId"
               @change="handleTableChange">
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'carRefuel:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <!-- &nbsp; -->
          <!-- <a-icon v-hasPermission="'carRefuel:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon> -->
          <a-badge v-hasNoPermission="'carRefuel:update'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 车辆加油信息查看 -->
    <!-- <car-refuel-info
      :carRefuelInfoData="carRefuelInfo.data"
      :carRefuelInfoVisiable="carRefuelInfo.visiable"
      @close="handleCarRefuelInfoClose">
    </car-refuel-info> -->
    <!-- 新增车辆加油信息 -->
    <car-refuel-add
      :carRefuelAddVisiable="carRefuelAdd.visiable"
      @close="handleCarRefuelAddClose"
      @success="handleCarRefuelAddSuccess">
    </car-refuel-add>
    <!-- 修改车辆加油信息 -->
    <car-refuel-edit
      ref="carRefuelEdit"
      :carRefuelEditVisiable="carRefuelEdit.visiable"
      @close="handleCarRefuelEditClose"
      @success="handleCarRefuelEditSuccess">
    </car-refuel-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
// import CarRefuelInfo from './CarRefuelInfo'
import CarRefuelAdd from './CarRefuelAdd'
import CarRefuelEdit from './CarRefuelEdit'

export default {
  name: 'CarRefuel',
  // components: {CarRefuelInfo, CarRefuelAdd, CarRefuelEdit},
  components: { CarRefuelAdd, RangeDate, CarRefuelEdit },
  data () {
    return {
      advanced: false,
      carRefuelInfo: {
        visiable: false,
        data: {}
      },
      carRefuelAdd: {
        visiable: false,
        data: {}
      },
      carRefuelEdit: {
        visiable: false,
        data: {}
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRows: [],
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
        title: '总价',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'amount' && sortedInfo.order
      }, {
        title: '总数',
        dataIndex: 'count',
        scopedSlots: { customRender: 'count' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'count' && sortedInfo.order
      }, {
        title: '日期',
        dataIndex: 'date',
        scopedSlots: { customRender: 'date' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order
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
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    view (record) {
      this.carRefuelInfo.data = record
      this.carRefuelInfo.visiable = true
    },
    add () {
      this.carRefuelAdd.visiable = true
    },
    handleCarRefuelAddClose () {
      this.carRefuelAdd.visiable = false
    },
    handleCarRefuelAddSuccess () {
      this.carRefuelAdd.visiable = false
      this.$message.success('新增车辆加油信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.carRefuelEdit.setFormValues(record.date)
      this.carRefuelEdit.visiable = true
    },
    handleCarRefuelEditClose () {
      this.carRefuelEdit.visiable = false
    },
    handleCarRefuelEditSuccess () {
      this.carRefuelEdit.visiable = false
      this.$message.success('修改车辆加油信息成功')
      this.search()
    },
    handleCarRefuelInfoClose () {
      this.carRefuelInfo.visiable = false
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
          let dates = that.selectedRows.map(e => e.date)
          that.$delete('carRefuel/' + dates.join(',')).then(() => {
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
      // 清空时间选择
      this.$refs.createTime.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.carRefuelInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
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
      this.$get('carRefuel', {
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

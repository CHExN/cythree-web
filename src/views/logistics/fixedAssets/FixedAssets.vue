<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
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
                label="联系人"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.handle"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="电话"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.num"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'fixedAssets:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'fixedAssets:delete'">删除</a-button>
        <a-button v-hasPermission="'fixedAssets:export'" @click="exportExcel">导出申请单</a-button>
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
          <a-icon v-hasPermission="'fixedAssets:edit'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'fixedAssets:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'fixedAssets:update'" v-if="record.process===0 && record.review.split(',')[record.step-1]===user.username"
              type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
          <a-icon v-hasPermission="'storeroomPut:add'" v-if="record.process===1 && user.username!=='wxclkg' && user.username!=='lbbjkg'"
            type="database" theme="twoTone" twoToneColor="#01c9c4" @click="storage(record)" title="入库"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 固定资产申请信息查看 -->
    <fixed-assets-info
      :fixedAssetsInfoData="fixedAssetsInfo.data"
      :fixedAssetsInfoVisiable="fixedAssetsInfo.visiable"
      @close="handleFixedAssetsInfoClose">
    </fixed-assets-info>
    <!-- 新增固定资产申请 -->
    <fixed-assets-add
      :fixedAssetsAddVisiable="fixedAssetsAdd.visiable"
      @close="handleFixedAssetsAddClose"
      @success="handleFixedAssetsAddSuccess">
    </fixed-assets-add>
    <!-- 修改固定资产申请 -->
    <fixed-assets-edit
      ref="fixedAssetsEdit"
      :fixedAssetsEditVisiable="fixedAssetsEdit.visiable"
      @close="handleFixedAssetsEditClose"
      @success="handleFixedAssetsEditSuccess">
    </fixed-assets-edit>
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
import FixedAssetsInfo from './FixedAssetsInfo'
import FixedAssetsAdd from './FixedAssetsAdd'
import FixedAssetsEdit from './FixedAssetsEdit'
import PutAdd from '../storeroomPut/StoreroomPutAdd'
import { mapState } from 'vuex'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'FixedAssets',
  components: { RangeDate, FixedAssetsInfo, FixedAssetsAdd, FixedAssetsEdit, PutAdd },

  data () {
    return {
      advanced: false,
      fixedAssetsInfo: {
        visiable: false,
        data: {}
      },
      fixedAssetsAdd: {
        visiable: false
      },
      fixedAssetsEdit: {
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
        title: '联系人',
        dataIndex: 'handle'
      }, {
        title: '电话',
        dataIndex: 'num'
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
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.num = ''
      }
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
      this.fixedAssetsInfo.data = record
      this.fixedAssetsInfo.visiable = true
    },
    add () {
      this.fixedAssetsAdd.visiable = true
    },
    handleFixedAssetsAddClose () {
      this.fixedAssetsAdd.visiable = false
    },
    handleFixedAssetsAddSuccess () {
      this.fixedAssetsAdd.visiable = false
      this.$message.success('新增固定资产申请成功')
      this.search()
    },
    edit (record) {
      this.$refs.fixedAssetsEdit.setFormValues(record)
      this.fixedAssetsEdit.visiable = true
    },
    handleFixedAssetsEditClose () {
      this.fixedAssetsEdit.visiable = false
    },
    handleFixedAssetsEditSuccess () {
      this.fixedAssetsEdit.visiable = false
      this.$message.success('修改固定资产申请成功')
      this.search()
    },
    storage (record) {
      this.putingData = record
      this.$get('application/applicationPlan', {
        applicationId: this.putingData.id
      }).then((r) => {
        r.data.forEach(item => {
          item.money = parseFloat(item.remark)
        })
        this.$refs.putAdd.setTableValues(record.typeApplication, r.data)
      })
      this.putAdd.visiable = true
    },
    handlePutAddClose () {
      this.putAdd.visiable = false
    },
    handlePutAddSuccess () {
      this.putAdd.visiable = false
      this.$message.success('新增入库成功')
      this.loading = true
      this.$put('application', {
        id: this.putingData.id,
        createDate: this.putingData.createDate,
        typeApplication: this.putingData.typeApplication,
        username: this.putingData.username,
        process: 2
      }).then((r) => {
        this.search()
        this.putingData = {}
      })
    },
    handleFixedAssetsInfoClose () {
      this.fixedAssetsInfo.visiable = false
    },
    handleTypeFixedAssetsChange (value) {
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
      // this.$message.loading('正在生成', 0)
      let newData = []
      let storeroomArr = {}
      this.selectedRows.forEach(item => {
        newData.push({
          id: item.id,
          deptName: item.deptName,
          createDate: item.createDate,
          handle: item.handle,
          num: item.num,
          money: item.money,
          description: item.description,
          appDept: item.appDept
        })
        this.$get('application/applicationPlan', {
          applicationId: item.id
        }).then((r) => {
          let arr = []
          r.data.forEach(item => {
            arr.push([
              '',
              item.name,
              item.amount,
              item.remark
            ])
          })
          storeroomArr[item.id] = arr
          // 这里这段代码等项目上线体验后一段时间后解释掉，还有上面的message.loadoing
          // if (this.selectedRows.length === Object.keys(storeroomArr).length) {
          //   this.$message.destroy() // 等全部执行完后，再把message全局销毁
          //   newData.forEach(item => {
          //     let spread = newSpread('FixedAssets')
          //     spread = fixedForm(spread, 'FixedAssets', item)
          //     spread = floatForm(spread, 'FixedAssets', storeroomArr[`${item.id}`])
          //     let fileName = `固定资产申请单_${item.deptName}_${item.handle}.xlsx`
          //     saveExcel(spread, fileName)
          //     floatReset(spread, 'FixedAssets', storeroomArr[`${item.id}`].length) // sheet.addRows有bug，用这个解决
          //   })
          // }
        })
      })
      // 上面解释后 下面这些删掉
      this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
        newData.forEach(item => {
          let spread = newSpread('FixedAssets')
          spread = fixedForm(spread, 'FixedAssets', item)
          spread = floatForm(spread, 'FixedAssets', storeroomArr[`${item.id}`])
          let fileName = `固定资产申请单_${item.deptName}_${item.handle}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'FixedAssets', storeroomArr[`${item.id}`].length) // sheet.addRows有bug，用这个解决
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

      this.fixedAssetsInfo.visiable = false
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
        typeApplication: 5 // 固定资产
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

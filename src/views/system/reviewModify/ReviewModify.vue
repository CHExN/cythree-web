<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <dept-input-tree @change="handleDeptChange" ref="deptTree"></dept-input-tree>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="主要信息"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.info"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="模块名"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.tableCname"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="申请时间"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="申请人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.username"/>
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
        <a-button @click="batchDelete" v-hasPermission="'reviewModify:delete'">删除</a-button>
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
          <a-icon v-hasPermission="'reviewModify:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(2,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-if="record.process==='0'" v-hasPermission="'reviewModify:review'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <!-- 申请信息查看 -->
    <reviewModify-info
      :reviewModifyInfoData="reviewModifyInfo.data"
      :reviewModifyInfoVisiable="reviewModifyInfo.visiable"
      @close="handleReviewModifyInfoClose">
    </reviewModify-info>
  </a-card>
</template>
<script>
import ReviewModifyInfo from './ReviewModifyInfo'
import RangeDate from '@/components/datetime/RangeDate'
import DeptInputTree from '../../system/dept/DeptInputTree'
import { mapState } from 'vuex'

export default {
  name: 'ReviewModify',
  components: { ReviewModifyInfo, RangeDate, DeptInputTree },

  data () {
    return {
      advanced: false,
      reviewModifyInfo: {
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
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '申请人',
        dataIndex: 'username',
        width: '10%'
      }, {
        title: '部门',
        dataIndex: 'deptName',
        width: '10%'
      }, {
        title: '模块名',
        dataIndex: 'tableCname',
        width: '10%'
      }, {
        title: '状态',
        dataIndex: 'process',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return <a-tag color="purple">待审核</a-tag>
            case '1':
              return <a-tag color="cyan">已通过</a-tag>
            case '2':
              return <a-tag color="pink">未通过</a-tag>
            case '3':
              return <a-tag color="green">已修改</a-tag>
            default:
              return text
          }
        },
        filters: [
          { text: '待审核', value: '0' },
          { text: '已通过', value: '1' },
          { text: '未通过', value: '2' },
          { text: '已修改', value: '3' }
        ],
        filterMultiple: true,
        filteredValue: filteredInfo.process || null,
        width: '10%'
      }, {
        title: '主要信息',
        dataIndex: 'info'
      }, {
        title: '申请时间',
        dataIndex: 'createTime',
        customRender: (text, row, index) => {
          return this.$tools.getDateTime(text)
        },
        width: '20%'
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
        this.queryParams.tableCname = ''
        this.queryParams.username = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    view (record) {
      this.reviewModifyInfo.data = record
      this.reviewModifyInfo.visiable = true
    },
    handleReviewModifyInfoClose () {
      this.reviewModifyInfo.visiable = false
    },
    handleDeptChange (value) {
      this.queryParams.deptId = value || ''
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    isPass (process, record) {
      let data = {
        tableCname: record.tableCname,
        info: record.info,
        username: record.username,
        id: record.id,
        process
      }
      this.loading = true
      this.$put('reviewModify', {
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
          that.$delete('reviewModify/' + that.selectedRowKeys.join(',')).then(() => {
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
      // 清空部门树选择
      this.$refs.deptTree.reset()
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

      this.reviewModifyInfo.visiable = false
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
      this.$get('reviewModify', {
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

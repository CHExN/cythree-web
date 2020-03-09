<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="创建时间"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <range-date @change="handleDateChange" ref="createTime"></range-date>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <dept-input-tree @change="handleDeptChange" ref="deptTree"></dept-input-tree>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'letter:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'letter:delete'">删除</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="letterId"
               @change="handleTableChange">
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'letter:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'letter:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'letter:review'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"
              v-if="record.process===0 && record.review.split(',')[record.step-1]===user.username"></a-icon>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <!-- 信息查看 -->
    <letter-info
      :letterInfoData="letterInfo.data"
      :letterInfoVisiable="letterInfo.visiable"
      @close="handleLetterInfoClose">
    </letter-info>
    <!-- 新增 -->
    <letter-add
      :letterAddVisiable="letterAdd.visiable"
      @close="handleLetterAddClose"
      @success="handleLetterAddSuccess">
    </letter-add>
    <!-- 修改 -->
    <letter-edit
      ref="letterEdit"
      @close="handleLetterEditClose"
      @success="handleLetterEditSuccess"
      :letterEditVisiable="letterEdit.visiable">
    </letter-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import DeptInputTree from '../../system/dept/DeptInputTree'
import LetterInfo from './LetterInfo'
import LetterAdd from './LetterAdd'
import LetterEdit from './LetterEdit'
import { mapState } from 'vuex'

export default {
  name: 'Letter',
  components: { RangeDate, DeptInputTree, LetterInfo, LetterAdd, LetterEdit },

  data () {
    return {
      advanced: false,
      letterInfo: {
        visiable: false,
        data: {}
      },
      letterAdd: {
        visiable: false
      },
      letterEdit: {
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
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '部门',
        dataIndex: 'deptName'
      }, {
        title: '介绍信人',
        dataIndex: 'letterUser'
      }, {
        title: '流程状态',
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
        title: '备注',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' },
        width: 200
      }, {
        title: '创建日期',
        dataIndex: 'dateTime'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        width: 150
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
    isPass (is, record) {
      let data = {
        letterId: record.letterId,
        process: 0
      }
      if (is) {
        if (record.review.split(',').length === record.step) { data.process = 1 } else { data.step = record.step + 1 }
      } else {
        data.process = -1
      }
      this.loading = true
      this.$put('letter', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
      })
    },
    view (record) {
      this.letterInfo.data = record
      this.letterInfo.visiable = true
    },
    add () {
      this.letterAdd.visiable = true
    },
    handleLetterAddClose () {
      this.letterAdd.visiable = false
    },
    handleLetterAddSuccess () {
      this.letterAdd.visiable = false
      this.$message.success('新增申请介绍信成功')
      this.search()
    },
    edit (record) {
      this.$refs.letterEdit.setFormValues(record)
      this.letterEdit.visiable = true
    },
    handleLetterEditClose () {
      this.letterEdit.visiable = false
    },
    handleLetterEditSuccess () {
      this.letterEdit.visiable = false
      this.$message.success('修改申请介绍信成功')
      this.search()
    },
    handleLetterInfoClose () {
      this.letterInfo.visiable = false
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
          that.$delete('letter/' + that.selectedRowKeys.join(',')).then(() => {
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
      // 清空时间选择
      this.$refs.createTime.reset()
      // 清空部门树选择
      this.$refs.deptTree.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.letterInfo.visiable = false
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
      this.$get('letter', {
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

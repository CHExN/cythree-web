<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="合同名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.contractName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="承办部门"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <dept-input-tree @change="handleDeptChange" ref="deptTree"></dept-input-tree>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="合同编号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.contractNum"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'contract:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'contract:delete'">删除</a-button>
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
          <a-icon v-hasPermission="'contract:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'contract:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'contract:update'" v-if="isReview(record)"
            type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"></a-icon>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <!-- 合同联审单信息查看 -->
    <contract-info
      :contractInfoData="contractInfo.data"
      :contractInfoVisiable="contractInfo.visiable"
      @close="handleContractInfoClose">
    </contract-info>
    <!-- 新增合同联审单 -->
    <contract-add
      :contractAddVisiable="contractAdd.visiable"
      @close="handleContractAddClose"
      @success="handleContractAddSuccess">
    </contract-add>
    <!-- 修改合同联审单 -->
    <contract-edit
      ref="contractEdit"
      :contractEditVisiable="contractEdit.visiable"
      @close="handleContractEditClose"
      @success="handleContractEditSuccess">
    </contract-edit>
  </a-card>
</template>
<script>
import ContractInfo from './ContractInfo'
import ContractAdd from './ContractAdd'
import ContractEdit from './ContractEdit'
import DeptInputTree from '../../system/dept/DeptInputTree'
import { mapState } from 'vuex'

export default {
  name: 'Contract',
  components: { ContractInfo, ContractAdd, ContractEdit, DeptInputTree },

  data () {
    return {
      advanced: false,
      contractInfo: {
        visiable: false,
        data: {}
      },
      contractAdd: {
        visiable: false
      },
      contractEdit: {
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
        title: '承办部门',
        dataIndex: 'deptName'
      }, {
        title: '合同名称',
        dataIndex: 'contractName'
      }, {
        title: '合同编号',
        dataIndex: 'contractNum'
      }, {
        title: '合同伙伴',
        dataIndex: 'contractPartner'
      }, {
        title: '合同金额',
        dataIndex: 'contractAmount',
        customRender: (text, row, index) => {
          return this.$tools.addZero(this.$tools.toNumFormant(text)) + ' 元'
        }
      }, {
        title: '招标否',
        dataIndex: 'isTender',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return <a-tag>否</a-tag>
            case '1':
              return <a-tag>是</a-tag>
            default:
              return text
          }
        },
        filters: [
          { text: '是', value: '1' },
          { text: '否', value: '0' }
        ],
        filterMultiple: false,
        filteredValue: filteredInfo.isTender || null
      }, {
        title: '流程状态',
        dataIndex: 'process',
        customRender: (text, row, index) => {
          switch (text) {
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
          { text: '已通过', value: '1' }
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.contractNum = ''
      }
    },
    isReview (record) {
      if (record.process === -1 || record.process === 1) {
        return false
      }
      const username = this.user.username
      const reviewArr = record.review.split(',')
      const { isInitiate, isFinance } = record // 发起部门 与 财务

      if (isInitiate === 1 && isFinance === 1) { // 逐一审核
        return reviewArr[record.step - 1] === username
      } else { // 联合审核
        return (isInitiate === 0 && username === record.username) || // 判断是否属于法务与关联部门审核(但实际是发起部门自己联系，所以就这样判断)
               (isFinance === 0 && username === 'finance') // 判断是否是属于财务审核
      }
    },
    isPass (is, record) {
      const username = this.user.username
      const reviewArr = record.review.split(',')
      let data = { id: record.id }
      if (is) {
        if (record.isInitiate === 1 && record.isFinance === 1) { // 逐一审核
          if (reviewArr.length === record.step) {
            data.process = 1
          } else {
            data.step = record.step + 1
          }
        } else { // 联合审核
          if (username === record.username) {
            data.isInitiate = 1
          } else if (username === 'finance') {
            data.isFinance = 1
          }
        }
      } else {
        data.process = -1
      }
      this.loading = true
      this.$put('contract', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
      })
    },
    view (record) {
      this.contractInfo.data = record
      this.contractInfo.visiable = true
    },
    add () {
      this.contractAdd.visiable = true
    },
    handleContractAddClose () {
      this.contractAdd.visiable = false
    },
    handleContractAddSuccess () {
      this.contractAdd.visiable = false
      this.$message.success('新增合同联审单成功')
      this.search()
    },
    edit (record) {
      this.$refs.contractEdit.setFormValues(record)
      this.contractEdit.visiable = true
    },
    handleContractEditClose () {
      this.contractEdit.visiable = false
    },
    handleContractEditSuccess () {
      this.contractEdit.visiable = false
      this.$message.success('修改合同联审单成功')
      this.search()
    },
    handleContractInfoClose () {
      this.contractInfo.visiable = false
    },
    handleDeptChange (value) {
      this.queryParams.deptId = value || ''
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
          that.$delete('contract/' + that.selectedRowKeys.join(',')).then(() => {
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
      // 清空部门树选择
      this.$refs.deptTree.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.contractInfo.visiable = false
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
      this.$get('contract', {
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

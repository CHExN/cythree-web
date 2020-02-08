<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
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
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="无固定期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.isFixedPeriod"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="续签备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remarkRenew"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'contractOutside:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'contractOutside:delete'">删除</a-button>
        <a-button @click="exportExcel" v-hasPermission="'contractOutside:export'">导出Excel</a-button>
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
        <template slot="contractPeriod" slot-scope="text, record">
          <span>{{record.isFixedPeriod==='0' ? '无固定' : text.split(',').length}}期</span>
        </template>
        <template slot="jobAgreement" slot-scope="text">
          <span>{{text.split(',').length}}期</span>
        </template>
        <!-- <template slot="contractPeriod" slot-scope="text">
          <span>{{text.replace(/,/g, '; ')}}</span>
        </template> -->
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'contractOutside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'contractOutside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 编外合同信息查看 -->
    <contract-outside-info
      :contractOutsideInfoData="contractOutsideInfo.data"
      :contractOutsideInfoVisiable="contractOutsideInfo.visiable"
      @close="handleContractOutsideInfoClose">
    </contract-outside-info>
    <!-- 新增编外合同 -->
    <contract-outside-add
      :contractOutsideAddVisiable="contractOutsideAdd.visiable"
      @close="handleContractOutsideAddClose"
      @success="handleContractOutsideAddSuccess">
    </contract-outside-add>
    <!-- 修改编外合同 -->
    <contract-outside-edit
      ref="contractOutsideEdit"
      :contractOutsideEditVisiable="contractOutsideEdit.visiable"
      @close="handleContractOutsideEditClose"
      @untied="handleContractOutsideEditUntied"
      @success="handleContractOutsideEditSuccess">
    </contract-outside-edit>
  </a-card>
</template>
<script>
import ContractOutsideInfo from './ContractOutsideInfo'
import ContractOutsideAdd from './ContractOutsideAdd'
import ContractOutsideEdit from './ContractOutsideEdit'

export default {
  name: 'ContractOutside',
  components: {ContractOutsideInfo, ContractOutsideAdd, ContractOutsideEdit},
  data () {
    return {
      advanced: false,
      contractOutsideInfo: {
        visiable: false,
        data: {}
      },
      contractOutsideAdd: {
        visiable: false,
        data: {}
      },
      contractOutsideEdit: {
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
      return [{
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '身份证号',
        dataIndex: 'idNum'
      }, {
        title: '合同期总数',
        dataIndex: 'contractPeriod',
        scopedSlots: { customRender: 'contractPeriod' }
      }, {
        title: '职位协议总数',
        dataIndex: 'jobAgreement',
        scopedSlots: { customRender: 'jobAgreement' }
      }, {
        title: '备注',
        dataIndex: 'remark'
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
        this.queryParams.isFixedPeriod = ''
        this.queryParams.remarkRenew = ''
        this.queryParams.remark = ''
      }
    },
    view (record) {
      this.contractOutsideInfo.data = record
      this.contractOutsideInfo.visiable = true
    },
    add () {
      this.contractOutsideAdd.visiable = true
    },
    handleContractOutsideAddClose () {
      this.contractOutsideAdd.visiable = false
    },
    handleContractOutsideAddSuccess () {
      this.contractOutsideAdd.visiable = false
      this.$message.success('新增编外合同成功')
      this.search()
    },
    edit (record) {
      this.$refs.contractOutsideEdit.setFormValues(record)
      this.contractOutsideEdit.visiable = true
    },
    handleContractOutsideEditClose () {
      this.contractOutsideEdit.visiable = false
    },
    handleContractOutsideEditUntied () {
      this.search()
    },
    handleContractOutsideEditSuccess () {
      this.contractOutsideEdit.visiable = false
      this.$message.success('修改编外合同成功')
      this.search()
    },
    handleContractOutsideInfoClose () {
      this.contractOutsideInfo.visiable = false
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
          that.$delete('contractOutside/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$export('contractOutside/excel', {
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
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.contractOutsideInfo.visiable = false
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
      this.$get('contractOutside', {
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

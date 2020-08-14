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
              <!-- <a-col :md="12" :sm="24" >
                <a-form-item
                  label="续签备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remarkRenew"/>
                </a-form-item>
              </a-col> -->
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="在职与否"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select v-model="isLeave">
                    <a-select-option value="0,1">全部</a-select-option>
                    <a-select-option value="0">在职</a-select-option>
                    <a-select-option value="1">非在职</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="合同开始"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleContractPeriodFromChange" ref="contractPeriodFrom"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="合同结束"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleContractPeriodToChange" ref="contractPeriodTo"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="协议开始"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleJobAgreementFromChange" ref="jobAgreementFrom"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="协议结束"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleJobAgreementToChange" ref="jobAgreementTo"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'contractInside:add'">新增</a-button>
        <span v-show="deleted===0">
          <a-button v-hasPermission="'contractInside:delete'" @click="batchDelete">删除</a-button>
        </span>
        <span v-show="deleted===1">
          <a-button v-hasPermission="'contractInside:deleteTrue'" @click="batchDelete">删除</a-button>
          <a-button v-hasNoPermission="'contractInside:deleteTrue'" disabled title="无权限">删除</a-button>
        </span>
        <a-dropdown v-hasAnyPermission="'contractInside:export,contractInside:restore'">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel" v-hasPermission="'contractInside:export'">导出Excel</a-menu-item>
            <a-menu-item key="deleted" @click="setDeleted">{{deleted === 0 ? '查看回收站' : '回到页面'}}</a-menu-item>
            <a-menu-item key="restore" v-if="deleted === 1 && selectedRowKeys.length > 0" @click="restore" v-hasPermission="'contractInside:restore'">恢复</a-menu-item>
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
        <template slot="contractPeriod" slot-scope="text, record">
          <span>{{ record.isFixedPeriod === '0' ? '无固定' : (text === null || text === '' ? '0' : text.split(',').length) }}期</span>
        </template>
        <template slot="jobAgreement" slot-scope="text">
          <span>{{ text===null || text=== '' ? '0' : text.split(',').length }}期</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div v-if="deleted===0">
            <a-icon v-hasPermission="'contractInside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
            &nbsp;
            <a-icon v-hasPermission="'contractInside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          </div>
          <a-badge v-else status="warning" text="无操作"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 编内合同信息查看 -->
    <contract-inside-info
      :contractInsideInfoData="contractInsideInfo.data"
      :contractInsideInfoVisiable="contractInsideInfo.visiable"
      @close="handleContractInsideInfoClose">
    </contract-inside-info>
    <!-- 新增编内合同 -->
    <contract-inside-add
      :contractInsideAddVisiable="contractInsideAdd.visiable"
      @close="handleContractInsideAddClose"
      @success="handleContractInsideAddSuccess">
    </contract-inside-add>
    <!-- 修改编内合同 -->
    <contract-inside-edit
      ref="contractInsideEdit"
      :contractInsideEditVisiable="contractInsideEdit.visiable"
      @close="handleContractInsideEditClose"
      @untied="handleContractInsideEditUntied"
      @success="handleContractInsideEditSuccess">
    </contract-inside-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import ContractInsideInfo from './ContractInsideInfo'
import ContractInsideAdd from './ContractInsideAdd'
import ContractInsideEdit from './ContractInsideEdit'

export default {
  name: 'ContractInside',
  components: {RangeDate, ContractInsideInfo, ContractInsideAdd, ContractInsideEdit},
  data () {
    return {
      deleted: 0,
      isLeave: '0',
      advanced: false,
      contractInsideInfo: {
        visiable: false,
        data: {}
      },
      contractInsideAdd: {
        visiable: false,
        data: {}
      },
      contractInsideEdit: {
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
        title: '序号',
        dataIndex: 'sortNum'
      }, {
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
    restore () {
      let that = this
      this.$confirm({
        title: '确定恢复所选中的记录?',
        content: '当您点击确定按钮后，选中的信息与相应的人员信息将会被移出回收站',
        centered: true,
        onOk () {
          that.loading = true
          that.$put('contractInside/togetherRestore', {
            contractOutsideIds: that.selectedRowKeys.join(',')
          }).then(() => {
            that.loading = false
            that.$message.success('已全部恢复')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    setDeleted () {
      this.deleted = this.deleted === 0 ? 1 : 0
      // 每次切换垃圾桶的时候就重置选中
      this.selectedRowKeys = []
      this.search()
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        // this.queryParams.remarkRenew = ''
        this.queryParams.remark = ''
        this.queryParams.contractPeriodFromFrom = ''
        this.queryParams.contractPeriodFromTo = ''
        this.queryParams.contractPeriodToFrom = ''
        this.queryParams.contractPeriodToTo = ''
        this.queryParams.jobAgreementFromFrom = ''
        this.queryParams.jobAgreementFromTo = ''
        this.queryParams.jobAgreementToFrom = ''
        this.queryParams.jobAgreementToTo = ''
      }
    },
    view (record) {
      this.contractInsideInfo.data = record
      this.contractInsideInfo.visiable = true
    },
    add () {
      this.contractInsideAdd.visiable = true
    },
    handleContractInsideAddClose () {
      this.contractInsideAdd.visiable = false
    },
    handleContractInsideAddSuccess () {
      this.contractInsideAdd.visiable = false
      this.$message.success('新增编内合同成功')
      this.search()
    },
    edit (record) {
      this.$refs.contractInsideEdit.setFormValues(record)
      this.contractInsideEdit.visiable = true
    },
    handleContractInsideEditClose () {
      this.contractInsideEdit.visiable = false
    },
    handleContractInsideEditUntied () {
      this.search()
    },
    handleContractInsideEditSuccess () {
      this.contractInsideEdit.visiable = false
      this.$message.success('修改编内合同成功')
      this.search()
    },
    handleContractInsideInfoClose () {
      this.contractInsideInfo.visiable = false
    },
    handleContractPeriodFromChange (value) {
      if (value) {
        this.queryParams.contractPeriodFromFrom = value[0]
        this.queryParams.contractPeriodFromTo = value[1]
      }
    },
    handleContractPeriodToChange (value) {
      if (value) {
        this.queryParams.contractPeriodToFrom = value[0]
        this.queryParams.contractPeriodToTo = value[1]
      }
    },
    handleJobAgreementFromChange (value) {
      if (value) {
        this.queryParams.jobAgreementFromFrom = value[0]
        this.queryParams.jobAgreementFromTo = value[1]
      }
    },
    handleJobAgreementToChange (value) {
      if (value) {
        this.queryParams.jobAgreementToFrom = value[0]
        this.queryParams.jobAgreementToTo = value[1]
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
        content: '当您点击确定按钮后，接下来将进行选择',
        centered: true,
        onOk () {
          let content = that.deleted === 0
            ? '当您点击单删按钮后，选中记录将会被移动到回收站；点击全删按钮后，选中记录与相应的人员信息会被移动到回收站'
            : '当您点击单删按钮后，选中记录将会被彻底删除；点击全删按钮后，选中记录与相应的人员信息会被彻底删除（不论相应记录是否在回收站）'
          that.$confirm({
            title: '是否一同删除相应人员信息',
            content,
            centered: true,
            cancelText: '单删',
            okText: '全删',
            onOk () {
              that.loading = true
              that.$delete('contractInside/together', {
                contractInsideIds: that.selectedRowKeys.join(','),
                deleted: that.deleted
              }).then(() => {
                that.loading = false
                that.$message.success(that.deleted === 0 ? '已全部移动至回收站' : '已全部彻底删除')
                that.selectedRowKeys = []
                that.search()
              })
            },
            onCancel () {
              that.loading = true
              that.$delete('contractInside', {
                contractInsideIds: that.selectedRowKeys.join(','),
                deleted: that.deleted
              }).then(() => {
                that.loading = false
                that.$message.success(that.deleted === 0 ? '已移动至回收站' : '已彻底删除')
                that.selectedRowKeys = []
                that.search()
              })
            }
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
      this.$export('contractInside/excel', {
        isLeave: this.isLeave,
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
        this.$refs.contractPeriodFrom.reset()
        this.$refs.contractPeriodTo.reset()
        this.$refs.jobAgreementFrom.reset()
        this.$refs.jobAgreementTo.reset()
      }
      this.isLeave = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.contractInsideInfo.visiable = false
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
      this.$get('contractInside', {
        isLeave: this.isLeave,
        deleted: this.deleted,
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

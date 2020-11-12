<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="分队"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleTeamChange">
                  <a-select-option v-for="i in filteredTeamOptions" :key="i">{{ i }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="姓名"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.idNum"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'contractOutside:add'">新增</a-button>
        <span v-show="deleted===0">
          <a-button v-hasPermission="'contractOutside:delete'" @click="batchDelete">删除</a-button>
        </span>
        <span v-show="deleted===1">
          <a-button v-hasPermission="'contractOutside:deleteTrue'" @click="batchDelete">删除</a-button>
          <a-button v-hasNoPermission="'contractOutside:deleteTrue'" disabled title="无权限">删除</a-button>
        </span>
        <a-dropdown v-hasAnyPermission="'contractOutside:export,contractOutside:restore'">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel" v-hasPermission="'contractOutside:export'">导出Excel</a-menu-item>
            <a-menu-item key="deleted" @click="setDeleted">{{deleted === 0 ? '查看回收站' : '回到页面'}}</a-menu-item>
            <a-menu-item key="restore" v-if="deleted === 1 && selectedRowKeys.length > 0" @click="restore" v-hasPermission="'contractOutside:restore'">恢复</a-menu-item>
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
            <a-icon v-if="record.type==='0'" v-hasPermission="'contractOutside:attributionUpdate'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
            <a-icon v-if="record.type!=='0'" v-hasPermission="'contractOutside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
            &nbsp;
            <a-icon v-hasPermission="'contractOutside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          </div>
          <a-badge v-else status="warning" text="无操作"></a-badge>
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
import RangeDate from '@/components/datetime/RangeDate'
import ContractOutsideInfo from './ContractOutsideInfo'
import ContractOutsideAdd from './ContractOutsideAdd'
import ContractOutsideEdit from './ContractOutsideEdit'

export default {
  name: 'ContractOutside',
  components: {RangeDate, ContractOutsideInfo, ContractOutsideAdd, ContractOutsideEdit},
  data () {
    return {
      deleted: 0,
      isLeave: '0',
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
      teamData: [],
      queryParams: {
        team: []
      },
      // queryParams: {
      //   contractPeriodFromFrom: '',
      //   contractPeriodFromTo: '',
      //   contractPeriodToFrom: '',
      //   contractPeriodToTo: '',
      //   jobAgreementFromFrom: '',
      //   jobAgreementFromTo: '',
      //   jobAgreementToFrom: '',
      //   jobAgreementToTo: ''
      // },
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
    filteredTeamOptions () {
      return this.teamData.filter(o => !this.queryParams.team.includes(o))
    },
    columns () {
      return [{
        title: '总序号',
        dataIndex: 'sortNum1',
        width: '6%'
      }, {
        title: '分队序号',
        dataIndex: 'sortNum2',
        width: '7%'
      }, {
        title: '姓名',
        dataIndex: 'name',
        width: '12%'
      }, {
        title: '身份证号',
        dataIndex: 'idNum',
        width: '25%'
      }, {
        title: '分队',
        dataIndex: 'team',
        width: '12%'
      }, {
        title: '合同期总数',
        dataIndex: 'contractPeriod',
        scopedSlots: { customRender: 'contractPeriod' },
        width: '12%'
      }, {
        title: '职位协议总数',
        dataIndex: 'jobAgreement',
        scopedSlots: { customRender: 'jobAgreement' },
        width: '12%'
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '10%'
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
    restore () {
      let that = this
      this.$confirm({
        title: '确定恢复所选中的记录?',
        content: '当您点击确定按钮后，选中的信息与相应的人员信息将会被移出回收站',
        centered: true,
        onOk () {
          that.loading = true
          that.$put('contractOutside/togetherRestore', {
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.idNum = ''
        this.queryParams.remarkRenew = ''
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
    handleTeamChange (value) {
      this.queryParams.team = value || ''
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
              that.$delete('contractOutside/together', {
                contractOutsideIds: that.selectedRowKeys.join(','),
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
              that.$delete('contractOutside', {
                contractOutsideIds: that.selectedRowKeys.join(','),
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
      this.$export('contractOutside/excel', {
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
      this.queryParams = {
        team: []
      }
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

      this.contractOutsideInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('staffOutside/getTeam', {
      }).then((r) => {
        this.teamData = r.data.filter(d => d)
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

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
                  label="事由"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-auto-complete
                    v-model="queryParams.cause"
                    :dataSource="causeData"
                    :allowClear='true'
                    :filterOption="filterOption"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="年龄"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input-group compact>
                    <a-input
                      :value="queryParams.mini"
                      @change="onMiniChange"
                      :maxLength="3"
                      style="width: 45%; text-align: center"
                    />
                    <a-input
                      style="width: 10%; text-align: center; border-left: 0; pointer-events: none; backgroundColor: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input
                      :value="queryParams.max"
                      @change="onMaxChange"
                      :maxLength="3"
                      style="width: 45%; text-align: center; border-left: 0"
                    />
                  </a-input-group>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="民族"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.clan"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="籍贯"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.birthplace"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="学历"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-auto-complete
                    v-model="queryParams.culture"
                    :dataSource="cultureData"
                    :allowClear='true'
                    :filterOption="filterOption"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="政治面貌"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-auto-complete
                    v-model="queryParams.politicalFace"
                    :dataSource="politicalFaceData"
                    :allowClear='true'
                    :filterOption="filterOption"
                  />
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
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="家庭住址"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.address"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="座机号码"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.phoneLandLine"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="手机号码"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.phoneCell"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="岗位"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handlePostChange">
                    <a-select-option v-for="i in filteredPostOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="岗位职务"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleTechnicalTypeChange">
                    <a-select-option v-for="i in filteredTechnicalTypeOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
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
                  label="非在职日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'staffOutside:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'staffOutside:delete'">删除</a-button>
        <a-button @click="exportExcel" v-hasPermission="'staffOutside:export'">导出Excel</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ x: 900 }"
               rowKey="staffId"
               @change="handleTableChange">
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-if="record.type !== '0'" type="up-square" theme="twoTone" twoToneColor="#08c" @click="sort(0, record)" title="向上调整排序"></a-icon>
          <a-icon v-if="record.type !== '0'" type="down-square" theme="twoTone" twoToneColor="#08c" @click="sort(1, record)" title="向下调整排序"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'staffOutside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'staffOutside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 编外人员信息查看 -->
    <staff-outside-info
      :staffOutsideInfoData="staffOutsideInfo.data"
      :staffOutsideInfoVisiable="staffOutsideInfo.visiable"
      @close="handleStaffOutsideInfoClose">
    </staff-outside-info>
    <!-- 新增编外人员 -->
    <staff-outside-add
      :technicalTypeData="technicalTypeData"
      :postData="postData"
      :teamData="teamData"
      :staffOutsideAddVisiable="staffOutsideAdd.visiable"
      @close="handleStaffOutsideAddClose"
      @success="handleStaffOutsideAddSuccess">
    </staff-outside-add>
    <!-- 修改编外人员 -->
    <staff-outside-edit
      ref="staffOutsideEdit"
      :technicalTypeData="technicalTypeData"
      :postData="postData"
      :teamData="teamData"
      :staffOutsideEditVisiable="staffOutsideEdit.visiable"
      @close="handleStaffOutsideEditClose"
      @success="handleStaffOutsideEditSuccess">
    </staff-outside-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import DeptInputTree from '../../system/dept/DeptInputTree'
import StaffOutsideInfo from './StaffOutsideInfo'
import StaffOutsideAdd from './StaffOutsideAdd'
import StaffOutsideEdit from './StaffOutsideEdit'

export default {
  name: 'StaffOutside',
  components: { RangeDate, DeptInputTree, StaffOutsideInfo, StaffOutsideAdd, StaffOutsideEdit },
  data () {
    return {
      isLeave: '0',
      advanced: false,
      staffOutsideInfo: {
        visiable: false,
        data: {}
      },
      staffOutsideAdd: {
        visiable: false,
        data: {}
      },
      staffOutsideEdit: {
        visiable: false,
        data: {}
      },
      technicalTypeData: [],
      postData: [],
      teamData: [],
      causeData: ['在册', '增加', '解除', '调离', '终止', '退休', '亡故'],
      cultureData: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
      politicalFaceData: ['群众', '团员', '党员', '预备党员'],
      queryParams: {
        mini: '',
        max: '',
        technicalType: [],
        post: [],
        team: []
      },
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
    filteredTechnicalTypeOptions () {
      return this.technicalTypeData.filter(o => !this.queryParams.technicalType.includes(o))
    },
    filteredPostOptions () {
      return this.postData.filter(o => !this.queryParams.post.includes(o))
    },
    filteredTeamOptions () {
      return this.teamData.filter(o => !this.queryParams.team.includes(o))
    },
    columns () {
      // 受控属性
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '总序号',
        dataIndex: 'sortNum1'
      }, {
        title: '分队序号',
        dataIndex: 'sortNum2'
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '人员类型',
        dataIndex: 'temporary'
      }, {
        title: '性别',
        dataIndex: 'gender',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '女'
            case '1':
              return '男'
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '女', value: '0' },
          { text: '男', value: '1' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: false,
        filteredValue: filteredInfo.gender || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.gender.includes(value)
      }, {
        title: '分队',
        dataIndex: 'team'
      }, {
        title: '岗位',
        dataIndex: 'post'
      }, {
        title: '岗位职务',
        dataIndex: 'technicalType'
      }, {
        title: '户籍性质',
        dataIndex: 'householdRegistrationType',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '外地农业'
            case '1':
              return '外地非农业'
            case '2':
              return '本地农业'
            case '3':
              return '本地非农业'
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '外地农业', value: '0' },
          { text: '外地非农业', value: '1' },
          { text: '本地农业', value: '2' },
          { text: '本地非农业', value: '3' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: true
      }, {
        title: '事由',
        dataIndex: 'cause'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 130
      }]
    }
  },
  mounted () {
    this.loadSelect()
    this.fetch()
  },
  methods: {
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
        this.queryParams.cause = ''
        this.queryParams.clan = ''
        this.queryParams.birthplace = ''
        this.queryParams.culture = ''
        this.queryParams.politicalFace = ''
        this.queryParams.isDisabilityCertificate = ''
        this.queryParams.idNum = ''
        this.queryParams.address = ''
        this.queryParams.phoneLandLine = ''
        this.queryParams.phoneCell = ''
        this.queryParams.post = []
        this.queryParams.technicalType = []
        this.queryParams.remark = ''
        this.queryParams.mini = ''
        this.queryParams.max = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
    },
    sort (isUp, record) {
      this.loading = true
      this.$put('staffOutside/updateSort', {
        ...record,
        isUp: isUp
      }).then((r) => {
        this.loading = false
        let statusArr = {
          '-1': 'error',
          '0': 'warning',
          '1': 'success'
        }
        this.$message[statusArr[r.data.status]](r.data.message)
        this.search()
      })
    },
    view (record) {
      this.staffOutsideInfo.data = record
      this.staffOutsideInfo.visiable = true
    },
    add () {
      this.staffOutsideAdd.visiable = true
    },
    handleStaffOutsideAddClose () {
      this.staffOutsideAdd.visiable = false
    },
    handleStaffOutsideAddSuccess () {
      this.staffOutsideAdd.visiable = false
      this.$message.success('新增编外人员成功')
      this.search()
    },
    edit (record) {
      this.$refs.staffOutsideEdit.setFormValues(record)
      this.staffOutsideEdit.visiable = true
    },
    handleStaffOutsideEditClose () {
      this.staffOutsideEdit.visiable = false
    },
    handleStaffOutsideEditSuccess () {
      this.staffOutsideEdit.visiable = false
      this.$message.success('修改编外人员成功')
      this.search()
    },
    handleStaffOutsideInfoClose () {
      this.staffOutsideInfo.visiable = false
    },
    handleIsDisabilityCertificateChange (value) {
      this.queryParams.isDisabilityCertificate = value || ''
    },
    handleTechnicalTypeChange (value) {
      this.queryParams.technicalType = value || ''
    },
    handlePostChange (value) {
      this.queryParams.post = value || ''
    },
    handleTeamChange (value) {
      this.queryParams.team = value || ''
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    onMiniChange (e) {
      const { value } = e.target
      const reg = /^(0|[1-9][0-9]*)$/
      if ((!isNaN(value) && reg.test(value)) || value === '') {
        this.queryParams.mini = value
      }
    },
    onMaxChange (e) {
      const { value } = e.target
      const reg = /^(0|[1-9][0-9]*)$/
      if ((!isNaN(value) && reg.test(value)) || value === '') {
        this.queryParams.max = value
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
          that.$delete('staffOutside/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$export('staffOutside/excel', {
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
        mini: '',
        max: '',
        technicalType: [],
        post: [],
        team: []
      }
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.isLeave = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.staffOutsideInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('staffOutside/getTechnicalType', {
      }).then((r) => {
        // 这里 这样可以去除null
        this.technicalTypeData = r.data.filter(d => d)
      })
      this.$get('staffOutside/getPost', {
      }).then((r) => {
        this.postData = r.data.filter(d => d)
      })
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
      this.$get('staffOutside', {
        isLeave: this.isLeave,
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

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
                <a-tree-select
                  :allowClear="true"
                  :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
                  :treeData="deptTreeData"
                  @change="handleDeptChange">
                </a-tree-select>
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
                  label="原学历"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-auto-complete
                    v-model="queryParams.cultureBefore"
                    :dataSource="cultureData"
                    :allowClear='true'
                    :filterOption="filterOption"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="现学历"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-auto-complete
                    v-model="queryParams.cultureCurrent"
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
                  label="残疾证"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleIsDisabilityCertificateChange">
                    <a-select-option key="1">有</a-select-option>
                    <a-select-option key="0">无</a-select-option>
                  </a-select>
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
                  label="岗位级别"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <!-- <a-input v-model="queryParams.postLevel"/> -->
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handlePostLevelChange">
                    <a-select-option v-for="i in filteredPostLevelOptions" :key="i">{{ i }}</a-select-option>
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
                  label="入职状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleEntryStatusChange">
                    <a-select-option v-for="i in filteredEntryStatusOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'staffInside:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'staffInside:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'staffInside:export'">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel">导出Excel</a-menu-item>
            <a-menu-item key="staff-increase" @click="showModal(0)">增加人员报表</a-menu-item>
            <a-menu-item key="staff-decrease" @click="showModal(1)">减少人员报表</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择人员变动报表年月"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="staffChange"
          okText="提交">
          <a-month-picker
            style="width: 100%;"
            @change="handleYearMonthChange"
          />
        </a-modal>
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
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'staffInside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'staffInside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 编内人员信息查看 -->
    <staff-inside-info
      :staffInsideInfoData="staffInsideInfo.data"
      :staffInsideInfoVisiable="staffInsideInfo.visiable"
      @close="handleStaffInsideInfoClose">
    </staff-inside-info>
    <!-- 新增编内人员 -->
    <staff-inside-add
      :deptTreeData="deptTreeData"
      :technicalTypeData="technicalTypeData"
      :entryStatusData="entryStatusData"
      :postLevelData="postLevelData"
      :staffInsideAddVisiable="staffInsideAdd.visiable"
      @close="handleStaffInsideAddClose"
      @success="handleStaffInsideAddSuccess">
    </staff-inside-add>
    <!-- 修改编内人员 -->
    <staff-inside-edit
      ref="staffInsideEdit"
      :deptTreeData="deptTreeData"
      :technicalTypeData="technicalTypeData"
      :entryStatusData="entryStatusData"
      :postLevelData="postLevelData"
      :staffInsideEditVisiable="staffInsideEdit.visiable"
      @close="handleStaffInsideEditClose"
      @success="handleStaffInsideEditSuccess">
    </staff-inside-edit>
  </a-card>
</template>
<script>
import DeptInputTree from '../../system/dept/DeptInputTree'
import StaffInsideInfo from './StaffInsideInfo'
import StaffInsideAdd from './StaffInsideAdd'
import StaffInsideEdit from './StaffInsideEdit'
import { newSpread, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'StaffInside',
  components: { DeptInputTree, StaffInsideInfo, StaffInsideAdd, StaffInsideEdit },
  data () {
    return {
      changeType: '',
      changeDate: '',
      modalVisible: false,
      isLeave: '0',
      advanced: false,
      staffInsideInfo: {
        visiable: false,
        data: {}
      },
      staffInsideAdd: {
        visiable: false,
        data: {}
      },
      staffInsideEdit: {
        visiable: false,
        data: {}
      },
      deptTreeData: [],
      technicalTypeData: [],
      entryStatusData: [],
      postLevelData: [],
      causeData: ['在册', '增加', '解除', '调离', '终止', '退休', '亡故'],
      cultureData: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
      politicalFaceData: ['群众', '团员', '党员', '预备党员'],
      queryParams: {
        mini: '',
        max: '',
        deptId: '',
        technicalType: [],
        entryStatus: [],
        postLevel: []
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
    filteredEntryStatusOptions () {
      return this.entryStatusData.filter(o => !this.queryParams.entryStatus.includes(o))
    },
    filteredPostLevelOptions () {
      return this.postLevelData.filter(o => !this.queryParams.postLevel.includes(o))
    },
    columns () {
      // 受控属性
      let { filteredInfo } = this
      filteredInfo = filteredInfo || {}
      return [{
        title: '序号',
        dataIndex: 'sortNum'
      }, {
        title: '姓名',
        dataIndex: 'name'
      }, {
        title: '档案编号',
        dataIndex: 'fileNum'
      }, {
        title: '事由',
        dataIndex: 'cause'
      }, {
        title: '人员类型',
        dataIndex: 'type',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '固定工'
            case '1':
              return '合同制'
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '固定工', value: '0' },
          { text: '合同制', value: '1' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: true,
        filteredValue: filteredInfo.type || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.type.includes(value)
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
      // }, {
      //   title: '部门',
      //   dataIndex: 'deptName'
      }, {
        title: '岗位',
        dataIndex: 'post',
        customRender: (text, row, index) => {
          switch (text) {
            case '0':
              return '管理'
            case '1':
              return '技工'
            case '2':
              return '普工'
            case '3':
              return '专技'
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '管理', value: '0' },
          { text: '技工', value: '1' },
          { text: '普工', value: '2' },
          { text: '专技', value: '3' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: true,
        filteredValue: filteredInfo.post || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.post.includes(value)
      }, {
        title: '岗位等级',
        dataIndex: 'postLevel'
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
    staffChange () {
      if (!this.changeDate) {
        this.$message.warning('请选择日期')
        return
      }
      this.modalVisible = false
      this.$get('staffInside/getIncreaseOrDecreaseStaffInside', {
        birthDate: this.changeDate,
        isLeave: this.changeType
      }).then((r) => {
        let newData = []
        r.data.forEach(item => {
          newData.push([
            item.type,
            item.name,
            item.idNum,
            item.gender === '1' ? '男' : '女'
          ])
        })
        this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
          let spread = newSpread('Staff')
          spread = floatForm(spread, 'Staff', newData)
          let fileName = `${this.changeType === 0 ? '增加' : '减少'}人员报表_${this.changeDate}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'Staff', newData.length)
        })
      })
    },
    handleYearMonthChange (value) {
      if (!value) {
        this.changeDate = ''
        return
      }
      this.changeDate = value.format('YYYY-MM')
    },
    showModal (value) {
      this.changeType = value
      this.modalVisible = true
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
        this.queryParams.cause = ''
        this.queryParams.clan = ''
        this.queryParams.birthplace = ''
        this.queryParams.cultureBefore = ''
        this.queryParams.cultureCurrent = ''
        this.queryParams.politicalFace = ''
        this.queryParams.isDisabilityCertificate = ''
        this.queryParams.idNum = ''
        this.queryParams.address = ''
        this.queryParams.phoneLandLine = ''
        this.queryParams.phoneCell = ''
        this.queryParams.technicalType = ''
        this.queryParams.entryStatus = ''
        this.queryParams.postLevel = ''
        this.queryParams.mini = ''
        this.queryParams.max = ''
      }
    },
    view (record) {
      this.staffInsideInfo.data = record
      this.staffInsideInfo.visiable = true
    },
    add () {
      this.staffInsideAdd.visiable = true
    },
    handleStaffInsideAddClose () {
      this.staffInsideAdd.visiable = false
    },
    handleStaffInsideAddSuccess () {
      this.staffInsideAdd.visiable = false
      this.$message.success('新增编内人员成功')
      this.search()
    },
    edit (record) {
      this.$refs.staffInsideEdit.setFormValues(record)
      this.staffInsideEdit.visiable = true
    },
    handleStaffInsideEditClose () {
      this.staffInsideEdit.visiable = false
    },
    handleStaffInsideEditSuccess () {
      this.staffInsideEdit.visiable = false
      this.$message.success('修改编内人员成功')
      this.search()
    },
    handleStaffInsideInfoClose () {
      this.staffInsideInfo.visiable = false
    },
    handleDeptChange (value) {
      this.queryParams.deptId = value || ''
    },
    handleIsDisabilityCertificateChange (value) {
      this.queryParams.isDisabilityCertificate = value || ''
    },
    handleTechnicalTypeChange (value) {
      this.queryParams.technicalType = value || ''
    },
    handleEntryStatusChange (value) {
      this.queryParams.entryStatus = value || ''
    },
    handlePostLevelChange (value) {
      this.queryParams.postLevel = value || ''
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
          that.$delete('staffInside/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$export('staffInside/excel', {
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
        deptId: '',
        technicalType: [],
        entryStatus: [],
        postLevel: []
      }
      this.isLeave = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.staffInsideInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('dept').then((r) => {
        this.deptTreeData = r.data.rows.children
      })
      this.$get('staffInside/getTechnicalType', {}).then((r) => {
        this.technicalTypeData = r.data.filter(d => d)
      })
      this.$get('staffInside/getEntryStatus', {}).then((r) => {
        this.entryStatusData = r.data.filter(d => d)
      })
      this.$get('staffInside/getPostLevel', {}).then((r) => {
        this.postLevelData = r.data.filter(d => d)
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
      this.$get('staffInside', {
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

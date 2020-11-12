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
                  label="增加日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleCreateDateChange" ref="createDate"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="减少日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleReduceDateChange" ref="reduceDate"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'attributionOutside:add'">新增</a-button>
        <span v-show="deleted===0">
          <a-button v-hasPermission="'attributionOutside:delete'" @click="batchDelete">删除</a-button>
        </span>
        <span v-show="deleted===1">
          <a-button v-hasPermission="'attributionOutside:deleteTrue'" @click="batchDelete">删除</a-button>
          <a-button v-hasNoPermission="'attributionOutside:deleteTrue'" disabled title="无权限">删除</a-button>
        </span>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="export-all-data" @click="exportAllExcel" v-hasPermission="'attributionOutside:allExport'">导出全部编外</a-menu-item>
            <a-menu-item key="export-data" @click="exportExcel" v-hasPermission="'attributionOutside:export'">导出编外归属</a-menu-item>
            <a-menu-item key="staff-increase" @click="showModal(0)">增加人员报表</a-menu-item>
            <a-menu-item key="staff-decrease" @click="showModal(1)">减少人员报表</a-menu-item>
            <a-menu-item key="deleted" @click="setDeleted">{{deleted === 0 ? '查看回收站' : '回到页面'}}</a-menu-item>
            <a-menu-item key="restore" v-if="deleted === 1 && selectedRowKeys.length > 0" @click="restore" v-hasPermission="'attributionOutside:restore'">恢复</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择编外人员变动报表日期范围"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="staffChange"
          okText="提交">
          <range-date
            @change="handleDateChange"
            ref="createTime">
          </range-date>
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
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div v-if="deleted===0">
            <a-icon v-hasPermission="'attributionOutside:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
            &nbsp;
            <a-icon v-hasPermission="'attributionOutside:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          </div>
          <a-badge v-else status="warning" text="无操作"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 编外归属人员信息查看 -->
    <attribution-outside-info
      :attributionOutsideInfoData="attributionOutsideInfo.data"
      :attributionOutsideInfoVisiable="attributionOutsideInfo.visiable"
      @close="handleAttributionOutsideInfoClose">
    </attribution-outside-info>
    <!-- 新增编外归属人员 -->
    <attribution-outside-add
      :technicalTypeData="technicalTypeData"
      :postData="postData"
      :teamData="teamData"
      :attributionOutsideAddVisiable="attributionOutsideAdd.visiable"
      @close="handleAttributionOutsideAddClose"
      @success="handleAttributionOutsideAddSuccess">
    </attribution-outside-add>
    <!-- 修改编外归属人员 -->
    <attribution-outside-edit
      ref="attributionOutsideEdit"
      :technicalTypeData="technicalTypeData"
      :postData="postData"
      :teamData="teamData"
      :attributionOutsideEditVisiable="attributionOutsideEdit.visiable"
      @close="handleAttributionOutsideEditClose"
      @success="handleAttributionOutsideEditSuccess">
    </attribution-outside-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import DeptInputTree from '../../system/dept/DeptInputTree'
import AttributionOutsideInfo from './AttributionOutsideInfo'
import AttributionOutsideAdd from './AttributionOutsideAdd'
import AttributionOutsideEdit from './AttributionOutsideEdit'
import { newSpread, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'AttributionOutside',
  components: { RangeDate, DeptInputTree, AttributionOutsideInfo, AttributionOutsideAdd, AttributionOutsideEdit },
  data () {
    return {
      deleted: 0,
      changeType: '',
      changeDate: [],
      modalVisible: false,
      isLeave: '0',
      advanced: false,
      attributionOutsideInfo: {
        visiable: false,
        data: {}
      },
      attributionOutsideAdd: {
        visiable: false,
        data: {}
      },
      attributionOutsideEdit: {
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
        title: '事由',
        dataIndex: 'cause'
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
        title: '岗位',
        dataIndex: 'post'
      }, {
        title: '分队',
        dataIndex: 'team'
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
        width: 130
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
        content: '当您点击确定按钮后，接下来将进行选择',
        centered: true,
        onOk () {
          that.$confirm({
            title: '是否一同恢复相应合同信息',
            content: '当您点击否，选中记录将会被移出回收站；点击是，选中记录与相应的合同信息会一同被移出回收站',
            centered: true,
            cancelText: '否',
            okText: '是',
            onOk () {
              that.loading = true
              that.$put('staffOutside/togetherRestore', {
                staffOutsideIds: that.selectedRowKeys.join(',')
              }).then(() => {
                that.loading = false
                that.$message.success('已全部恢复')
                that.selectedRowKeys = []
                that.search()
              })
            },
            onCancel () {
              that.loading = true
              that.$put('staffOutside/restore', {
                staffOutsideIds: that.selectedRowKeys.join(',')
              }).then(() => {
                that.loading = false
                that.$message.success('已恢复')
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
    setDeleted () {
      this.deleted = this.deleted === 0 ? 1 : 0
      // 每次切换垃圾桶的时候就重置选中
      this.selectedRowKeys = []
      this.search()
    },
    staffChange () {
      if (this.changeDate.length === 0) {
        this.$message.warning('请选择日期')
        return
      }
      this.$message.loading('正在生成', 0)
      this.modalVisible = false
      this.$get('staffOutside/getIncreaseOrDecreaseStaffOutside', {
        createTimeFrom: this.changeDate[0],
        createTimeTo: this.changeDate[1],
        isLeave: this.changeType
      }).then((r) => {
        let newData = []
        r.data.forEach(item => {
          newData.push([
            item.type,
            item.name,
            item.idNum,
            item.gender === '1' ? '男' : '女',
            item.technicalType,
            item.leaveDate
          ])
        })
        this.$message.destroy() // 把message全局销毁
        let spread = newSpread('Staff')
        spread = floatForm(spread, 'Staff', newData)
        let fileName = `${this.changeType === 0 ? '编外增加' : '编外减少'}人员报表_${this.changeDate[0]}至${this.changeDate[1]}.xlsx`
        saveExcel(spread, fileName)
        floatReset(spread, 'Staff', newData.length)
        // 清空时间选择
        this.$refs.createTime.reset()
        this.changeDate = []
      })
    },
    handleDateChange (value) {
      if (value) this.changeDate = value
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
        this.queryParams.reduceTimeFrom = ''
        this.queryParams.reduceTimeTo = ''
      }
    },
    view (record) {
      this.attributionOutsideInfo.data = record
      this.attributionOutsideInfo.visiable = true
    },
    add () {
      this.attributionOutsideAdd.visiable = true
    },
    handleAttributionOutsideAddClose () {
      this.attributionOutsideAdd.visiable = false
    },
    handleAttributionOutsideAddSuccess () {
      this.attributionOutsideAdd.visiable = false
      this.$message.success('新增编外归属人员成功')
      this.loadSelect()
      this.search()
    },
    edit (record) {
      this.$refs.attributionOutsideEdit.setFormValues(record)
      this.attributionOutsideEdit.visiable = true
    },
    handleAttributionOutsideEditClose () {
      this.attributionOutsideEdit.visiable = false
    },
    handleAttributionOutsideEditSuccess () {
      this.attributionOutsideEdit.visiable = false
      this.$message.success('修改编外归属人员成功')
      this.loadSelect()
      this.search()
    },
    handleAttributionOutsideInfoClose () {
      this.attributionOutsideInfo.visiable = false
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
    handleCreateDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    handleReduceDateChange (value) {
      if (value) {
        this.queryParams.reduceTimeFrom = value[0]
        this.queryParams.reduceTimeTo = value[1]
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
        content: that.deleted === 0
          ? '当您点击确定按钮后，选中的信息与相应的合同信息将会被移动到回收站'
          : '当您点击确定按钮后，选中的信息与相应的合同信息将会被彻底删除',
        centered: true,
        onOk () {
          that.loading = true
          that.$delete('staffOutside/together', {
            staffOutsideIds: that.selectedRowKeys.join(','),
            deleted: that.deleted
          }).then(() => {
            that.loading = false
            that.$message.success(that.deleted === 0 ? '已全部移动至回收站' : '已全部彻底删除')
            that.selectedRowKeys = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exportAllExcel () {
      this.$export('staffOutside/allExport', {
        isLeave: this.isLeave,
        pageSize: this.pagination.total
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
      this.$export('staffOutside/attributionOutsideExport', {
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
        this.$refs.createDate.reset()
        this.$refs.reduceDate.reset()
      }
      this.isLeave = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.attributionOutsideInfo.visiable = false
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
      this.$get('staffOutside/attributionOutside', {
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

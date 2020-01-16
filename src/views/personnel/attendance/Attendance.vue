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
                <a-input v-model="queryParams.staffName"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="起始月份"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-month-picker
                  style="width: 100%;"
                  :allowClear="false"
                  @change="handleMonthChange"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
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
                  label="部门"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <dept-input-tree @change="handleDeptChange" ref="deptTree" style="width: 100%;"></dept-input-tree>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="身份证号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.staffIdCard"/>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'attendance:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'attendance:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'attendance:export','attendance:add'">
          <a-menu slot="overlay">
            <a-menu-item key="download-template" @click="downloadTemplate">模板下载</a-menu-item>
            <a-menu-item key="import-data" v-hasPermission="'attendance:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="beforeUpload">导入Excel</a-upload>
            </a-menu-item>
            <a-menu-item v-hasPermission="'attendance:export'" key="export-data" @click="showModal">汇总报表</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择考勤日期范围"
          v-model="modalVisible2"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="importExcel"
          okText="提交">
          <range-date @change="handleDateChange" ref="createTime"></range-date>
        </a-modal>
        <a-modal
          title="选择汇总报表年月"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportExcel"
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
               rowKey="id"
               @change="handleTableChange">
        <template slot="attendanceNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
        <template slot="startDate" slot-scope="text">
          {{text.split(' ')[0]}}
        </template>
        <template slot="endDate" slot-scope="text">
          {{text.split(' ')[0]}}
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'attendance:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'attendance:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          <a-badge v-hasNoPermission="'attendance:update','attendance:view'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增考勤信息 -->
    <attendance-add
      :attendanceAddVisiable="attendanceAdd.visiable"
      @close="handleAttendanceAddClose"
      @success="handleAttendanceAddSuccess">
    </attendance-add>
    <!-- 修改考勤信息 -->
    <attendance-edit
      ref="attendanceEdit"
      :attendanceEditVisiable="attendanceEdit.visiable"
      @close="handleAttendanceEditClose"
      @success="handleAttendanceEditSuccess">
    </attendance-edit>
    <!-- 考勤详细信息 -->
    <attendance-info
      :attendanceInfoData="attendanceInfo.data"
      :attendanceInfoVisiable="attendanceInfo.visiable"
      @close="handleAttendanceInfoClose">
    </attendance-info>
    <!-- 导入结果 -->
    <attendance-import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :attendanceImportResultVisible="attendanceImportResultVisible">
    </attendance-import-result>
  </a-card>
</template>
<script>
import AttendanceAdd from './AttendanceAdd'
import AttendanceEdit from './AttendanceEdit'
import AttendanceInfo from './AttendanceInfo'
import AttendanceImportResult from './AttendanceImportResult'
import DeptInputTree from '../../system/dept/DeptInputTree'
import RangeDate from '@/components/datetime/RangeDate'
import { newSpread, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'Attendance',
  components: { AttendanceAdd, AttendanceEdit, AttendanceInfo, AttendanceImportResult, DeptInputTree, RangeDate },
  data () {
    return {
      fileList: [],
      file: '',
      importData: [],
      times: '',
      errors: [],
      attendanceImportResultVisible: false,
      modalVisible: false,
      modalVisible2: false,
      advanced: false,
      attendanceAdd: {
        visiable: false,
        data: {}
      },
      attendanceEdit: {
        visiable: false,
        data: {}
      },
      attendanceInfo: {
        visiable: false,
        data: {}
      },
      dateData: {
        dateForm: {},
        dateTo: {}
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
      let { sortedInfo } = this
      sortedInfo = sortedInfo || {}
      return [{
        title: '姓名',
        dataIndex: 'staffName'
      }, {
        title: '部门',
        dataIndex: 'deptName'
      }, {
        title: '日勤',
        dataIndex: 'dayWork'
      }, {
      //   title: '夜勤',
      //   dataIndex: 'nightWork'
      // }, {
      //   title: '双加',
      //   dataIndex: 'doublePlus'
      // }, {
      //   title: '节加',
      //   dataIndex: 'holidayPlus'
      // }, {
      //   title: '1.5倍',
      //   dataIndex: 'hour15'
      // }, {
      //   title: '2倍',
      //   dataIndex: 'hour20'
      // }, {
        title: '公休',
        dataIndex: 'publicHoliday'
      }, {
      //   title: '工龄',
      //   dataIndex: 'workingLeave'
      // }, {
      //   title: '病假',
      //   dataIndex: 'sickLeave'
      // }, {
      //   title: '事假',
      //   dataIndex: 'thingLeave'
      // }, {
      //   title: '婚假',
      //   dataIndex: 'marriageLeave'
      // }, {
      //   title: '丧假',
      //   dataIndex: 'funeralLeave'
      // }, {
      //   title: '工伤',
      //   dataIndex: 'workInjury'
      // }, {
      //   title: '迟退',
      //   dataIndex: 'lateAndLeaveEarly'
      // }, {
      //   title: '平值',
      //   dataIndex: 'usuallyDuty'
      // }, {
      //   title: '双值',
      //   dataIndex: 'weekendDuty'
      // }, {
      //   title: '节值',
      //   dataIndex: 'holidayWatch'
      // }, {
      //   title: '扣分',
      //   dataIndex: 'deduction'
      // }, {
        title: '总计出勤天数',
        dataIndex: 'totalAttendanceDays'
      }, {
        title: '开始日期',
        dataIndex: 'startDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order,
        scopedSlots: { customRender: 'startDate' }
      }, {
        title: '结束日期',
        dataIndex: 'endDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order,
        scopedSlots: { customRender: 'endDate' }
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
    handleClose () {
      this.attendanceImportResultVisible = false
    },
    downloadTemplate () {
      this.$download('attendance/template', {}, '考勤表_导入模板.xlsx')
    },
    showModal () {
      this.modalVisible = true
    },
    beforeUpload (file) {
      this.modalVisible2 = true
      this.file = file
      return false
    },
    importExcel () {
      if (!this.dateData.dateTo.startDate || !this.dateData.dateTo.endDate) {
        this.$message.warning('请选择日期')
        return
      }
      this.modalVisible2 = false
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('startDate', this.dateData.dateTo.startDate)
      formData.append('endDate', this.dateData.dateTo.endDate)
      this.$message.loading('处理中', 0)
      this.$upload('attendance/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.fetch()
        }
        this.file = ''
        // 清空时间选择
        this.$refs.createTime.reset()
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        this.attendanceImportResultVisible = true
      }).catch((r) => {
        this.file = ''
        this.$message.destroy()
        console.error(r)
      })
    },
    handleYearMonthChange (value) {
      if (!value) {
        this.dateData.dateForm = {}
        this.dateTitle = ''
        return
      }
      this.dateData.dateForm = {
        year: value.format('YYYY'),
        month: value.format('MM')
      }
      this.dateTitle = value.format('YYYY年MM月')
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.remark = ''
        // 清空部门树选择
        this.$refs.deptTree.reset()
        this.queryParams.deptId = ''
        this.queryParams.staffIdCard = ''
      }
    },
    add () {
      this.attendanceAdd.visiable = true
    },
    handleAttendanceAddClose () {
      this.attendanceAdd.visiable = false
    },
    handleAttendanceAddSuccess () {
      this.attendanceAdd.visiable = false
      this.$message.success('新增考勤信息成功')
      this.search()
    },
    edit (record) {
      this.$refs.attendanceEdit.setFormValues(record)
      this.attendanceEdit.visiable = true
    },
    handleAttendanceEditClose () {
      this.attendanceEdit.visiable = false
    },
    handleAttendanceEditSuccess () {
      this.attendanceEdit.visiable = false
      this.$message.success('修改考勤信息成功')
      this.search()
    },
    view (record) {
      this.attendanceInfo.data = record
      this.attendanceInfo.visiable = true
    },
    handleAttendanceInfoClose () {
      this.attendanceInfo.visiable = false
    },
    handleDateChange (value) {
      if (value) {
        this.dateData.dateTo.startDate = value[0]
        this.dateData.dateTo.endDate = value[1]
      }
    },
    handleMonthChange (value) {
      this.queryParams.year = value.format('YYYY') || ''
      this.queryParams.month = value.format('MM') || ''
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
          that.$delete('attendance/' + that.selectedRowKeys.join(',')).then(() => {
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
      if (!this.dateData.dateForm.year || !this.dateData.dateForm.month) {
        this.$message.warning('请选择日期')
        return
      }
      this.modalVisible = false
      this.$get('attendance/report', {
        date: `${this.dateData.dateForm.year}-${this.dateData.dateForm.month}`
      }).then((r) => {
        let newData = []
        r.data.forEach(item => {
          newData.push([
            item.staffName,
            item.deptName,
            item.dayWork,
            item.nightWork,
            item.doublePlus,
            item.holidayPlus,
            item.hour15,
            item.hour20,
            item.publicHoliday,
            item.workingLeave,
            item.sickLeave,
            item.thingLeave,
            item.marriageLeave,
            item.funeralLeave,
            item.workInjury,
            item.lateAndLeaveEarly,
            item.usuallyDuty,
            item.weekendDuty,
            item.holidayWatch,
            item.deduction,
            item.totalAttendanceDays,
            item.startDate.split(' ')[0],
            item.endDate.split(' ')[0],
            item.remark
          ])
        })
        this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
          let spread = newSpread('Attendance')
          spread = floatForm(spread, 'Attendance', newData)
          let fileName = `考勤汇总台账_${this.dateData.dateForm.year}-${this.dateData.dateForm.month}.xlsx`
          saveExcel(spread, fileName)
          floatReset(spread, 'Attendance', newData.length)
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
      // 重置日期选择data
      this.dateData = {
        dateForm: {},
        dateTo: {}
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

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
      this.$get('attendance', {
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

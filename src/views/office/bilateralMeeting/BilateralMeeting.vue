<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="申请日期"
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'bilateralMeeting:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'bilateralMeeting:delete'">删除</a-button>
        <a-button @click="exportExcel" v-hasPermission="'bilateralMeeting:export'">导出汇总</a-button>
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
          <a-icon v-hasPermission="'bilateralMeeting:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'bilateralMeeting:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
          &nbsp;
          <a-popconfirm
            title="是否通过此申请 ?"
            @confirm="isPass(1,record)"
            @cancel="isPass(0,record)"
            okText="通过"
            cancelText="不通过"
          >
            <a-icon v-hasPermission="'bilateralMeeting:review'" type="check-circle" theme="twoTone" twoToneColor="#9451ff" title="确认"
              v-if="record.process===0 && record.review.split(',')[record.step-1]===user.username"></a-icon>
          </a-popconfirm>
          <!-- <a-icon v-hasPermission="'bilateralMeeting:determineTime'" v-if="record.process===1 && !record.meetingTime" type="clock-circle" @click="showModal(record)" title="确认上会时间" /> -->
        </template>
      </a-table>
      <!-- <a-modal
        title="确认上会时间"
        v-model="modalVisible"
        centered
        :width='350'
        @ok="viewDist"
        okText="确认">
        <a-date-picker style="width: 100%;" showTime @change="onDataTimeChange" placeholder="选择上会时间"/>
      </a-modal> -->
    </div>
    <!-- 信息查看 -->
    <bilateralMeeting-info
      :bilateralMeetingInfoData="bilateralMeetingInfo.data"
      :bilateralMeetingInfoVisiable="bilateralMeetingInfo.visiable"
      @close="handleBilateralMeetingInfoClose"
      @success="handleBilateralMeetingInfoSuccess">
    </bilateralMeeting-info>
    <!-- 新增 -->
    <bilateralMeeting-add
      :bilateralMeetingAddVisiable="bilateralMeetingAdd.visiable"
      @close="handleBilateralMeetingAddClose"
      @success="handleBilateralMeetingAddSuccess">
    </bilateralMeeting-add>
    <!-- 修改 -->
    <bilateralMeeting-edit
      ref="bilateralMeetingEdit"
      @close="handleBilateralMeetingEditClose"
      @success="handleBilateralMeetingEditSuccess"
      :bilateralMeetingEditVisiable="bilateralMeetingEdit.visiable">
    </bilateralMeeting-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import DeptInputTree from '../../system/dept/DeptInputTree'
import BilateralMeetingInfo from './BilateralMeetingInfo'
import BilateralMeetingAdd from './BilateralMeetingAdd'
import BilateralMeetingEdit from './BilateralMeetingEdit'
import { mapState } from 'vuex'
import { newSpread, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'BilateralMeeting',
  components: { RangeDate, DeptInputTree, BilateralMeetingInfo, BilateralMeetingAdd, BilateralMeetingEdit },

  data () {
    return {
      advanced: false,
      modalVisible: false,
      bilateralMeetingInfo: {
        visiable: false,
        data: {}
      },
      bilateralMeetingAdd: {
        visiable: false
      },
      bilateralMeetingEdit: {
        visiable: false
      },
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      // meetingTimeById: null,
      // meetingTime: null,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
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
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [{
        title: '部门',
        dataIndex: 'deptName',
        width: '9%'
      }, {
        title: '申请人',
        dataIndex: 'applicant',
        width: '9%'
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
        filteredValue: filteredInfo.process || null,
        width: '9%'
      }, {
        title: '拟上会议题',
        dataIndex: 'bilateralMeeting',
        ellipsis: true,
        customRender: (text, row, index) => {
          return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
        }
      // }, {
      //   title: '上会时间',
      //   dataIndex: 'meetingTime',
      //   customRender: (text, row, index) => {
      //     return text ? this.$tools.getDateTime(text) : '未定'
      //   },
      //   width: '13%'
      }, {
        title: '申请日期',
        dataIndex: 'applicationDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'applicationDate' && sortedInfo.order,
        width: '13%'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        width: 100
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    // onDataTimeChange (value, dateString) {
    //   this.meetingTime = dateString
    // },
    // viewDist () {
    //   this.$put('bilateralMeeting', {
    //     id: this.meetingTimeById,
    //     meetingTime: this.meetingTime
    //   }).then((r) => {
    //     this.meetingTimeById = null
    //     this.meetingTime = null
    //     this.modalVisible = false
    //     this.search()
    //     this.$message.success('上会时间确认成功')
    //   })
    // },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    isPass (is, record) {
      let data = {
        id: record.id,
        username: record.username,
        process: 0
      }
      if (is) {
        if (record.review.split(',').length === record.step) { data.process = 1 } else { data.step = record.step + 1 }
      } else {
        data.process = -1
      }
      this.loading = true
      this.$put('bilateralMeeting', {
        ...data
      }).then((r) => {
        this.fetch()
        this.$message.success('操作成功')
      })
    },
    view (record) {
      this.bilateralMeetingInfo.data = record
      this.bilateralMeetingInfo.visiable = true
    },
    add () {
      this.bilateralMeetingAdd.visiable = true
    },
    handleBilateralMeetingAddClose () {
      this.bilateralMeetingAdd.visiable = false
    },
    handleBilateralMeetingAddSuccess () {
      this.bilateralMeetingAdd.visiable = false
      this.$message.success('新增上会议题成功')
      this.search()
    },
    edit (record) {
      this.$refs.bilateralMeetingEdit.setFormValues(record)
      this.bilateralMeetingEdit.visiable = true
    },
    handleBilateralMeetingEditClose () {
      this.bilateralMeetingEdit.visiable = false
    },
    handleBilateralMeetingEditSuccess () {
      this.bilateralMeetingEdit.visiable = false
      this.$message.success('修改上会议题成功')
      this.search()
    },
    handleBilateralMeetingInfoClose () {
      this.bilateralMeetingInfo.visiable = false
    },
    handleBilateralMeetingInfoSuccess () {
      this.search()
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
          that.$delete('bilateralMeeting/' + that.selectedRowKeys.join(',')).then(() => {
            that.$message.success('删除成功')
            that.selectedRowKeys = []
            that.selectedRows = []
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
          that.selectedRows = []
        }
      })
    },
    exportExcel () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      // this.$message.loading('正在生成', 0)
      let newData = []
      this.selectedRows.forEach((item, index) => {
        newData.push([
          `${index + 1}.`,
          item.bilateralMeeting,
          '',
          item.applicant
        ])
      })
      this.$message.loading('正在生成', 1, () => { // 3s后关闭执行关闭回调函数
        let spread = newSpread('BilateralMeeting')
        spread = floatForm(spread, 'BilateralMeeting', newData)
        let fileName = `会议议题汇总单_${new Date().getFullYear()}-${new Date().getMonth() + 1}.xlsx`
        saveExcel(spread, fileName)
        floatReset(spread, 'BilateralMeeting', newData.length)
      })
    },
    // showModal (record) {
    //   this.meetingTimeById = record.id
    //   this.modalVisible = true
    // },
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
      this.selectedRows = []
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

      this.bilateralMeetingInfo.visiable = false
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
      this.$get('bilateralMeeting', {
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

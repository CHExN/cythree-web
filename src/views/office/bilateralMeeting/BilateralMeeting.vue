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
        <template slot="bilateralMeeting" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
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
          <a-icon v-hasPermission="'bilateralMeeting:determineTime'" v-if="record.process===1 && !record.meetingTime" type="clock-circle" @click="showModal(record)" title="确认上会时间" />
        </template>
      </a-table>
      <a-modal
        title="确认上会时间"
        v-model="modalVisible"
        centered
        :width='350'
        @ok="viewDist"
        okText="确认">
        <a-date-picker style="width: 100%;" showTime @change="onDataTimeChange" placeholder="选择上会时间"/>
      </a-modal>
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
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

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
      meetingTimeById: null,
      meetingTime: null,
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
        title: '申请人',
        dataIndex: 'applicant'
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
        title: '拟上会议题',
        dataIndex: 'bilateralMeeting',
        scopedSlots: { customRender: 'bilateralMeeting' },
        width: 200
      }, {
        title: '上会时间',
        dataIndex: 'meetingTime',
        customRender: (text, row, index) => {
          return text ? text.replace(/T/, ' ') : '未定'
        }
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
    onDataTimeChange (value, dateString) {
      this.meetingTime = dateString
    },
    viewDist () {
      this.$put('bilateralMeeting', {
        id: this.meetingTimeById,
        meetingTime: this.meetingTime
      }).then((r) => {
        this.meetingTimeById = null
        this.meetingTime = null
        this.modalVisible = false
        this.search()
        this.$message.success('上会时间确认成功')
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
            that.search()
          })
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    exportExcel () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要导出的记录')
        return
      }
      this.$message.loading('正在生成', 0)
      // let newData = []
      this.selectedRows.forEach(item => {
        let dateArr = `${item.date}`.split('-')
        let exportData = {
          num: item.num,
          toDeptName: item.toDeptName,
          storage: item.storage,
          handle: item.handle,
          year: `${dateArr[0]}年`,
          month: `${dateArr[1]}月`,
          day: `${dateArr[2]}日`,
          typeApplicationToDept: this.dictData.typeApplication[item.typeApplication],
          date: item.date,
          supplier: this.dictData.supplier[item.supplier] === '无' ? '' : this.dictData.supplier[item.supplier]
        }
        this.$get('storeroomPut/storeroomByPutId', { putId: item.id }).then((r) => {
          let everyEightBatches = {}
          let everyEightBatchesTotalAmount = {}
          r.data.forEach((storeroom, index) => { // 这里四舍五入后两位小数
            // let storeroomMoney = this.$tools.accMultiply(storeroom.money, storeroom.amount).toFixed(2)
            let storeroomMoney = Math.round(this.$tools.accMultiply(storeroom.money, storeroom.amount) * 100) / 100
            let storeroomMoneyArr = `${this.$tools.addZero(storeroomMoney)}`.replace(/[.]/g, '').split('').reverse()
            let storeroomExportItem = [
              '', // 货号
              storeroom.name,
              storeroom.unit,
              storeroom.amount,
              storeroom.money,
              storeroomMoneyArr[8], // 百万
              storeroomMoneyArr[7], // 十万
              storeroomMoneyArr[6], // 万
              storeroomMoneyArr[5], // 千
              storeroomMoneyArr[4], // 百
              storeroomMoneyArr[3], // 十
              storeroomMoneyArr[2], // 元
              storeroomMoneyArr[1], // 角
              storeroomMoneyArr[0], // 分
              storeroom.remark
            ]
            let divideEight = Math.ceil((index + 1) / 8)
            if (everyEightBatches[divideEight]) {
              everyEightBatches[divideEight].push(storeroomExportItem)
              everyEightBatchesTotalAmount[divideEight] = this.$tools.accAdd(everyEightBatchesTotalAmount[divideEight], storeroomMoney)
              // console.log(everyEightBatchesTotalAmount)
            } else {
              everyEightBatches[divideEight] = [storeroomExportItem]
              everyEightBatchesTotalAmount[divideEight] = 0
              everyEightBatchesTotalAmount[divideEight] = this.$tools.accAdd(everyEightBatchesTotalAmount[divideEight], storeroomMoney)
              // console.log(everyEightBatchesTotalAmount)
            }
          })
          // console.log(everyEightBatchesTotalAmount)
          Object.keys(everyEightBatches).forEach(key => {
            let everyEightBatchesTotalAmountArr = `${this.$tools.addZero(everyEightBatchesTotalAmount[key])}`.replace(/[.]/g, '').split('').reverse()
            everyEightBatchesTotalAmountArr.push('￥')
            // newData.push({
            //   ...exportData,
            //   everyEightBatches: everyEightBatches[key],
            //   f: everyEightBatchesTotalAmountArr[0], // 分
            //   j: everyEightBatchesTotalAmountArr[1], // 角
            //   y: everyEightBatchesTotalAmountArr[2], // 元
            //   s: everyEightBatchesTotalAmountArr[3], // 十
            //   b: everyEightBatchesTotalAmountArr[4], // 百
            //   q: everyEightBatchesTotalAmountArr[5], // 千
            //   w: everyEightBatchesTotalAmountArr[6], // 万
            //   sw: everyEightBatchesTotalAmountArr[7], // 十万
            //   bw: everyEightBatchesTotalAmountArr[8] // 百万
            // })
            exportData = {
              ...exportData,
              everyEightBatches: everyEightBatches[key],
              f: everyEightBatchesTotalAmountArr[0], // 分
              j: everyEightBatchesTotalAmountArr[1], // 角
              y: everyEightBatchesTotalAmountArr[2], // 元
              s: everyEightBatchesTotalAmountArr[3], // 十
              b: everyEightBatchesTotalAmountArr[4], // 百
              q: everyEightBatchesTotalAmountArr[5], // 千
              w: everyEightBatchesTotalAmountArr[6], // 万
              sw: everyEightBatchesTotalAmountArr[7], // 十万
              bw: everyEightBatchesTotalAmountArr[8] // 百万
            }
            this.$message.destroy() // 等全部执行完后，再把message全局销毁
            let spread = newSpread('StoreroomPut')
            spread = fixedForm(spread, 'StoreroomPut', exportData)
            spread = floatForm(spread, 'StoreroomPut', exportData.everyEightBatches)
            let fileName = `入库单_${exportData.typeApplicationToDept}_${exportData.date}_${exportData.num}.xlsx`
            saveExcel(spread, fileName)
            floatReset(spread, 'StoreroomPut', exportData.everyEightBatches.length)
          })
        })
      })
      // this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
      //   newData.forEach(exportData => {
      //     let spread = newSpread('StoreroomPut')
      //     spread = fixedForm(spread, 'StoreroomPut', exportData)
      //     spread = floatForm(spread, 'StoreroomPut', exportData.everyEightBatches)
      //     let fileName = `入库单_${exportData.typeApplicationToDept}_${exportData.date}_${exportData.num}.xlsx`
      //     saveExcel(spread, fileName)
      //     floatReset(spread, 'StoreroomPut', exportData.everyEightBatches.length)
      //   })
      // })
    },
    showModal (record) {
      this.meetingTimeById = record.id
      this.modalVisible = true
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

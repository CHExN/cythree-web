<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕编号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcNum"/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="公厕状态"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  v-model="queryParams.status"
                  @change="handleStatusChange">
                  <a-select-option v-for="i in filteredStatusOptions" :key="i">{{ i }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="公厕名"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcName"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="分队名"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    v-model="queryParams.wcOwn"
                    @change="handleOwnChange">
                    <a-select-option v-for="i in filteredWcOwnOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="关门日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleStartDateChange" ref="startDate"></range-date>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="开门日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleEndDateChange" ref="endDate"></range-date>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'wcStatus:add'">新增</a-button>
        <a-button @click="batchDelete" v-hasPermission="'wcStatus:delete'">删除</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="export-day-report" @click="() => modalDayVisible = true">导出日报表</a-menu-item>
            <a-menu-item key="export-week-report" @click="() => modalWeekVisible = true">导出周报表</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down"/>
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择导出日期"
          v-model="modalDayVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportDayReport"
          okText="提交">
          <a-date-picker
            style="width: 100%;"
            @change="handleDayChange"
          />
        </a-modal>
        <a-modal
          title="选择导出日期"
          v-model="modalWeekVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="exportWeekReport"
          okText="提交">
          <a-range-picker
            style="width: 100%;"
            @change="handleWeekChange"
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
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'wcStatus:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'wcStatus:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 新增公厕状态 -->
    <wc-status-add
      :wcStatusAddVisiable="wcStatusAdd.visiable"
      @close="handleWcStatusAddClose"
      @success="handleWcStatusAddSuccess">
    </wc-status-add>
    <!-- 修改公厕状态 -->
    <wc-status-edit
      ref="wcStatusEdit"
      :wcStatusEditVisiable="wcStatusEdit.visiable"
      @close="handleWcStatusEditClose"
      @success="handleWcStatusEditSuccess">
    </wc-status-edit>
    <!-- 公厕状态信息 -->
    <wc-status-info
      :wcStatusInfoData="wcStatusInfo.data"
      :wcStatusInfoVisiable="wcStatusInfo.visiable"
      @close="handleWcStatusInfoClose">
    </wc-status-info>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import WcStatusAdd from './WcStatusAdd'
import WcStatusEdit from './WcStatusEdit'
import WcStatusInfo from './WcStatusInfo'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'
import moment from 'moment'

export default {
  name: 'WcStatus',
  components: { RangeDate, WcStatusAdd, WcStatusEdit, WcStatusInfo },
  data () {
    return {
      advanced: false,
      wcStatusAdd: {
        visiable: false,
        data: {}
      },
      wcStatusEdit: {
        visiable: false,
        data: {}
      },
      wcStatusInfo: {
        visiable: false,
        data: {}
      },
      modalDayVisible: false,
      modalWeekVisible: false,
      startDate: {
        startDateFrom: '',
        startDateTo: ''
      },
      statusData: [],
      wcOwnData: [],
      queryParams: {
        wcOwn: [],
        status: []
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
    filteredWcOwnOptions () {
      return this.wcOwnData.filter(o => !this.queryParams.wcOwn.includes(o))
    },
    filteredStatusOptions () {
      return this.statusData.filter(o => !this.queryParams.status.includes(o))
    },
    columns () {
      // 受控属性
      let { sortedInfo, filteredInfo } = this
      sortedInfo = sortedInfo || {}
      filteredInfo = filteredInfo || {}
      return [{
        title: '公厕名',
        dataIndex: 'wcName',
        ellipsis: true,
        customRender: (text, row, index) => {
          // return <a-popover placement="topLeft" content={text}>{text}</a-popover>
          return <a-tooltip placement="topLeft" title={text}>{text}</a-tooltip>
        }
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum'
      }, {
        title: '类别',
        dataIndex: 'wcSort',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-tag color="cyan">一类</a-tag>
            case '2':
              return <a-tag color="orange">二类</a-tag>
            case '3':
              return <a-tag color="purple">三类</a-tag>
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '一类', value: '1' },
          { text: '二类', value: '2' },
          { text: '三类', value: '3' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: true,
        filteredValue: filteredInfo.wcSort || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.wcSort.includes(value)
      // }, {
      //   title: '所属街乡',
      //   dataIndex: 'streetTown'
      // }, {
      //   title: '重点位置',
      //   dataIndex: 'isFocus',
      //   customRender: (text, row, index) => {
      //     switch (text) {
      //       case '1':
      //         return '是'
      //       case '0':
      //         return '否'
      //       default:
      //         return text
      //     }
      //   },
      //   // filters 属性指定需要筛选菜单的列
      //   filters: [
      //     { text: '是', value: '1' },
      //     { text: '否', value: '0' }
      //   ],
      //   // filterMultiple 用于指定多选和单选(true多/false单)
      //   filterMultiple: false,
      //   filteredValue: filteredInfo.isFocus || null,
      //   // onFilter 用于筛选当前数据
      //   onFilter: (value, record) => record.isFocus.includes(value)
      }, {
        title: '关门日期',
        dataIndex: 'startDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'startDate' && sortedInfo.order
      }, {
        title: '是否关门',
        dataIndex: 'isOpen',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-badge status="processing" text="开门" />
            case '0':
              return <a-badge status="default" text="关门" />
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '开门', value: '1' },
          { text: '关门', value: '0' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: false,
        filteredValue: filteredInfo.isOpen || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.isOpen.includes(value)
      }, {
        title: '关门原因',
        dataIndex: 'status'
      }, {
        title: '是否通知',
        dataIndex: 'isNotice',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return '通知'
            case '0':
              return '不通知'
            default:
              return text
          }
        },
        // filters 属性指定需要筛选菜单的列
        filters: [
          { text: '通知', value: '1' },
          { text: '不通知', value: '0' }
        ],
        // filterMultiple 用于指定多选和单选(true多/false单)
        filterMultiple: false,
        filteredValue: filteredInfo.isNotice || null,
        // onFilter 用于筛选当前数据
        onFilter: (value, record) => record.isNotice.includes(value)
      // }, {
      //   title: '通知日期',
      //   dataIndex: 'noticeDate'
      }, {
        title: '开门日期',
        dataIndex: 'endDate',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'endDate' && sortedInfo.order
      }, {
        title: '分队',
        dataIndex: 'wcOwn'
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      // 每次展开，把隐藏的内容清空
      if (!this.advanced) {
        this.queryParams.wcOwn = []
        this.queryParams.wcName = ''
        this.queryParams.startDateFrom = ''
        this.queryParams.startDateTo = ''
        this.queryParams.endDateFrom = ''
        this.queryParams.endDateTo = ''
      }
    },
    add () {
      this.wcStatusAdd.visiable = true
    },
    handleWcStatusAddClose () {
      this.wcStatusAdd.visiable = false
    },
    handleWcStatusAddSuccess () {
      this.wcStatusAdd.visiable = false
      this.$message.success('新增公厕状态成功')
      this.search()
    },
    edit (record) {
      this.$refs.wcStatusEdit.setFormValues(record)
      this.wcStatusEdit.visiable = true
    },
    handleWcStatusEditClose () {
      this.wcStatusEdit.visiable = false
    },
    handleWcStatusEditSuccess () {
      this.wcStatusEdit.visiable = false
      this.$message.success('修改公厕状态成功')
      this.search()
    },
    handleStartDateChange (value) {
      if (value) {
        this.queryParams.startDateFrom = value[0]
        this.queryParams.startDateTo = value[1]
      }
    },
    handleEndDateChange (value) {
      if (value) {
        this.queryParams.endDateFrom = value[0]
        this.queryParams.endDateTo = value[1]
      }
    },
    handleOwnChange (value) {
      this.queryParams.wcOwn = value || ''
    },
    view (record) {
      this.wcStatusInfo.data = record
      this.wcStatusInfo.visiable = true
    },
    handleWcStatusInfoClose () {
      this.wcStatusInfo.visiable = false
    },
    handleStatusChange (value) {
      this.queryParams.status = value || ''
    },
    handleDayChange (date, dateString) {
      this.startDate.startDateFrom = dateString
      this.startDate.startDateTo = dateString
    },
    handleWeekChange (date, dateString) {
      this.startDate.startDateFrom = dateString[0]
      this.startDate.startDateTo = dateString[1]
    },
    exportDayReport () {
      if (!this.startDate.startDateFrom) {
        return this.$message.warning('请选择导出日期')
      }
      this.$message.loading('处理中', 0)
      this.$get('wcStatus/getList', {
        ...this.startDate
      }).then((r) => {
        this.$message.destroy()
        const date = moment(this.startDate.startDateFrom).format('YYYY年MM月DD日')
        if (!r.data || !r.data.length) {
          return this.$message.warning(`${date} 无关门记录`)
        }
        let arr = []
        let manureFloodingCount = 0
        r.data.forEach((item, index) => {
          if (item.status === '井满') manureFloodingCount++
          arr.push([
            index + 1, // 序号
            item.wcName,
            item.wcNum,
            item.streetTown,
            item.startDate = moment(item.startDate).format('YYYY/MM/DD'),
            item.status,
            null,
            item.wcOwn
          ])
        })
        let exportData = {
          title1: `关门公厕对接日报表（三队）（${date}）`,
          title2: `截至${date}统计，关门公厕共${r.data.length}座，其中因粪井满冒关门${manureFloodingCount}座，非粪井满冒原因关门${r.data.length - manureFloodingCount}座。`
        }
        let spread = newSpread('WcStatusDay')
        spread = fixedForm(spread, 'WcStatusDay', exportData)
        spread = floatForm(spread, 'WcStatusDay', arr)
        let fileName = `关门公厕日报（${date}）.xlsx`
        saveExcel(spread, fileName)
        floatReset(spread, 'WcStatusDay', arr.length)
        this.modalDayVisible = false
      })
    },
    exportWeekReport () {
      if (!this.startDate.startDateFrom) {
        return this.$message.warning('请选择导出日期')
      }
      this.$message.loading('处理中', 0)
      this.$get('wcStatus/getList', {
        ...this.startDate
      }).then((r) => {
        this.$message.destroy()
        const date = `${moment(this.startDate.startDateFrom).format('YYYY年MM月DD日')}至${moment(this.startDate.startDateTo).format('YYYY年MM月DD日')}`
        if (!r.data || !r.data.length) {
          return this.$message.warning(`${date} 无关门记录`)
        }
        let arr = []
        let manureFloodingCount = 0
        r.data.forEach((item, index) => {
          if (item.status === '井满') manureFloodingCount++
          arr.push([
            index + 1, // 序号
            item.wcName,
            item.wcNum,
            item.streetTown,
            moment(item.startDate).format('YYYY/MM/DD'),
            item.status,
            item.endDate ? item.day : '未开',
            item.endDate ? moment(item.endDate).format('YYYY/MM/DD') : null
          ])
        })
        let exportData = {
          title1: `关门公厕对接周报表（${moment(this.startDate.startDateFrom).format('YYYY年MM月')}）（三队）`,
          title2: `${date}，三队公厕关门共${r.data.length}座，其中因粪井满冒关门${manureFloodingCount}座，非粪井满冒原因关门${r.data.length - manureFloodingCount}座。`
        }
        let spread = newSpread('WcStatusWeek')
        spread = fixedForm(spread, 'WcStatusWeek', exportData)
        spread = floatForm(spread, 'WcStatusWeek', arr)
        let fileName = `关门公厕周报（${date}）.xlsx`
        saveExcel(spread, fileName)
        floatReset(spread, 'WcStatusWeek', arr.length)
        this.modalWeekVisible = false
      })
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
          that.$delete('wcStatus/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.queryParams = {
        wcOwn: [],
        status: []
      }
      if (this.advanced) {
        // 清空时间选择
        this.$refs.startDate.reset()
        this.$refs.endDate.reset()
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
    loadSelect () {
      this.$get('wcStatus/getStatus', {}).then((r) => {
        this.statusData = r.data.filter(d => d)
      })
      this.$get('wc/wcOwns', {
      }).then((r) => {
        this.wcOwnData = r.data.filter(d => d)
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
      this.$get('wcStatus', {
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

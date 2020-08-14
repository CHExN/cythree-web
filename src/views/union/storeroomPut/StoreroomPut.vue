<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="物资类别"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleTypeApplicationChange">
                  <a-select-option v-for="i in Object.keys(dictData.typeApplication||[])" :key="i">{{ dictData.typeApplication[i] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="入库单号"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.num"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="保管员"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.storage"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="经手人"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.handle"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="入库日期"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <range-date @change="handleDateChange" ref="createTime"></range-date>
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
        <a-button type="primary" ghost @click="unionPutAddOpen" v-hasPermission="'unionStoreroomPut:add'">入库</a-button>
        <a-button @click="batchDelete" v-hasPermission="'unionStoreroomPut:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'unionStoreroomPut:export'">
          <a-menu slot="overlay">
            <a-menu-item key="export-data" @click="exportExcel">导出入库单</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down"/>
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
        <template slot="money" slot-scope="text">
          <!-- <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span> -->
          <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'unionStoreroomPut:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          &nbsp;
          <a-icon v-hasPermission="'unionStoreroomPut:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 信息查看 -->
    <put-info
      :putInfoData="putInfo.data"
      :putInfoVisiable="putInfo.visiable"
      @close="handlePutInfoClose">
    </put-info>
    <!-- 新增工会用品 -->
    <union-put-add
      :putAddVisiable="unionPutAdd.visiable"
      @close="handleUnionPutAddClose"
      @success="handleUnionPutAddSuccess">
    </union-put-add>
    <!-- 修改 -->
    <put-edit
      ref="putEdit"
      :putEditVisiable="putEdit.visiable"
      @close="handlePutEditClose"
      @success="handlePutEditSuccess">
    </put-edit>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import PutInfo from './StoreroomPutInfo'
import UnionPutAdd from './UnionPutAdd'
import PutEdit from './StoreroomPutEdit'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'StoreroomPut',
  components: { PutInfo, UnionPutAdd, PutEdit, RangeDate },
  data () {
    return {
      advanced: false,
      putInfo: {
        visiable: false,
        data: {}
      },
      unionPutAdd: {
        visiable: false
      },
      putEdit: {
        visiable: false
      },
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      dictData: {},
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
        title: '单号',
        dataIndex: 'num'
      }, {
        title: '物资类别',
        dataIndex: 'typeApplication',
        customRender: (text, row, index) => {
          return this.dictData.typeApplication[text]
        }
      }, {
        title: '入库日期',
        dataIndex: 'date',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order
      }, {
        title: '总价',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'money' && sortedInfo.order
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
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.num = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
        this.queryParams.storage = ''
        this.queryParams.handle = ''
      }
    },
    view (record) {
      Object.keys(this.dictData).forEach(key => {
        record[key + 'ToDict'] = this.dictData[key][record[key]]
      })
      this.putInfo.data = record
      this.putInfo.visiable = true
    },
    handlePutInfoClose () {
      this.putInfo.visiable = false
    },
    unionPutAddOpen () {
      this.unionPutAdd.visiable = true
    },
    handleUnionPutAddClose () {
      this.unionPutAdd.visiable = false
    },
    handleUnionPutAddSuccess () {
      this.unionPutAdd.visiable = false
      this.$message.success('新增入库单成功')
      this.search()
    },
    edit (record, reviewModify) {
      this.$refs.putEdit.setFormValues(record, reviewModify)
      this.putEdit.visiable = true
    },
    handlePutEditClose () {
      this.putEdit.visiable = false
    },
    handlePutEditSuccess () {
      this.putEdit.visiable = false
      this.$message.success('修改入库单成功')
      this.search()
    },
    handleTypeApplicationChange (value) {
      this.queryParams.typeApplication = value || ''
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
          that.loading = true
          that.$delete('unionStoreroomPut/' + that.selectedRowKeys.join(',')).then((r) => {
            that.loading = false
            if (r.data.status === 0) {
              that.$warning({
                title: r.data.message,
                content: `抱歉，单号为【${r.data.outRecords.map(a => a.num).join('; ')}】
                有相关出库记录，请先删除相应出库单，再删除入库单。想查看具体要删除的出库单，请复制入库单名称或物资名称到【出入库物品明细】模块进行查询即可查看`,
                centered: true
              })
            } else if (r.data.status === 1) {
              that.$message.success('删除成功')
              that.selectedRowKeys = []
              that.selectedRows = []
              that.search()
            }
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
      this.$message.loading('正在生成', 0)
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
          supplier: ''
        }
        this.$get('unionStoreroomPut/storeroomByPutId', { putId: item.id }).then((r) => {
          let everyEightBatches = {}
          let everyEightBatchesTotalAmount = {}
          r.data.forEach((storeroom, index) => { // 这里四舍五入后两位小数
            // let storeroomMoney = Math.round(this.$tools.accMultiply(storeroom.money, storeroom.amount) * 100) / 100
            let storeroomMoney = this.$tools.rounding(this.$tools.accMultiply(storeroom.money, storeroom.amount), 2)
            // console.log(this.$tools.accMultiply(storeroom.money, storeroom.amount))
            // console.log(storeroomMoney)
            let storeroomMoneyArr = `${this.$tools.addZero(storeroomMoney)}`.replace(/[.]/g, '').split('').reverse()
            let storeroomExportItem = [
              '', // 货号 (index + 1)
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
            } else {
              everyEightBatches[divideEight] = [storeroomExportItem]
              everyEightBatchesTotalAmount[divideEight] = 0
              everyEightBatchesTotalAmount[divideEight] = this.$tools.accAdd(everyEightBatchesTotalAmount[divideEight], storeroomMoney)
            }
          })

          // 测试
          // let money = Object.values(everyEightBatchesTotalAmount).reduce((prev, current, index, arr) => {
          //   return this.$tools.accAdd(prev, current)
          // })
          // if (item.money === money) {
          //   console.log('true')
          // } else {
          //   console.log('========')
          //   console.log(item.money)
          //   console.log(money)
          //   console.log(everyEightBatchesTotalAmount)
          //   console.log('========')
          // }

          Object.keys(everyEightBatches).forEach(key => {
            let everyEightBatchesTotalAmountArr = `${this.$tools.addZero(everyEightBatchesTotalAmount[key])}`.replace(/[.]/g, '').split('').reverse()
            everyEightBatchesTotalAmountArr.push('￥')
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
            let spread = newSpread('StoreroomPut')
            spread = fixedForm(spread, 'StoreroomPut', exportData)
            spread = floatForm(spread, 'StoreroomPut', exportData.everyEightBatches)
            let fileName = `入库单_${exportData.typeApplicationToDept}_${exportData.date}_${exportData.num}.xlsx`
            saveExcel(spread, fileName)
            floatReset(spread, 'StoreroomPut', exportData.everyEightBatches.length)
          })
          this.$message.destroy() // 等全部执行完后，再把message全局销毁
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
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter

      this.putInfo.visiable = false
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    loadSelect () {
      this.$get('dict/cy_storeroom', {
      }).then((r) => {
        let dictList = {}
        r.data.forEach((item) => {
          let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
          if (dictList[fieldName]) {
            dictList[fieldName][item.keyy] = item.valuee
          } else {
            dictList[fieldName] = {[item.keyy]: item.valuee}
          }
        })
        this.dictData = {...this.dictData, ...dictList}
        this.fetch()
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
      this.$get('unionStoreroomPut', {
        ...params
      }).then((r) => {
        let data = r.data
        const pagination = { ...this.pagination }
        pagination.total = data.total
        this.loading = false
        this.dataSource = data.rows
        this.pagination = pagination
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/less/Common";
</style>

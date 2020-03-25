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
                label="供应商"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-select
                  mode="multiple"
                  :allowClear="true"
                  @change="handleSupplierChange">
                  <a-select-option v-for="i in Object.keys(dictData.supplier||[])" :key="i">{{ dictData.supplier[i] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="入库单号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.num"/>
                </a-form-item>
              </a-col>
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
        <a-button type="primary" ghost @click="add" v-hasPermission="'storeroomPut:add'">食堂用品入库</a-button>
        <a-button @click="batchDelete" v-hasPermission="'storeroomPut:delete'">删除</a-button>
        <a-dropdown v-hasAnyPermission="'storeroomPut:export','canteen:view','canteen:export','supplier:view'">
          <a-menu slot="overlay">
            <a-menu-item v-hasPermission="'supplier:view'" key="supplier-manage" @click="onSupplierManage">供应商管理</a-menu-item>
            <a-menu-item v-hasPermission="'canteen:view'" key="canteen-type-manage" @click="onCanteenTypeManage">食品类管理</a-menu-item> <!-- 食堂用品类别管理 -->
            <a-menu-item v-hasPermission="'canteen:export'" key="export-canteen-data" @click="showModal">导出食品台账</a-menu-item>
            <a-menu-item v-hasPermission="'storeroomPut:export'" key="export-data" @click="exportExcel">导出入库单</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down"/>
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择导出日期"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -12%;top: 25%"
          @ok="viewDist"
          okText="提交">
          <a-month-picker
            style="width: 100%;"
            @change="handleMonthChange"
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
        <template slot="money" slot-scope="text">
          <!-- <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span> -->
          <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            title="是否向队长提交修改申请？"
            :visible="false"
            @visibleChange="handlePopconfirmVisibleChange(record)"
            @confirm="confirm(record)"
            @cancel="cancel(record)"
            okText="Yes"
            cancelText="No"
            :ref="`popconfirm${record.id}`"
          >
            <!-- <a-icon v-hasPermission="'storeroomPut:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon> -->
            <a-icon v-hasPermission="'storeroomPut:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" title="修改"></a-icon>
          </a-popconfirm>
          &nbsp;
          <a-icon v-hasPermission="'storeroomPut:view'" type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 信息查看 -->
    <put-info
      :putInfoData="putInfo.data"
      :putInfoVisiable="putInfo.visiable"
      @close="handlePutInfoClose">
    </put-info>
    <!-- 新增 -->
    <put-add
      :putAddVisiable="putAdd.visiable"
      @close="handlePutAddClose"
      @success="handlePutAddSuccess">
    </put-add>
    <!-- 修改 -->
    <put-edit
      ref="putEdit"
      :putEditVisiable="putEdit.visiable"
      @close="handlePutEditClose"
      @success="handlePutEditSuccess">
    </put-edit>
    <!-- 食堂用品类别管理 -->
    <canteen-type-manage
      :canteenTypeManageVisiable="canteenTypeManage.visiable"
      @close="handleCanteenTypeClose">
    </canteen-type-manage>
    <!-- 供应商管理 -->
    <supplier-manage
      :supplierManageVisiable="supplierManage.visiable"
      @close="handleSupplierManageClose">
    </supplier-manage>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import PutInfo from './StoreroomPutInfo'
import PutAdd from './CanteenPutAdd'
import PutEdit from './StoreroomPutEdit'
import CanteenTypeManage from './CanteenTypeManage'
import SupplierManage from './SupplierManage'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  name: 'StoreroomPut',
  components: { PutInfo, PutAdd, PutEdit, RangeDate, CanteenTypeManage, SupplierManage },
  data () {
    return {
      advanced: false,
      modalVisible: false,
      // popconfirmVisible: false,
      dateData: {
        dateForm: {}
      },
      putInfo: {
        visiable: false,
        data: {}
      },
      putAdd: {
        visiable: false
      },
      putEdit: {
        visiable: false
      },
      canteenTypeManage: {
        visiable: false
      },
      supplierManage: {
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
        title: '供应商',
        dataIndex: 'supplier',
        customRender: (text, row, index) => {
          return this.dictData.supplier[text]
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
      // }, {
      //   title: '保管员',
      //   dataIndex: 'storage'
      // }, {
      //   title: '经手人',
      //   dataIndex: 'handle'
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
    confirm (record) {
      this.$message.loading('loading...', 0)
      this.$tools.verification({
        info: `编号为${record.num}的${this.dictData.typeApplication[record.typeApplication]}`,
        fieldName: 'id',
        tableName: 'storeroomPut',
        tableCname: '入库管理',
        tableId: record.id
      }, (r) => {
        this.$message.destroy()
        this.$refs[`popconfirm${record.id}`].visible = false
        this.$message.success('已提交修改申请')
      })
    },
    cancel (record) {
      this.$refs[`popconfirm${record.id}`].visible = false
    },
    handlePopconfirmVisibleChange (record) {
      if (this.$refs[`popconfirm${record.id}`].visible) {
        this.$refs[`popconfirm${record.id}`].visible = false
        return
      }
      // let now = new Date()
      // let is = false
      console.log(moment(record.createTime).format('YYYY-MM-DD'))
      console.log(moment(record.createTime).add(30, 'days').format('YYYY-MM-DD'))
      console.log(moment().isBefore(moment(record.createTime).add(30, 'days')))
      // is = record.createTime.substr(0, 7) === moment(`${now.getFullYear()}-${now.getMonth() + 1}`).format('YYYY-MM')
      let is = moment().isBefore(moment(record.createTime).add(30, 'days'))
      if (is) {
        this.edit(record)
      } else {
        // 这里先查找对应的最新一条修改申请，只有返回审核通过，才把进去
        this.$message.loading('loading...', 0)
        this.$get('reviewModify/getOne', {
          tableName: 'storeroomPut',
          fieldName: 'id',
          tableId: record.id
        }).then((r) => {
          this.$message.destroy()
          if (!r.data) {
            this.$refs[`popconfirm${record.id}`].visible = true
          } else if (r.data.process === '0') {
            this.$message.warning('您已提交修改申请，请耐心等待审核成功通知')
          } else if (r.data.process === '1') {
            this.edit(record, {
              tableName: 'storeroomPut',
              fieldName: 'id',
              tableId: record.id
            })
          } else if (r.data.process === '2') {
            if (new Date(r.data.createTime).getTime() + (24 * 60 * 60 * 1000) < new Date().getTime()) {
              this.$message.warning('您上次修改申请未通过')
              this.$refs[`popconfirm${record.id}`].visible = true
            } else {
              this.$message.error('您的修改申请未通过，请24小时后再重新尝试')
            }
          // } else if (r.data.process === '3') {
          } else {
            this.$message.warning('您已修改过此条数据，如想再次修改请再次提交申请')
            this.$refs[`popconfirm${record.id}`].visible = true
          }
        })
      }
    },
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
    add () {
      this.putAdd.visiable = true
    },
    handlePutAddClose () {
      this.putAdd.visiable = false
    },
    handlePutAddSuccess () {
      this.putAdd.visiable = false
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
    onSupplierManage () {
      this.supplierManage.visiable = true
    },
    handleSupplierManageClose () {
      this.supplierManage.visiable = false
    },
    onCanteenTypeManage () {
      this.canteenTypeManage.visiable = true
    },
    handleCanteenTypeClose () {
      this.canteenTypeManage.visiable = false
    },
    handleTypeApplicationChange (value) {
      this.queryParams.typeApplication = value || ''
    },
    handleSupplierChange (value) {
      this.queryParams.supplier = value || ''
    },
    handleDateChange (value) {
      if (value) {
        this.queryParams.createTimeFrom = value[0]
        this.queryParams.createTimeTo = value[1]
      }
    },
    viewDist () {
      if (JSON.stringify(this.dateData.dateForm) !== '{}') {
        this.modalVisible = false
        this.$get('storeroom/canteen', {
          date: `${this.dateData.dateForm.year}-${this.dateData.dateForm.month}`
        }).then((r) => {
          let newData = []
          let amount = 0
          let money = 0
          r.data.forEach(item => {
            amount = amount + item.amount
            money = money + item.money
            newData.push([
              item.name,
              item.amount,
              item.money
            ])
          })
          newData.push(['总计', amount, money])
          this.$message.loading('正在生成', 3, () => { // 3s后关闭执行关闭回调函数
            let spread = newSpread('Canteen')
            spread = fixedForm(spread, 'Canteen', {title: `${this.dateData.dateForm.year}年${this.dateData.dateForm.month}月食堂材料用量明细表`})
            spread = floatForm(spread, 'Canteen', newData)
            let fileName = `食堂材料用量明细表_${this.dateData.dateForm.year}-${this.dateData.dateForm.month}.xlsx`
            saveExcel(spread, fileName)
            floatReset(spread, 'Canteen', newData.length)
          })
        })
      } else {
        this.$message.warning('请选择查看月份')
      }
    },
    handleMonthChange (value) {
      if (!value) {
        this.dateData.dateForm = {}
        return
      }
      this.dateData.dateForm = {
        year: value.format('YYYY'),
        month: value.format('MM')
      }
    },
    showModal () {
      this.modalVisible = true
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
          that.$delete('storeroomPut/' + that.selectedRowKeys.join(',')).then(() => {
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
            // let storeroomMoney = Math.round(this.$tools.accMultiply(storeroom.money, storeroom.amount) * 100) / 100
            let storeroomMoney = this.$tools.rounding(this.$tools.accMultiply(storeroom.money, storeroom.amount), 2)
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
      this.$get('supplier/all', {
      }).then((r) => {
        let dictList = {}
        r.data.forEach(item => {
          if (dictList.supplier) {
            dictList.supplier[item.id] = item.name
          } else {
            dictList.supplier = {[item.id]: item.name}
          }
        })
        this.dictData = {...this.dictData, ...dictList}
      })
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
      this.$get('storeroomPut', {
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

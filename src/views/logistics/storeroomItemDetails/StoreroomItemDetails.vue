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
                  label="物品名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.name"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="入库单号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.putNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="型号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.type"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="收据"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.receipt" />
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
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark" />
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
        <a-button type="primary" ghost v-hasPermission="'wcAccount:export'" @click="showModal">导出公厕台账</a-button>
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
          <div style="width: 100%; margin-top: -20px; margin-bottom: 10px">
            <a-radio-group @change="onRadioChange" v-model="radioValue">
              <a-radio-button :value="true">月选</a-radio-button>
              <a-radio-button :value="false">年选</a-radio-button>
            </a-radio-group>
          </div>
          <a-month-picker
            style="width: 100%;"
            v-if="radioValue"
            @change="handleMonthChange"
          />
          <template v-else>
            <a-select
              v-model="yearValue"
              style="width: 151px">
              <a-select-option v-for="i in 20" :key="2008 + i">{{ `${2008 + i}年` }}</a-select-option>
            </a-select>
            <a-radio-group v-model="yearIs">
              <a-radio-button :value="0">上半年</a-radio-button>
              <a-radio-button :value="1">下半年</a-radio-button>
            </a-radio-group>
          </template>
        </a-modal>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange"
               :scroll="{ x: 900 }"
               rowKey="id">
        <template slot="amount" slot-scope="text">
          <span>{{ $tools.toNumFormant(text) }}</span>
        </template>
        <template slot="money" slot-scope="text">
          <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon type="eye" theme="twoTone" twoToneColor="#42b983" @click="view(record)" title="查看"></a-icon>
        </template>
      </a-table>
    </div>
    <!-- 信息查看 -->
    <storeroom-item-details-info
      :storeroomItemDetailsInfoData="storeroomItemDetailsInfo.data"
      :storeroomItemDetailsInfoVisiable="storeroomItemDetailsInfo.visiable"
      @close="handleStoreroomItemDetailsInfoClose">
    </storeroom-item-details-info>
  </a-card>
</template>

<script>
import RangeDate from '@/components/datetime/RangeDate'
import StoreroomItemDetailsInfo from './StoreroomItemDetailsInfo'
import { newSpread, fixedForm, floatForm, floatReset, saveExcel } from '@/utils/spreadJS'

export default {
  name: 'StoreroomItemDetails',
  components: { RangeDate, StoreroomItemDetailsInfo },
  data () {
    return {
      advanced: false,
      radioValue: true,
      yearValue: new Date().getFullYear(),
      yearIs: 0,
      modalVisible: false,
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      dateTitle: '',
      dictData: {},
      storeroomItemDetailsInfo: {
        visiable: false,
        data: {}
      },
      dataSource: [],
      paginationInfo: null,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      queryParams: {
        createTimeFrom: '',
        createTimeTo: ''
      },
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '入库数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '单价',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' }
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
        dataIndex: 'date'
      }, {
        title: '入库单号',
        dataIndex: 'putNum'
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
    showModal () {
      this.modalVisible = true
    },
    viewDist () {
      if (this.radioValue) { // radioValue为true时 是月选择
        if (JSON.stringify(this.dateData.dateForm) !== '{}') {
          this.$message.loading('正在生成', 0) // 设为零时永不消失
          this.modalVisible = false
          let newData = []
          this.$get('wc/wcCostAccount', {
            year: this.dateData.dateForm.year,
            month: this.dateData.dateForm.month
          }).then((r) => {
            r.data.forEach((item, index) => {
              newData.push([
                this.dictData.wcSort[item.wcSort],
                item.wcOwn,
                item.wcNum,
                item.wcName,
                item.a,
                item.b,
                item.c,
                item.d,
                item.e,
                item.f,
                item.g
              ])
              if (newData.length === r.data.length) {
                let spread = newSpread('WcCostAccount')
                spread = fixedForm(spread, 'WcCostAccount', { title: `朝环三队${this.dateTitle}公厕成本核算台帐` })
                spread = floatForm(spread, 'WcCostAccount', newData)
                let fileName = `朝环三队${this.dateTitle}公厕成本核算台帐.xlsx`
                saveExcel(spread, fileName)
                floatReset(spread, 'WcCostAccount', newData.length)
                this.$message.destroy() // 等全部执行完后，再把message全局销毁
              }
            })
          })
        } else {
          this.$message.warning('请选择查看月份')
        }
      } else { // radioValue为false时 是年选择
        this.$message.loading('正在生成', 0) // 设为零时永不消失
        this.modalVisible = false
        let newData = []
        this.$get('wc/findWcCostAccountByYear', {
          year: this.yearValue,
          up: this.yearIs
        }).then((r) => {
          r.data.forEach((item, index) => {
            newData.push([
              this.dictData.wcSort[item.wcSort],
              item.wcOwn,
              item.wcNum,
              item.wcName,
              item.a,
              item.b,
              item.c,
              item.d,
              null,
              item.e,
              item.f,
              item.g,
              item.h,
              item.i,
              item.j,
              null,
              item.k,
              item.l,
              item.m,
              item.n,
              item.o,
              item.p
            ])
          })
          if (newData.length === r.data.length) {
            let tableName = this.yearIs === 0 ? 'WcCostAccountFirstHalf' : 'WcCostAccountSecondHalf'
            let spread = newSpread(tableName)
            spread = fixedForm(spread, tableName, { title: `朝环三队${this.yearValue}年${this.yearIs === 0 ? '01~06月' : '07~12月'}公厕成本核算台帐` })
            spread = floatForm(spread, tableName, newData)
            let fileName = `朝环三队${this.yearValue}年${this.yearIs === 0 ? '01~06月' : '07~12月'}公厕成本核算台帐.xlsx`
            saveExcel(spread, fileName)
            floatReset(spread, tableName, newData.length) // sheet.addRows有bug，用这个解决
            this.$message.destroy() // 等全部执行完后，再把message全局销毁
          }
        })
      }
    },
    onRadioChange (e) {
      // 切换radio时 重置日期选择data
      this.dateData = {
        dateForm: {},
        dateTo: {}
      }
    },
    handleMonthChange (value) {
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
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.name = ''
        this.queryParams.putNum = ''
        this.queryParams.unit = ''
        this.queryParams.receipt = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
        this.queryParams.remark = ''
      }
    },
    view (record) {
      Object.keys(this.dictData).forEach(key => {
        record[key + 'ToDict'] = this.dictData[key][record[key]]
      })
      this.storeroomItemDetailsInfo.data = record
      this.storeroomItemDetailsInfo.visiable = true
    },
    handleStoreroomItemDetailsInfoClose () {
      this.storeroomItemDetailsInfo.visiable = false
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
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.paginationInfo = null
      // 重置查询参数
      this.queryParams = {
        createTimeFrom: '',
        createTimeTo: ''
      }
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
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
      this.$get('dict/cy_wc', {
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
        this.dictData = { ...dictList, ...this.dictData }
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
        this.dictData = { ...dictList, ...this.dictData }
        this.fetch()
      })
    },
    fetch (params = {}) {
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
      this.$get('storeroom/itemDetails', {
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

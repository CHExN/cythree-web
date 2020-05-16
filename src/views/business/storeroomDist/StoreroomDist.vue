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
                  <!-- @change="handleTypeApplicationChange"> -->
                <a-select
                  v-model="queryParams.typeApplication">
                  <!-- <a-select-option key="1,2,4">全部</a-select-option> -->
                  <a-select-option key="1,4">全部</a-select-option>
                  <a-select-option v-for="i in Object.keys(dictData.typeApplication||[])" :key="i">{{ dictData.typeApplication[i] }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="24" >
              <a-form-item
                label="分队"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                  <!-- @change="handleToDeptIdsChange"> -->
                <a-select
                  v-model="queryParams.toDeptIds">
                  <a-select-option key="26,27,28,29">全部</a-select-option>
                  <a-select-option v-for="i in Object.keys(dictData.toDeptIds||[])" :key="i">{{ dictData.toDeptIds[i] }}</a-select-option>
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
                  label="备注"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.remark" />
                </a-form-item>
              </a-col>
              <!-- <a-col :md="12" :sm="24" >
                <a-form-item
                  label="状态"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select v-model="status">
                    <a-select-option value="0">未分配</a-select-option>
                    <a-select-option value="1">已分配</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col> -->
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
        <a-button v-hasPermission="'wcStoreroom:view'" type="primary" ghost @click="showModal">查看记录</a-button>
        <a-button v-hasPermission="'wcStoreroom:view'" @click="downloadTemplate">模板下载</a-button>
        <a-dropdown>
          <a-menu slot="overlay">
            <a-menu-item key="import-data" v-hasPermission="'wcStoreroom:add'">
              <a-upload class="upload-area" :fileList="fileList" :beforeUpload="importExcel">导入记录</a-upload>
            </a-menu-item>
            <a-menu-item key="export-excel" @click="exportExcel">导出分配物资</a-menu-item>
            <a-menu-item key="export-wc" v-hasPermission="'wc:wcName'" @click="exportWc">导出公厕</a-menu-item>
          </a-menu>
          <a-button>
            更多操作 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        &nbsp;
        <a-modal
          title="选择查看月份"
          v-model="modalVisible"
          :mask="false"
          :maskClosable="false"
          :width='350'
          style="left: -20%;top: 25%"
          @ok="viewDist"
          okText="提交">
          <div style="width: 100%; margin-top: -20px; margin-bottom: 10px">
            <a-radio-group @change="onRadioChange" v-model="radioValue">
              <a-radio-button :value="true">月选</a-radio-button>
              <a-radio-button :value="false">范围</a-radio-button>
            </a-radio-group>
          </div>
          <a-month-picker
            style="width: 100%;"
            v-if="radioValue"
            @change="handleMonthChange"
          />
          <a-range-picker
            v-else
            format="YYYY-MM"
            :placeholder="['开始月份', '结束月份']"
            :value="monthValue"
            :mode="mode"
            @panelChange="handlePanelChange"
          />
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
        <template slot="amountDist" slot-scope="text, record">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>总库存：{{ $tools.toNumFormant(record.amount) }}</div>
              <div v-if="record.amountOriginal!==record.amount">单位为「{{ record.unitOriginal }}」时总库存：{{ $tools.toNumFormant(record.amountOriginal) }}</div>
            </template>
            <span>{{ $tools.toNumFormant(text) }}</span>
          </a-popover>
        </template>
        <template slot="unit" slot-scope="text, record">
          <a-popover v-if="record.unitOriginal!==record.unit" placement="topLeft">
            <template slot="content">
              <div>原有单位：「{{ record.unitOriginal }}」</div>
            </template>
            <span>{{ text }}</span>
          </a-popover>
          <span v-else>{{ text }}</span>
        </template>
        <template slot="money" slot-scope="text, record">
          <a-popover v-if="record.moneyOriginal!==record.money" placement="topLeft">
            <template slot="content">
              <div>原有单位为「{{ record.unitOriginal }}」时单价：{{ $tools.addZero($tools.toNumFormant(record.moneyOriginal)) }}</div>
            </template>
            <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
          </a-popover>
          <span v-else>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="unit(record)" title="单位转换"/>
          &nbsp;
          <a-icon v-hasPermission="'wc:wcName','wcStoreroom:add'" type="fork" @click="dist(record)" title="分配"/>
        </template>
      </a-table>
    </div>
    <!-- 单位转换 -->
    <unit-conversion
      ref="unitConversion"
      @close="handleUnitConversionClose"
      @success="handleUnitConversionSuccess"
      :unitConversionVisiable="unitConversion.visiable">
    </unit-conversion>
    <!-- 分配 -->
    <dist-wc
      ref="distWc"
      @close="handleDistWcClose"
      @success="handleDistWcSuccess"
      :distWcVisiable="distWc.visiable">
    </dist-wc>
    <!-- 查看记录 -->
    <storeroom-dist-wc
      :dateTitle="dateTitle"
      :dateData="dateData"
      :storeroomDistWcVisiable="storeroomDistWc.visiable"
      @close="handleStoreroomDistWcClose">
    </storeroom-dist-wc>
    <!-- 导入结果 -->
    <import-result
      @close="handleClose"
      :importData="importData"
      :errors="errors"
      :times="times"
      :successColumns="successColumns"
      :importResultVisible="importResultVisible">
    </import-result>
  </a-card>
</template>

<script>
import UnitConversion from './UnitConversion'
import DistWc from './DistWc'
import StoreroomDistWc from './StoreroomDistWc'
import ImportResult from '@/components/view/ImportResult'

export default {
  name: 'StoreroomDist',
  components: { UnitConversion, DistWc, StoreroomDistWc, ImportResult },
  data () {
    return {
      fileList: [],
      importData: [],
      times: '',
      errors: [],
      successColumns: [],
      importResultVisible: false,
      status: '0',
      advanced: false,
      radioValue: true,
      modalVisible: false,
      storeroomInfo: {
        visiable: false,
        data: {}
      },
      unitConversion: {
        visiable: false
      },
      distWc: {
        visiable: false
      },
      storeroomDistWc: {
        visiable: false
      },
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      dateTitle: '',
      dataSource: [],
      monthValue: [],
      monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      mode: ['month', 'month'],
      dictData: {},
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
        // typeApplication: '1,2,4',
        typeApplication: '1,4',
        toDeptIds: '26,27,28,29'
      },
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品编号',
        dataIndex: 'id'
      }, {
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '剩余库存',
        dataIndex: 'amountDist',
        scopedSlots: { customRender: 'amountDist' }
      }, {
        title: '单位',
        dataIndex: 'unit',
        scopedSlots: { customRender: 'unit' }
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
        title: '部门',
        dataIndex: 'toDeptId',
        customRender: (text, row, index) => {
          return this.dictData.toDeptIds[text]
        }
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        width: 100
      }]
    }
  },
  mounted () {
    this.loading = true
    this.loadSelect()
    this.fetch()
  },
  methods: {
    handleClose () {
      this.importResultVisible = false
    },
    importExcel (file) {
      const formData = new FormData()
      formData.append('file', file)
      this.$message.loading('处理中', 0)
      this.$upload('storeroom/import', formData).then((r) => {
        let data = r.data.data
        if (data.data.length) {
          this.fetch()
        }
        this.$message.destroy()
        this.importData = data.data
        this.errors = data.error
        this.times = data.time / 1000
        console.log(this.importData)
        console.log(this.errors)
        this.successColumns = [{
          title: '日期',
          dataIndex: 'year',
          customRender: (text, row, index) => {
            return `${text}-${row.month}-${row.day}`
          }
        }, {
          title: '公厕编号',
          dataIndex: 'wcNum'
        }, {
          title: '公厕名称',
          dataIndex: 'wcName'
        }, {
          title: '物品编号',
          dataIndex: 'storeroomId'
        }, {
          title: '物品名称',
          dataIndex: 'storeroomName'
        }, {
          title: '分配数量',
          dataIndex: 'amount'
        }]
        this.importResultVisible = true
      }).catch((r) => {
        this.$message.destroy()
        console.error(r)
      })
      return false
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
      this.$export('storeroom/distExcel', {
        status: this.status,
        sortField: sortField,
        sortOrder: sortOrder,
        pageSize: pageSize,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    exportWc () {
      this.$export('storeroom/distWc', {pageSize: 99999})
    },
    downloadTemplate () {
      this.$download('storeroom/template', {}, '物资分配_导入模板.xlsx')
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.remark = ''
        this.queryParams.name = ''
      }
    },
    handleStoreroomInfoClose () {
      this.storeroomInfo.visiable = false
    },
    unit (record) {
      this.$refs.unitConversion.setFormValues(record)
      this.unitConversion.visiable = true
    },
    handleUnitConversionClose () {
      this.unitConversion.visiable = false
    },
    handleUnitConversionSuccess () {
      this.unitConversion.visiable = false
      this.$message.success('分配成功')
      this.search()
    },
    dist (record) {
      this.$refs.distWc.setFormValues(record)
      this.distWc.visiable = true
    },
    handleDistWcClose () {
      this.distWc.visiable = false
    },
    handleDistWcSuccess () {
      this.distWc.visiable = false
      this.$message.success('分配成功')
      this.search()
    },
    handleStoreroomDistWcClose () {
      this.storeroomDistWc.visiable = false
    },
    handleTypeApplicationChange (value) {
      this.queryParams.typeApplication = value || ''
    },
    handleToDeptIdsChange (value) {
      this.queryParams.toDeptIds = value || ''
    },
    showModal () {
      this.modalVisible = true
    },
    viewDist () {
      if (JSON.stringify(this.dateData.dateForm) !== '{}') {
        this.modalVisible = false
        this.storeroomDistWc.visiable = true
      } else {
        this.$message.warning('请选择查看月份')
      }
    },
    onRadioChange (e) {
      // 切换radio时 重置日期选择data
      this.dateData = {
        dateForm: {},
        dateTo: {}
      }
      this.monthValue = []
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
    handlePanelChange (value, mode) {
      let yearForm = value[0].format('YYYY')
      let yearTo = value[1].format('YYYY')
      let monthForm = value[0].format('MM')
      let monthTo = value[1].format('MM')
      if (yearForm === yearTo) {
        this.dateData.dateForm = {
          year: yearForm,
          month: this.monthData.slice(this.monthData.indexOf(monthForm), this.monthData.indexOf(monthTo) + 1).join(',')
        }
      } else {
        this.dateData.dateForm = {
          year: yearForm,
          month: this.monthData.slice(this.monthData.indexOf(monthForm)).join(',')
        }
        this.dateData.dateTo = {
          year: yearTo,
          month: this.monthData.slice(0, this.monthData.indexOf(monthTo) + 1).join(',')
        }
      }
      this.monthValue = value
      this.mode = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
      this.dateTitle = `${value[0].format('YYYY年MM月')} ~ ${value[1].format('YYYY年MM月')}`
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
        // typeApplication: '1,2,4',
        typeApplication: '1,4',
        toDeptIds: '26,27,28,29'
      }
      this.status = '0'
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    loadSelect () {
      this.dictData = {
        typeApplication: {
          1: '保洁物品',
          // 2: '劳保物品',
          4: '维修用品'
        },
        toDeptIds: {
          26: '南分队',
          27: '北分队',
          28: '保洁分队',
          29: '维修分队'
        }
      }
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
      params.typeApplication = this.queryParams.typeApplication
      params.toDeptIds = this.queryParams.toDeptIds
      this.$get('storeroom/storeroomDist', {
        status: this.status,
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

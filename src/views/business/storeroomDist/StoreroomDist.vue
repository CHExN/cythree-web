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
                  <a-select-option key="1,2,4">全部</a-select-option>
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
        &nbsp;
        <a-modal
          title="选择查看日期"
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
        <template slot="amountDist" slot-scope="text">
          <span>{{ $tools.toNumFormant(text) }}</span>
        </template>
        <template slot="money" slot-scope="text">
          <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="remark" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 200px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'wc:wcName','wcStoreroom:add'" type="fork" @click="dist(record)" title="分配"/>
        </template>
      </a-table>
    </div>
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
  </a-card>
</template>

<script>
import DistWc from './DistWc'
import StoreroomDistWc from './StoreroomDistWc'

export default {
  name: 'StoreroomDist',
  components: { DistWc, StoreroomDistWc },
  data () {
    return {
      advanced: false,
      radioValue: true,
      modalVisible: false,
      storeroomInfo: {
        visiable: false,
        data: {}
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
        typeApplication: '1,2,4',
        toDeptIds: '26,27,28,29'
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
        title: '剩余库存',
        dataIndex: 'amountDist',
        scopedSlots: { customRender: 'amountDist' }
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
        title: '部门',
        dataIndex: 'toDeptId',
        customRender: (text, row, index) => {
          return this.dictData.toDeptIds[text]
        }
      }, {
        title: '备注',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' },
        width: 200
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
    dist (record) {
      this.$refs.distWc.setFormValues(record)
      this.distWc.visiable = true
    },
    handleDistWcClose () {
      this.distWc.visiable = false
    },
    handleStoreroomDistWcClose () {
      this.storeroomDistWc.visiable = false
    },
    handleDistWcSuccess () {
      this.distWc.visiable = false
      this.selectedRowKeys = []
      this.$message.success('分配成功')
      this.search()
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
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.paginationInfo = null
      // 重置查询参数
      this.queryParams = {
        typeApplication: '1,2,4',
        toDeptIds: '26,27,28,29'
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
      this.dictData = {
        typeApplication: {
          1: '保洁物品',
          2: '劳保物品',
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

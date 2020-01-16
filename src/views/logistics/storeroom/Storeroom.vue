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
        <a-button type="primary" ghost v-hasPermission="'storeroomOut:add'" @click="addStoreroomOut">出库</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange"
               :scroll="{ x: 900 }"
               rowKey="id">
        <template slot="amount" slot-scope="text">
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
      </a-table>
    </div>
    <!-- 出库 -->
    <out-add
      ref="outAdd"
      @close="handleOutAddClose"
      @success="handleOutAddSuccess"
      :outAddVisiable="outAdd.visiable">
    </out-add>
  </a-card>
</template>

<script>
import OutAdd from '../storeroomOut/StoreroomOutAdd'
import RangeDate from '@/components/datetime/RangeDate'

export default {
  name: 'Storeroom',
  components: { OutAdd, RangeDate },
  data () {
    return {
      advanced: false,
      outAdd: {
        visiable: false
      },
      dataSource: [],
      selectedRowKeys: [],
      paginationInfo: null,
      dictData: {},
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
        title: '库存',
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
        title: '收据',
        dataIndex: 'receipt'
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
        title: '备注',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' },
        width: 200
      }, {
        title: '入库日期',
        dataIndex: 'date'
      }, {
        title: '入库单号',
        dataIndex: 'putNum'
      }]
    }
  },
  mounted () {
    this.loadSelect()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
    addStoreroomOut () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要出库的记录')
        return
      }
      let typeApplication
      let supplier
      let outData = []
      for (let key of this.dataSource) {
        if (this.selectedRowKeys.includes(key.id)) {
          if (typeApplication === undefined) {
            typeApplication = key.typeApplication
          }
          if (supplier === undefined) {
            supplier = key.supplier
          }
          if (typeApplication === key.typeApplication) {
            if (supplier === key.supplier) {
              key.storeroomCount = key.amount
              outData.push(this.$tools.deepClone(key))
            } else {
              outData = []
              this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(key.id), 1)
              this.$message.warning('出库的供应商只能有一种')
              return
            }
          } else {
            outData = []
            this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(key.id), 1)
            this.$message.warning('出库的物品类型只能有一种')
            return
          }
        }
      }
      let that = this
      this.$confirm({
        title: '确定出库所选中的记录?',
        content: '当您点击确定按钮后，这些记录将会被出库',
        centered: true,
        onOk () {
          that.$refs.outAdd.setTableValues(outData)
          that.outAdd.visiable = true
        },
        onCancel () {
          that.selectedRowKeys = []
        }
      })
    },
    handleOutAddClose () {
      this.outAdd.visiable = false
    },
    handleOutAddSuccess () {
      this.outAdd.visiable = false
      this.selectedRowKeys = []
      this.$message.success('新增出库单成功')
      this.search()
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
      this.$get('storeroom', {
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

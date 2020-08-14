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
                label="物品名称"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-textarea auto-size v-model="queryParams.name"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
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
                  label="月份"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-range-picker
                    format="YYYY-MM"
                    :placeholder="['开始月份', '结束月份']"
                    :value="monthValue"
                    :mode="mode"
                    :allowClear="false"
                    style="width: 100%;"
                    @panelChange="handlePanelChange"
                  />
                </a-form-item>
              </a-col>
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
                  label="操作账号"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.username"/>
                </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="插入日期"
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
        <a-button @click="batchDelete" v-hasPermission="'wcStoreroom:delete'">删除</a-button>
        <a-button @click="deleteAll" v-hasPermission="'wcStoreroom:delete'" :loading="loadingDelete">删除全部</a-button>
        <!-- <a-button @click="batchDelete">删除</a-button> -->
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               rowKey="id"
               @change="handleTableChange">
        <template slot="amount" slot-scope="text">
          <span>{{ $tools.addZero(text) }}</span>
        </template>
        <template slot="date" slot-scope="text, record">
          <span>{{ [record.year,record.month,record.day].join('-') }}</span>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script>
import RangeDate from '@/components/datetime/RangeDate'
import moment from 'moment'

export default {
  name: 'StoreroomWc',
  components: { RangeDate },
  data () {
    return {
      advanced: false,
      dataSource: [],
      dictData: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      queryParams: {},
      selectedRowKeys: [],
      dateData: {
        dateForm: {},
        dateTo: {}
      },
      monthValue: [],
      monthData: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      mode: ['month', 'month'],
      pagination: {
        size: 'small',
        pageSizeOptions: ['20', '40', '80', '160'],
        defaultCurrent: 1,
        defaultPageSize: 20,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`
      },
      loading: false,
      loadingDelete: false
    }
  },
  computed: {
    columns () {
      let { sortedInfo } = this
      sortedInfo = sortedInfo || {}
      return [{
        title: '公厕名称',
        dataIndex: 'wcName'
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum'
      }, {
        title: '所属分队',
        dataIndex: 'wcOwn'
      }, {
        title: '物品编号',
        dataIndex: 'storeroomId'
      }, {
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type',
        width: '6%'
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '物资类别',
        dataIndex: 'typeApplication',
        customRender: (text, row, index) => {
          return this.dictData.typeApplication[text]
        }
      }, {
        title: '分配数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'amount' && sortedInfo.order
      }, {
        title: '分配日期',
        dataIndex: 'date',
        scopedSlots: { customRender: 'date' },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'date' && sortedInfo.order
      }, {
        title: '操作账号',
        dataIndex: 'username'
      }, {
        title: '插入时间',
        dataIndex: 'createTime',
        customRender: (text, row, index) => {
          return this.$tools.getDateTime(text)
        },
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
      }]
    }
  },
  mounted () {
    // 设置年月
    this.dateData.dateForm.month = '01,02,03,04,05,06,07,08,09,10,11,12'
    this.dateData.dateForm.year = moment().year()
    this.monthValue = [moment().month(0), moment().month(11)]
    // 查询
    this.loading = true
    this.loadSelect()
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.wcNum = ''
        this.queryParams.wcName = ''
        this.queryParams.username = ''
        this.queryParams.createTimeFrom = ''
        this.queryParams.createTimeTo = ''
      }
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
      console.log(`[${value[0].format('YYYY-MM-DD')}, ${value[1].format('YYYY-MM-DD')}]`)
      console.log(this.dateData)
      this.monthValue = value
      this.mode = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
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
          that.$delete('wcStoreroom/' + that.selectedRowKeys.join(',')).then(() => {
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
    deleteAll () {
      this.loadingDelete = true
      let params = {...this.queryParams}
      params.pageSize = 999999999
      params.pageNum = 1
      this.$get('wcStoreroom/ids', {
        yearForm: this.dateData.dateForm.year || '',
        monthForm: this.dateData.dateForm.month || '',
        yearTo: this.dateData.dateTo.year || '',
        monthTo: this.dateData.dateTo.month || '',
        ...params
      }).then((r) => {
        this.loadingDelete = false
        if (r.data === 0) return this.$message.warning('无数据可删除')
        let that = this
        this.$confirm({
          title: `确定删除这${r.data}条记录?`,
          content: '当您点击确定按钮后，这些记录将会被彻底删除',
          centered: true,
          onOk () {
            that.loading = true
            that.$post('wcStoreroom/deleteAll', {
              yearForm: that.dateData.dateForm.year || '',
              monthForm: that.dateData.dateForm.month || '',
              yearTo: that.dateData.dateTo.year || '',
              monthTo: that.dateData.dateTo.month || '',
              ...params
            }).then(() => {
              that.$message.success('删除成功')
              that.search()
            })
          }
        })
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
        this.dictData = dictList
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
        createTimeFrom: '',
        createTimeTo: ''
      }
      // 设置年月
      this.dateData.dateForm.month = '01,02,03,04,05,06,07,08,09,10,11,12'
      this.dateData.dateForm.year = moment().year()
      this.monthValue = [moment().month(0), moment().month(11)]
      if (this.advanced) {
        // 清空时间选择
        this.$refs.createTime.reset()
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
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
      this.$get('wcStoreroom', {
        yearForm: this.dateData.dateForm.year || '',
        monthForm: this.dateData.dateForm.month || '',
        yearTo: this.dateData.dateTo.year || '',
        monthTo: this.dateData.dateTo.month || '',
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
  .alert {
    margin-bottom: .5rem;
  }
</style>

<template>
  <a-drawer
    :title="dateTitle+' 记录'"
    width=1200
    placement="right"
    @close="onClose"
    :visible="storeroomDistWcVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
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
                  label="物品名称"
                  :labelCol="{span: 5}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.name"/>
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
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reboot">重置</a-button>
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
          </span>
        </a-row>
      </a-form>
    </div>
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               @change="handleTableChange">
        <template slot="amount" slot-scope="text">
          <span>{{ $tools.addZero(text) }}</span>
        </template>
        <template slot="date" slot-scope="text, record">
          <span>{{ [record.year,record.month,record.day].join('-') }}</span>
        </template>
      </a-table>
    </div>
  </a-drawer>
</template>
<script>
export default {
  name: 'distWC',
  props: {
    storeroomDistWcVisiable: {
      default: false
    },
    dateTitle: {
      require: true
    },
    dateData: {
      require: true
    }
  },
  data () {
    return {
      advanced: false,
      dataSource: [],
      dictData: {},
      paginationInfo: null,
      queryParams: {},
      pagination: {
        size: 'small',
        pageSizeOptions: ['20', '40', '80', '160'],
        defaultCurrent: 1,
        defaultPageSize: 20,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`
      },
      loading: false
    }
  },
  computed: {
    columns () {
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
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '物资类别',
        dataIndex: 'typeApplication',
        customRender: (text, row, index) => {
          return this.dictData.typeApplication[text]
        }
      }, {
        title: '分配数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '分配日期',
        dataIndex: 'date',
        scopedSlots: { customRender: 'date' }
      }, {
        title: '操作账号',
        dataIndex: 'username'
      }]
    }
  },
  mounted () {
  },
  methods: {
    onClose () {
      this.$emit('close')
      this.reboot()
      this.dataSource = []
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.name = ''
        this.queryParams.wcName = ''
        this.queryParams.username = ''
      }
    },
    handleTypeApplicationChange (value) {
      this.queryParams.typeApplication = value || ''
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
      this.queryParams = {}
    },
    reboot () {
      this.reset()
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
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
  },
  watch: {
    storeroomDistWcVisiable () {
      if (this.storeroomDistWcVisiable) {
        if (JSON.stringify(this.dictData) === '{}') this.loadSelect()
        this.fetch()
      }
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

<template>
  <a-drawer
    width=500
    placement="right"
    @close="onClose"
    :closable="false"
    :visible="wcListVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="24">
              <a-form-item
                label="公厕名称"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcName"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="24" >
                <a-form-item
                  label="公厕编号"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcNum"/>
                </a-form-item>
              </a-col>
              <a-col :md="24" >
                <a-form-item
                  label="分队名"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-select
                    mode="multiple"
                    :allowClear="true"
                    @change="handleOwnChange">
                    <a-select-option v-for="i in filteredWcOwnOptions" :key="i">{{ i }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
          </div>
          <span style="float: right; margin: 3px auto 1em;">
            <a @click="toggleAdvanced" style="margin-left: 8px">
              {{advanced ? '收起' : '展开'}}
              <a-icon :type="advanced ? 'up' : 'down'" />
            </a>
            &nbsp;
            <a-button type="primary" @click="search">查询</a-button>
            <a-button style="margin-left: 8px" @click="reset">重置</a-button>
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
               :scroll="{ y: 765 }"
               rowKey="wcId"
               @change="handleTableChange">
        <template slot="district" slot-scope="text, record">
          <a-icon type="check-circle" theme="twoTone" twoToneColor="#9451ff" @click="determine(record)" title="确认"></a-icon>
        </template>
      </a-table>
    </div>
    <div class="drawer-bootom-button">
      <a-button @click="onClose">取消</a-button>
    </div>
  </a-drawer>
</template>
<script>
export default {
  name: 'WcList',
  props: {
    wcListVisiable: {
      default: false
    }
  },
  data () {
    return {
      advanced: false,
      dataSource: [],
      paginationInfo: null,
      wcOwnData: [],
      queryParams: {
        wcOwn: []
      },
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
    filteredWcOwnOptions () {
      return this.wcOwnData.filter(o => !this.queryParams.wcOwn.includes(o))
    },
    columns () {
      return [{
        title: '公厕名',
        dataIndex: 'wcName',
        scopedSlots: { customRender: 'wcName' }
      }, {
        title: '公厕名',
        dataIndex: 'wcNum',
        scopedSlots: { customRender: 'wcNum' }
      }, {
        title: '操作',
        dataIndex: 'district',
        scopedSlots: { customRender: 'district' }
      }]
    }
  },
  methods: {
    determine (record) {
      this.$emit('change', record.wcName, record.wcNum, record.wcId)
      this.onClose()
    },
    onClose () {
      this.$emit('close')
      this.dataSource = []
      this.wcOwnData = []
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.wcNum = ''
        this.queryParams.wcOwn = []
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
        wcOwn: []
      }
      this.fetch()
    },
    handleTableChange (pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.fetch({
        ...this.queryParams
      })
    },
    handleOwnChange (value) {
      this.queryParams.wcOwn = value || ''
    },
    loadSelect () {
      this.$get('wc/wcOwns', {
      }).then((r) => {
        this.wcOwnData = r.data.filter(d => d)
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
      this.$get('wc/wcName', {
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
    wcListVisiable () {
      if (this.wcListVisiable && this.dataSource.length === 0) {
        this.loadSelect()
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

<template>
  <a-drawer
    width=600
    placement="right"
    @close="onClose"
    :closable="false"
    :visible="storeroomOutListVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row>
            <a-col :md="24">
              <a-form-item
                label="出库单号"
                :labelCol="{span: 8}"
                :wrapperCol="{span: 15, offset: 1}">
                <a-input v-model="queryParams.num"/>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <span style="float: right; margin: 3px auto 1em;">
          <a-button type="primary" @click="search">查询</a-button>
          <a-button style="margin-left: 8px" @click="reset">重置</a-button>
        </span>
      </a-form>
    </div>
    <div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               :scroll="{ y: 765 }"
               rowKey="id"
               @change="handleTableChange">
      </a-table>
    </div>
    <div class="drawer-bootom-button">
      <a-button @click="onClose">取消</a-button>
      <a-button @click="determine" type="primary">提交</a-button></div>
  </a-drawer>
</template>
<script>
export default {
  name: 'StoreroomOutList',
  props: {
    storeroomOutListVisiable: {
      default: false
    }
  },
  data () {
    return {
      advanced: false,
      dataSource: [],
      paginationInfo: null,
      queryParams: {},
      selectedRowKeys: [],
      selectedRows: [],
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
        title: '出库单号',
        dataIndex: 'num',
        scopedSlots: { customRender: 'num' }
      }, {
        title: '总价格',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '出库部门',
        dataIndex: 'toDeptName',
        scopedSlots: { customRender: 'toDeptName' }
      }]
    }
  },
  methods: {
    determine () {
      if (!this.selectedRowKeys.length) {
        this.$message.warning('请选择需要绑定的记录')
        return
      }
      this.$emit('change', this.selectedRows.map(i => i.num).join(), this.selectedRowKeys.join())
      this.onClose()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onClose () {
      this.$emit('close')
      this.selectedRowKeys = []
      this.selectedRows = []
      this.dataSource = []
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
      this.$get('storeroomOut/getStoreroomOutSimplify', {
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
    storeroomOutListVisiable () {
      if (this.storeroomOutListVisiable && this.dataSource.length === 0) {
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

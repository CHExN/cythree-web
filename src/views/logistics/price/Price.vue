<template>
  <a-card :bordered="false" class="card-area">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
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
                label="Key"
                :labelCol="{span: 5}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.id" />
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
      <div class="operator">
        <a-button v-hasPermission="'price:add'" type="primary" ghost @click="add">新增</a-button>
        <a-button v-hasPermission="'price:delete'" @click="batchDelete">删除</a-button>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleTableChange"
               rowKey="id"
               :scroll="{ x: 900 }">
        <template slot="money" slot-scope="text">
          <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-icon v-hasPermission="'price:update'" type="setting" theme="twoTone" twoToneColor="#4a9ff5" @click="edit(record)" title="修改"></a-icon>
          <a-badge v-hasNoPermission="'price:update'" status="warning" text="无权限"></a-badge>
        </template>
      </a-table>
    </div>
    <!-- 新增物品价格 -->
    <price-add
      @close="handlePriceAddClose"
      @success="handlePriceAddSuccess"
     :priceAddVisiable="priceAddVisiable">
    </price-add>
    <!-- 修改物品价格 -->
    <price-edit
      ref="priceEdit"
      @close="handlePriceEditClose"
      @success="handlePriceEditSuccess"
      :priceEditVisiable="priceEditVisiable">
    </price-edit>
  </a-card>
</template>

<script>
import PriceAdd from './PriceAdd'
import PriceEdit from './PriceEdit'

export default {
  name: 'Price',
  components: { PriceAdd, PriceEdit },
  data () {
    return {
      advanced: false,
      dataSource: [],
      selectedRowKeys: [],
      paginationInfo: null,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      queryParams: {},
      priceAddVisiable: false,
      priceEditVisiable: false,
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: 'Key',
        dataIndex: 'id'
      }, {
        title: '价格',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        fixed: 'right',
        width: 150
      }]
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handlePriceAddSuccess () {
      this.priceAddVisiable = false
      this.$message.success('新增物品价格成功')
      this.search()
    },
    handlePriceAddClose () {
      this.priceAddVisiable = false
    },
    add () {
      this.priceAddVisiable = true
    },
    handlePriceEditSuccess () {
      this.priceEditVisiable = false
      this.$message.success('修改物品价格成功')
      this.search()
    },
    handlePriceEditClose () {
      this.priceEditVisiable = false
    },
    edit (record) {
      this.$refs.priceEdit.setFormValues(record)
      this.priceEditVisiable = true
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
          that.$delete('price/' + that.selectedRowKeys.join(',')).then(() => {
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
      this.$get('price', {
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

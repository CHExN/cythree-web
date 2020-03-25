<template>
  <a-drawer
    :maskClosable="false"
    width=800
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="distWcVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <a-row>
          <div :class="advanced ? null: 'fold'">
            <a-col :md="12" :sm="24" >
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
            <a-col :md="12" :sm="24">
              <a-form-item
                label="公厕编号"
                :labelCol="{span: 4}"
                :wrapperCol="{span: 18, offset: 1}">
                <a-input v-model="queryParams.wcNum"/>
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="12" :sm="24" >
                <a-form-item
                  label="公厕名称"
                  :labelCol="{span: 4}"
                  :wrapperCol="{span: 18, offset: 1}">
                  <a-input v-model="queryParams.wcName"/>
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
      <div class="alert">
        <a-alert type="info" :show-icon="true">
          <div slot="message">
            已选择&nbsp;
            <a style="font-weight: 600">{{selectedRowKeys.length}}</a>&nbsp;
            项&nbsp;,&nbsp;
            <span v-if="storeroom">
              <a>{{storeroom.name}}</a>&nbsp;
              剩余&nbsp;
              <a>{{storeroom.amountDist}}</a>&nbsp;
              {{storeroom.unit}}
            </span>
            <a style="margin-left: 24px" @click="onEmpty">清空</a>
          </div>
        </a-alert>
      </div>
      <!-- 表格区域 -->
      <a-table ref="TableInfo"
               :columns="columns"
               :dataSource="dataSource"
               :pagination="pagination"
               :loading="loading"
               :rowSelection="{
                 selectedRowKeys: this.selectedRowKeys,
                 onChange: this.onSelectChange,
                 onSelect: this.onSelect,
                 onSelectAll: this.onSelectAll
               }"
               :scroll="{ y: 715 }"
               rowKey="wcId"
               @change="handleTableChange">
        <template slot="wcName" slot-scope="text">
          <a-popover placement="topLeft">
            <template slot="content">
              <div>{{text}}</div>
            </template>
            <p style="width: 150px;margin-bottom: 0">{{text}}</p>
          </a-popover>
        </template>
        <template slot="wcNum" slot-scope="text">
          <span  style="width: 100px">{{text}}</span>
        </template>
        <template slot="wcOwn" slot-scope="text">
          <span  style="width: 100px">{{text}}</span>
        </template>
        <template slot="district" slot-scope="text, record">
          <template v-if="selectedRowKeys.includes(record.wcId)">
            <a-input-number
              v-model="rowIdCounts[record.wcId]"
              :min="0"
              :max="storeroom.amountDist + rowIdCounts[record.wcId]"
              :precision="2"
              :formatter="value => value"
              :parser="value => parseFloat(value) || 0"
              @change="onInputNumberChange(rowIdCounts[record.wcId], record.wcId)"
            />
          </template>
          <span v-else></span>
        </template>
      </a-table>
    </div>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="butLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
export default {
  name: 'distWC',
  props: {
    distWcVisiable: {
      default: false
    }
  },
  data () {
    return {
      advanced: false,
      dataSource: [],
      selectedRowKeys: [],
      selectedRows: [],
      rowIdCounts: {},
      paginationInfo: null,
      queryParams: {
        wcOwn: []
      },
      wcOwnData: [],
      pagination: {
        size: 'small',
        pageSizeOptions: ['20', '40', '80', '160'],
        defaultCurrent: 1,
        defaultPageSize: 20,
        showSizeChanger: true,
        showTotal: total => `共 ${total} 条`
      },
      loading: false,
      butLoading: false,
      storeroom: null
    }
  },
  computed: {
    filteredWcOwnOptions () {
      return this.wcOwnData.filter(o => !this.queryParams.wcOwn.includes(o))
    },
    columns () {
      return [{
        title: '公厕名称',
        dataIndex: 'wcName',
        width: 200,
        scopedSlots: { customRender: 'wcName' }
      }, {
        title: '公厕编号',
        dataIndex: 'wcNum',
        width: 150,
        scopedSlots: { customRender: 'wcNum' }
      }, {
        title: '分队',
        dataIndex: 'wcOwn',
        width: 150,
        scopedSlots: { customRender: 'wcOwn' }
      }, {
        title: '分配数量',
        dataIndex: 'district',
        scopedSlots: { customRender: 'district' }
      }]
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.wcName = ''
      }
    },
    setFormValues ({...storeroom}) {
      this.storeroom = storeroom
    },
    handleOwnChange (value) {
      this.queryParams.wcOwn = value || []
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onSelect (record, selected) {
      if (selected) {
        this.$set(this.rowIdCounts, record.wcId, this.storeroom.amountDist >= 1 ? 1 : this.storeroom.amountDist)
        // this.storeroom.amountDist -= this.rowIdCounts[record.wcId]
        let amountDist = this.storeroom.amountDist - this.rowIdCounts[record.wcId]
        // 四舍五入，保留小数点后两位
        // this.storeroom.amountDist = Math.round(amountDist * 100) / 100
        this.storeroom.amountDist = this.$tools.rounding(amountDist, 2)
      } else {
        // 加的时候就不用四舍五入了
        this.storeroom.amountDist += this.rowIdCounts[record.wcId]
        delete this.rowIdCounts[record.wcId]
      }
    },
    onSelectAll (selected, selectedRows, changeRows) {
      if (selected) {
        changeRows.forEach(record => {
          this.$set(this.rowIdCounts, record.wcId, this.storeroom.amountDist >= 1 ? 1 : this.storeroom.amountDist)
          // this.storeroom.amountDist -= this.rowIdCounts[record.wcId]
          let amountDist = this.storeroom.amountDist - this.rowIdCounts[record.wcId]
          // 四舍五入，保留小数点后两位
          // this.storeroom.amountDist = Math.round(amountDist * 100) / 100
          this.storeroom.amountDist = this.$tools.rounding(amountDist, 2)
        })
      } else {
        changeRows.forEach(record => {
          // 加的时候就不用四舍五入了
          this.storeroom.amountDist += this.rowIdCounts[record.wcId]
          delete this.rowIdCounts[record.wcId]
        })
      }
    },
    onEmpty () {
      // 重置剩余库存为最大库存
      this.storeroom.amountDist = this.storeroom.storeroomCount
      // 重置选中
      this.selectedRowKeys = []
      // 重置选中的id count集
      this.rowIdCounts = {}
    },
    onClose () {
      this.onEmpty()
      this.$emit('close')
    },
    onInputNumberChange (value, wcId) {
      // 已选的分配总数
      let count = this.$tools.sumArr(Object.values(this.rowIdCounts))
      // 最大库存
      let storeroomCount = this.storeroom.storeroomCount
      // 如果已选的分配总数大于最大库存
      if (count > storeroomCount) {
        // 则把已选的分配总数减去错误的数，得到处理此项，其他所有项的分配总数，之后用最大库存减它，得到剩余库存，把这些都给当前项
        this.rowIdCounts[wcId] = storeroomCount - (count - value)
        // 剩余库存归零
        this.storeroom.amountDist = 0
        return
      }
      let amountDist = storeroomCount - count
      // 四舍五入，保留小数点后两位
      // this.storeroom.amountDist = Math.round(amountDist * 100) / 100
      this.storeroom.amountDist = this.$tools.rounding(amountDist, 2)
    },
    handleSubmit () {
      let rowIdCountsKey = Object.keys(this.rowIdCounts)
      if (rowIdCountsKey.length === 0) {
        this.$message.warning('格式出错，请检查表单')
        return
      }
      let dataList = []
      rowIdCountsKey.forEach(key => {
        let amount = this.rowIdCounts[key]
        if (amount !== 0) {
          dataList.push({
            wcId: parseInt(key),
            storeroomId: this.storeroom.id,
            amount: amount
          })
        }
      })
      // console.log(JSON.stringify(dataList))
      this.butLoading = true
      this.$post('wc/addWcStoreroom', {
        wcStoreroomStr: JSON.stringify(dataList),
        amountDist: this.storeroom.amountDist
      }).then((r) => {
        this.butLoading = false
        this.reset()
        this.$emit('success')
        // 这里为什么不能成功执行catch呢
      // }).catch(() => {
        // this.butLoading = false
      })
    },
    search () {
      this.fetch({
        ...this.queryParams
      })
    },
    reset () {
      this.onEmpty()
      this.advanced = false
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
    distWcVisiable () {
      if (this.distWcVisiable && this.dataSource.length === 0) {
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

<template>
  <a-drawer
    title="新增办公用品申请"
    :maskClosable="false"
    width=920
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="officeSuppliesAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loadingTable"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      rowKey="id"
    >
      <div
        slot="filterDropdown"
        slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
        style="padding: 8px"
      >
        <a-input
          autoFocus
          v-ant-ref="c => searchInput = c"
          :placeholder="`搜索物品名称`"
          :value="selectedKeys[0]"
          @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          style="width: 188px; margin-bottom: 8px; display: block;"
        />
        <a-button
          type="primary"
          @click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
          icon="search"
          size="small"
          style="width: 90px; margin-right: 8px"
          >搜索</a-button
        >
        <a-button @click="() => handleReset(clearFilters)" size="small" style="width: 90px"
          >重置</a-button
        >
      </div>
      <a-icon
        slot="filterIcon"
        slot-scope="filtered"
        type="search"
        :style="{ color: filtered ? '#108ee9' : undefined }"
      />
      <template slot="customRender" slot-scope="text, record, index, column">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text.toString().split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
              >{{fragment}}</mark
            >
            <template v-else
              >{{fragment}}</template
            >
          </template>
        </span>
        <template v-else
          >{{text}}</template
        >
      </template>
      <template slot="remark" slot-scope="text, record">
        <a-input
          style="margin: -5px 0"
          v-model="record.remark"
          placeholder="备注"
        />
      </template>
      <template slot="amount" slot-scope="text, record">
        <a-input-number
          v-model="record.amount"
          style="width: 125px;"
          :min="0.01"
          :precision="2"
          :formatter="value => value"
          placeholder='数量'
        />
      </template>
    </a-table>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loadingButton">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { mapState } from 'vuex'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17, offset: 1 }
}

export default {
  name: 'OfficeSuppliesAdd',
  props: {
    officeSuppliesAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      searchText: '',
      searchInput: null,
      searchedColumn: '',
      loadingButton: false,
      loadingTable: false,
      formItemLayout,
      selectedRowKeys: [],
      selectedRows: [],
      dataSource: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name',
        scopedSlots: {
          filterDropdown: 'filterDropdown',
          filterIcon: 'filterIcon',
          customRender: 'customRender'
        },
        onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase())
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' }
      }]
    }
  },
  methods: {
    handleSearch (selectedKeys, confirm, dataIndex) {
      confirm()
      this.searchText = selectedKeys[0]
      this.searchedColumn = dataIndex
    },

    handleReset (clearFilters) {
      clearFilters()
      this.searchText = ''
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    reset () {
      this.loadingButton = false
      this.selectedRowKeys = []
      this.selectedRows = []
      this.dataSource = []
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      if (this.selectedRows.length === 0) {
        return this.$message.warning('请勾选需要的办公用品')
      }
      let amount = 0
      let planList = JSON.stringify(this.selectedRows, function (key, value) {
        if (key === 'amount' && value !== null) amount++
        return key === 'id' ? undefined : value
      })
      if (amount !== this.selectedRows.length) {
        return this.$message.warning('请检查数量列是否有空的')
      }
      this.loadingButton = true
      this.$post('application', {
        typeApplication: 3, // 办公用品
        deptId: this.user.deptId,
        planList: planList
      }).then((r) => {
        this.reset()
        this.$emit('success')
      }).catch(() => {
        this.loadingButton = false
      })
    }
  },
  watch: {
    officeSuppliesAddVisiable () {
      if (this.officeSuppliesAddVisiable) {
        this.loadingTable = true
        this.$get('planStable/getList', {}).then((r) => {
          this.loadingTable = false
          this.dataSource = r.data
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
</style>

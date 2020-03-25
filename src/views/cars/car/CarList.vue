<template>
  <a-drawer
    title="选择车辆"
    width=500
    placement="right"
    @close="onClose"
    :closable="false"
    :visible="carListVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <div>
      <!-- 表格区域 -->
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :scroll="{ y: 765 }"
        rowKey="carId"
      >
        <template slot="carNum" slot-scope="text, record">
          <a-tag :color="record.color==='1'?'orange':'blue'" style="font-size:100%">{{text}}</a-tag>
        </template>
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
  name: 'CarList',
  props: {
    carListVisiable: {
      default: false
    }
  },
  data () {
    return {
      dataSource: [],
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '车牌号',
        dataIndex: 'carNum',
        scopedSlots: { customRender: 'carNum' }
      }, {
        title: '状态',
        dataIndex: 'status',
        customRender: (text, row, index) => {
          switch (text) {
            case '1':
              return <a-badge status="success" text="行驶中"/>
            case '2':
              return <a-badge status="default" text="停驶中"/>
            default:
              return text
          }
        }
      }, {
        title: '操作',
        dataIndex: 'district',
        scopedSlots: { customRender: 'district' }
      }]
    }
  },
  methods: {
    determine (record) {
      this.$emit('change', record.carNum, record.carId)
      this.onClose()
    },
    onClose () {
      this.$emit('close')
      this.dataSource = []
    },
    fetch () {
      this.loading = true
      this.$get('car/carSimplify', {
      }).then((r) => {
        this.loading = false
        this.dataSource = r.data
      })
    }
  },
  watch: {
    carListVisiable () {
      if (this.carListVisiable && this.dataSource.length === 0) {
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

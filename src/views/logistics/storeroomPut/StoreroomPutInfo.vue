<template>
  <a-modal
    title="入库单信息"
    :centered="true"
    :width="1000"
    :visible="putInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false" style="margin-bottom: 32px">
        <detail-list>
          <detail-list-item term="单号">{{putInfoData.num}}</detail-list-item>
          <detail-list-item term="入库日期">{{putInfoData.date}}</detail-list-item>
          <detail-list-item term="总价">{{$tools.addZero($tools.toNumFormant(putInfoData.money))}}</detail-list-item>
          <detail-list-item term="物资类别">{{putInfoData.typeApplicationToDict}}</detail-list-item>
          <detail-list-item term="供应商">{{putInfoData.supplierToDict}}</detail-list-item>
          <detail-list-item term="经手人">{{putInfoData.handle}}</detail-list-item>
          <detail-list-item term="保管员">{{putInfoData.storage}}</detail-list-item>
          <detail-list-item term="创建时间">{{putInfoData.createTime}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list title="入库名单">
          <a-table ref="TableInfo"
                   :columns="columns"
                   :dataSource="dataSource"
                   :pagination="false"
                   :loading="loading"
                   rowKey="id">
            <template slot="amount" slot-scope="text">
              <span>{{ $tools.toNumFormant(text) }}</span>
            </template>
            <template slot="money" slot-scope="text">
              <span>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
            </template>
          </a-table>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'StoreroomPutInfo',
  props: {
    putInfoVisiable: {
      require: true,
      default: false
    },
    putInfoData: {
      require: true
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
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '入库数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '单价',
        dataIndex: 'money',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '收据',
        dataIndex: 'receipt'
      }, {
        title: '现库存',
        dataIndex: 'storeroomCount', // storeroomCount为null的话就是0
        customRender: (text, row, index) => {
          return text || 0
        }
      }]
    }
  },
  methods: {
    handleCancleClick () {
      this.dataSource = []
      this.loading = false
      this.$emit('close')
    }
  },
  watch: {
    putInfoVisiable () {
      if (this.putInfoVisiable) {
        this.loading = true
        this.$get('storeroomPut/storeroomByPutId', {
          putId: this.putInfoData.id
        }).then((r) => {
          this.loading = false
          this.dataSource = r.data
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

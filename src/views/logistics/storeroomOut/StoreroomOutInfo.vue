<template>
  <a-modal
    title="出库单信息"
    :centered="true"
    :width="1000"
    :visible="outInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false" style="margin-bottom: 32px">
        <detail-list>
          <detail-list-item term="单号">{{outInfoData.num}}</detail-list-item>
          <detail-list-item term="出库日期">{{outInfoData.date}}</detail-list-item>
          <detail-list-item term="总价">{{$tools.addZero($tools.toNumFormant(outInfoData.money))}}</detail-list-item>
          <detail-list-item term="物资类别">{{outInfoData.typeApplicationToDict}}</detail-list-item>
          <detail-list-item term="供应商">{{outInfoData.supplierToDict}}</detail-list-item>
          <detail-list-item term="出库部门">{{outInfoData.toDeptName}}</detail-list-item>
          <detail-list-item term="经手人">{{outInfoData.handle}}</detail-list-item>
          <detail-list-item term="保管员">{{outInfoData.storage}}</detail-list-item>
          <detail-list-item term="创建时间">{{outInfoData.createTime}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list title="出库名单">
          <a-table ref="TableInfo"
                   :columns="columns"
                   :dataSource="dataSource"
                   :pagination="false"
                   :loading="loading"
                   rowKey="id">
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
  name: 'StoreroomOutInfo',
  props: {
    outInfoVisiable: {
      require: true,
      default: false
    },
    outInfoData: {
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
        title: '出库数量',
        dataIndex: 'amount'
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '单价',
        dataIndex: 'money'
      }, {
        title: '收据',
        dataIndex: 'receipt'
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
    outInfoVisiable () {
      if (this.outInfoVisiable) {
        this.loading = true
        this.$get('storeroomOut/storeroomByOutId', {
          outId: this.outInfoData.id
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

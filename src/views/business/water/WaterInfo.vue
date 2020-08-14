<template>
  <a-modal
    title="水费信息"
    :centered="true"
    :width="800"
    :visible="waterInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list>
        <detail-list-item term="公厕名">{{waterInfoData.wcName}}</detail-list-item>
        <detail-list-item term="公厕编号">{{waterInfoData.wcNum}}</detail-list-item>
        <detail-list-item term="月份">{{`${waterInfoData.year}-${waterInfoData.month}`}}</detail-list-item>
        <detail-list-item term="实际用量">{{waterInfoData.actualAmount}}</detail-list-item>
        <detail-list-item term="单价">{{waterInfoData.unitPrice}}</detail-list-item>
        <detail-list-item term="自来水费">{{waterInfoData.tapWaterFee}}</detail-list-item>
        <detail-list-item term="水资源费">{{waterInfoData.waterResourcesFee}}</detail-list-item>
        <detail-list-item term="污水">{{waterInfoData.sewageFee}}</detail-list-item>
        <detail-list-item term="金额合计">{{waterInfoData.totalAmount}}</detail-list-item>
        <detail-list-item term="创建时间">{{$tools.getDateTime(waterInfoData.createTime)}}</detail-list-item>
        <detail-list-item term="修改时间">{{$tools.getDateTime(waterInfoData.modifyTime)}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'WaterInfo',
  props: {
    waterInfoVisiable: {
      require: true,
      default: false
    },
    waterInfoData: {
      require: true
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <a-modal
    title="电费信息"
    :centered="true"
    :width="800"
    :visible="electricityInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list>
        <detail-list-item term="公厕名">{{electricityInfoData.wcName}}</detail-list-item>
        <detail-list-item term="公厕编号">{{electricityInfoData.wcNum}}</detail-list-item>
        <detail-list-item term="月份">{{`${electricityInfoData.year}-${electricityInfoData.month}`}}</detail-list-item>
        <detail-list-item term="实际用量">{{electricityInfoData.actualAmount}}</detail-list-item>
        <detail-list-item term="单价">{{electricityInfoData.unitPrice}}</detail-list-item>
        <detail-list-item term="购电方式">{{electricityInfoData.type}}</detail-list-item>
        <detail-list-item term="缴费日期">{{electricityInfoData.recDate ? electricityInfoData.recDate.substr(0,10) : ''}}</detail-list-item>
        <detail-list-item term="金额合计">{{electricityInfoData.totalAmount}}</detail-list-item>
        <detail-list-item term="创建时间">{{$tools.getDateTime(electricityInfoData.createTime)}}</detail-list-item>
        <detail-list-item term="修改时间">{{$tools.getDateTime(electricityInfoData.modifyTime)}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'ElectricityInfo',
  props: {
    electricityInfoVisiable: {
      require: true,
      default: false
    },
    electricityInfoData: {
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

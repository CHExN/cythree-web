<template>
  <a-modal
    title="灭火器信息"
    :centered="true"
    :width="850"
    :visible="fireExtinguisherInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="资产名称">{{fireExtinguisherInfoData.assetName}}</detail-list-item>
          <detail-list-item term="品牌型号">{{fireExtinguisherInfoData.brandModel}}</detail-list-item>
          <detail-list-item term="配发日期1">{{fireExtinguisherInfoData.allotmentDate1}}</detail-list-item>
          <detail-list-item term="配发日期2">{{fireExtinguisherInfoData.allotmentDate2}}</detail-list-item>
          <detail-list-item term="责任人">{{fireExtinguisherInfoData.user}}</detail-list-item>
          <detail-list-item term="检测日期1">{{fireExtinguisherInfoData.testDate1}}</detail-list-item>
          <detail-list-item term="检测日期2">{{fireExtinguisherInfoData.testDate2}}</detail-list-item>
          <detail-list-item term="公厕编号">{{fireExtinguisherInfoData.wcNum}}</detail-list-item>
          <detail-list-item term="公厕名称">{{fireExtinguisherInfoData.wcName}}</detail-list-item>
          <detail-list-item term="规格1">{{fireExtinguisherInfoData.specification1}}</detail-list-item>
          <detail-list-item term="规格2">{{fireExtinguisherInfoData.specification2}}</detail-list-item>
          <detail-list-item term="摆放地点">{{fireExtinguisherInfoData.place}}</detail-list-item>
          <detail-list-item term="备注">{{fireExtinguisherInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'FireExtinguisherInfo',
  props: {
    fireExtinguisherInfoVisiable: {
      require: true,
      default: false
    },
    fireExtinguisherInfoData: {
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-fireExtinguisherd i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-fireExtinguisherd .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

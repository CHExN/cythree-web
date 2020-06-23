<template>
  <a-modal
    title="充电柜信息"
    :centered="true"
    :width="850"
    :visible="chargingCabinetInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="资产名称">{{chargingCabinetInfoData.assetName}}</detail-list-item>
          <detail-list-item term="品牌型号">{{chargingCabinetInfoData.brandModel}}</detail-list-item>
          <detail-list-item term="配发日期">{{chargingCabinetInfoData.allotmentDate}}</detail-list-item>
          <detail-list-item term="责任人">{{chargingCabinetInfoData.user}}</detail-list-item>
          <detail-list-item term="使用部门">{{chargingCabinetInfoData.useDeptName}}</detail-list-item>
          <detail-list-item term="充电端口数">{{chargingCabinetInfoData.chargingSectionsNumber}}</detail-list-item>
          <detail-list-item term="能否充电">{{getIfCharge(chargingCabinetInfoData.ifCharge)}}</detail-list-item>
          <detail-list-item term="摆放地点">{{chargingCabinetInfoData.place}}</detail-list-item>
          <detail-list-item term="备注">{{chargingCabinetInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'ChargingCabinetInfo',
  props: {
    chargingCabinetInfoVisiable: {
      require: true,
      default: false
    },
    chargingCabinetInfoData: {
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    getIfCharge (ifCharge) {
      if (ifCharge === '1') {
        return '能'
      } else if (ifCharge === '2') {
        return '否'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-chargingCabinetd i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-chargingCabinetd .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

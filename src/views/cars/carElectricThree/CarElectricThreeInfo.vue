<template>
  <a-modal
    title="电动三轮车信息"
    :centered="true"
    :width="850"
    :visible="carElectricThreeInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="车辆类型">{{carElectricThreeInfoData.carType}}</detail-list-item>
          <detail-list-item term="车辆品牌">{{carElectricThreeInfoData.carBrands}}</detail-list-item>
          <detail-list-item term="钢架号">{{carElectricThreeInfoData.steelFrameNumber}}</detail-list-item>
          <detail-list-item term="电机号">{{carElectricThreeInfoData.motorNumber}}</detail-list-item>
          <detail-list-item term="车牌号">{{carElectricThreeInfoData.carNumber}}</detail-list-item>
          <!-- <detail-list-item term="身份证号">{{carElectricThreeInfoData.idNum}}</detail-list-item> -->
          <detail-list-item term="使用人">{{carElectricThreeInfoData.user}}</detail-list-item>
          <detail-list-item term="使用部门">{{carElectricThreeInfoData.useDeptName}}</detail-list-item>
          <detail-list-item term="车辆配发日期">{{carElectricThreeInfoData.carAllotmentDate}}</detail-list-item>
          <detail-list-item term="电池数量">{{carElectricThreeInfoData.batteryNumber}}</detail-list-item>
          <detail-list-item term="电池一更换日期">{{carElectricThreeInfoData.batteryReplacementDate1}}</detail-list-item>
          <detail-list-item term="电池二更换日期">{{carElectricThreeInfoData.batteryReplacementDate2}}</detail-list-item>
          <detail-list-item term="是否临牌">{{getIfLicense(carElectricThreeInfoData.ifLicense)}}</detail-list-item>
          <detail-list-item term="存储地点">{{carElectricThreeInfoData.storageLocation}}</detail-list-item>
          <detail-list-item term="车辆状态">{{getStatus(carElectricThreeInfoData.status)}}</detail-list-item>
          <detail-list-item term="备注">{{carElectricThreeInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'CarElectricThreeInfo',
  props: {
    carElectricThreeInfoVisiable: {
      require: true,
      default: false
    },
    carElectricThreeInfoData: {
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
    getIfLicense (ifLicense) {
      if (ifLicense === '1') {
        return '是'
      } else if (ifLicense === '2') {
        return '否'
      }
    },
    getStatus (status) {
      if (status === '1') {
        return '正常'
      } else if (status === '2') {
        return '损坏'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-carElectricThreed i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-carElectricThreed .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

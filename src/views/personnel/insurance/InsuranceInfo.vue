<template>
  <a-modal
    title="保险信息"
    :centered="true"
    :width="850"
    :visible="insuranceInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list title="基础信息">
          <detail-list-item term="姓名">{{insuranceInfoData.name}}</detail-list-item>
          <detail-list-item term="编制类别">{{getInsideOrOutside(insuranceInfoData.insideOrOutside)}}</detail-list-item>
          <detail-list-item term="年月">{{`${insuranceInfoData.year}-${insuranceInfoData.month}`}}</detail-list-item>
          <detail-list-item term="养老保险基数">{{insuranceInfoData.pensionInsuranceBase}}</detail-list-item>
          <detail-list-item term="工伤保险基数">{{insuranceInfoData.workInjuryInsuranceBase}}</detail-list-item>
          <detail-list-item term="医疗保险基数">{{insuranceInfoData.medicalInsuranceBase}}</detail-list-item>
          <!-- <detail-list-item term="创建时间">{{insuranceInfoData.createTime}}</detail-list-item> -->
          <!-- <detail-list-item term="修改时间">{{insuranceInfoData.modifyTime}}</detail-list-item> -->
        </detail-list>
        <detail-list title="个人">
          <detail-list-item term="养老保险">{{insuranceInfoData.pensionInsuranceIndividual}}</detail-list-item>
          <detail-list-item term="失业保险">{{insuranceInfoData.unemploymentInsuranceIndividual}}</detail-list-item>
          <detail-list-item term="医疗保险">{{insuranceInfoData.medicalInsuranceIndividual}}</detail-list-item>
          <detail-list-item term="医疗互助">{{insuranceInfoData.medicalMutualAidIndividual}}</detail-list-item>
          <detail-list-item term="职业年金">{{insuranceInfoData.corporateAnnuityIndividual}}</detail-list-item>
        </detail-list>
        <detail-list title="单位">
          <detail-list-item term="养老保险">{{insuranceInfoData.pensionInsuranceUnit}}</detail-list-item>
          <detail-list-item term="失业保险">{{insuranceInfoData.unemploymentInsuranceUnit}}</detail-list-item>
          <detail-list-item term="工伤保险">{{insuranceInfoData.workInjuryInsuranceUnit}}</detail-list-item>
          <detail-list-item term="生育保险">{{insuranceInfoData.maternityInsuranceUnit}}</detail-list-item>
          <detail-list-item term="医疗保险">{{insuranceInfoData.medicalInsuranceUnit}}</detail-list-item>
          <detail-list-item term="医疗互助">{{insuranceInfoData.medicalMutualAidUnit}}</detail-list-item>
          <detail-list-item term="公疗补充">{{insuranceInfoData.publicTherapySupplementUnit}}</detail-list-item>
          <detail-list-item term="职业年金">{{insuranceInfoData.corporateAnnuityUnit}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'InsuranceInfo',
  props: {
    insuranceInfoVisiable: {
      require: true,
      default: false
    },
    insuranceInfoData: {
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
    getInsideOrOutside (insideOrOutside) {
      if (insideOrOutside === '0') {
        return '编内'
      } else if (insideOrOutside === '1') {
        return '编外'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-insuranced i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-insuranced .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

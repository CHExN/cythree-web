<template>
  <a-modal
    title="编内保险人员信息"
    :centered="true"
    :width="1200"
    :visible="insuranceInsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-card :bordered="false">
        <detail-list title="保险信息">
          <detail-list-item term="姓名">{{insuranceInsideInfoData.name}}</detail-list-item>
          <detail-list-item term="户口地址邮编">{{insuranceInsideInfoData.accountPostalCode}}</detail-list-item>
          <detail-list-item term="户口地址">{{insuranceInsideInfoData.accountAddress}}</detail-list-item>
          <detail-list-item term="类型">{{getNewTransfer(insuranceInsideInfoData.newTransfer)}}</detail-list-item>
          <detail-list-item term="现居住地址邮编">{{insuranceInsideInfoData.currentPostalCode}}</detail-list-item>
          <detail-list-item term="现居住地址">{{insuranceInsideInfoData.currentAddress}}</detail-list-item>
          <detail-list-item term="银行卡号">{{insuranceInsideInfoData.bankCardNumber}}</detail-list-item>
          <detail-list-item term="社保医院">{{insuranceInsideInfoData.socialSecurityHospital}}</detail-list-item>
          <detail-list-item term="养老保险基数">{{insuranceInsideInfoData.pensionInsuranceBase}}</detail-list-item>
          <detail-list-item term="工伤保险基数">{{insuranceInsideInfoData.workInjuryInsuranceBase}}</detail-list-item>
          <detail-list-item term="医疗保险基数">{{insuranceInsideInfoData.medicalInsuranceBase}}</detail-list-item>
          <!-- <detail-list-item term="创建时间">{{insuranceInsideInfoData.createTime}}</detail-list-item> -->
          <!-- <detail-list-item term="修改时间">{{insuranceInsideInfoData.modifyTime}}</detail-list-item> -->
        </detail-list>
      </a-card>
      <a-divider style="margin-bottom: 32px"/>
      <a-card :loading='loading' :bordered="false">
        <detail-list title="人员信息">
          <detail-list-item term="姓名">{{staffInsideData.name}}</detail-list-item>
          <detail-list-item term="部门">{{staffInsideData.deptName}}</detail-list-item>
          <detail-list-item term="人员类型">{{getType(staffInsideData.type)}}</detail-list-item>
          <detail-list-item term="事由">{{staffInsideData.cause}}</detail-list-item>
          <detail-list-item term="性别">{{getGender(staffInsideData.gender)}}</detail-list-item>
          <detail-list-item term="民族">{{staffInsideData.clan}}</detail-list-item>
          <detail-list-item term="籍贯">{{staffInsideData.birthplace}}</detail-list-item>
          <detail-list-item term="原学历">{{staffInsideData.cultureBefore}}</detail-list-item>
          <detail-list-item term="现学历">{{staffInsideData.cultureCurrent}}</detail-list-item>
          <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(staffInsideData.householdRegistrationType)}}</detail-list-item>
          <detail-list-item term="专业">{{staffInsideData.profession}}</detail-list-item>
          <detail-list-item term="毕业日期">{{staffInsideData.graduationDate}}</detail-list-item>
          <detail-list-item term="政治面貌">{{staffInsideData.politicalFace}}</detail-list-item>
          <detail-list-item term="有无残疾证">{{getIsDisabilityCertificate(staffInsideData.isDisabilityCertificate)}}</detail-list-item>
          <detail-list-item term="工伤证发证日期">{{staffInsideData.workInjuryCertificateDate}}</detail-list-item>
          <detail-list-item term="伤残鉴定等级">{{staffInsideData.disabilityIdentificationLevel}}</detail-list-item>
          <detail-list-item term="家庭住址">{{staffInsideData.address}}</detail-list-item>
          <detail-list-item term="身份证号码">{{staffInsideData.idNum}}</detail-list-item>
          <detail-list-item term="座机联系电话">{{staffInsideData.phoneLandLine}}</detail-list-item>
          <detail-list-item term="手机联系电话">{{staffInsideData.phoneCell}}</detail-list-item>
          <detail-list-item term="出生年月">{{staffInsideData.birthDate}}</detail-list-item>
          <detail-list-item term="年龄">{{this.$tools.getAge(staffInsideData.birthDate)}}</detail-list-item>
          <!-- <detail-list-item term="退休年份">{{staffInsideData.retirementYear}}</detail-list-item> -->
          <detail-list-item term="参加工作日期">{{staffInsideData.workDate}}</detail-list-item>
          <detail-list-item term="农转工转工日期">{{staffInsideData.farmerWorkDate}}</detail-list-item>
          <detail-list-item term="调入环卫或报到日期">{{staffInsideData.transferDate}}</detail-list-item>
          <detail-list-item term="现任岗位职务">{{staffInsideData.technicalType}}</detail-list-item>
          <detail-list-item term="岗位">{{getPost(staffInsideData.post)}}</detail-list-item>
          <detail-list-item term="岗位级别">{{staffInsideData.postLevel}}</detail-list-item>
          <detail-list-item term="聘任时间">{{staffInsideData.appointmentDate}}</detail-list-item>
          <detail-list-item term="技术等级取得日期">{{staffInsideData.technicalLevelDate}}</detail-list-item>
          <detail-list-item term="证书编号">{{staffInsideData.certificateNum}}</detail-list-item>
          <detail-list-item term="入职状态">{{staffInsideData.entryStatus}}</detail-list-item>
        </detail-list>
      </a-card>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '../../../components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'InsuranceInsideInfo',
  props: {
    insuranceInsideInfoVisiable: {
      require: true,
      default: false
    },
    insuranceInsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      staffInsideData: {},
      loading: false
    }
  },
  methods: {
    handleCancleClick () {
      this.staffInsideData = {}
      this.$emit('close')
    },
    getNewTransfer (newTransfer) {
      if (newTransfer === '0') {
        return '新参'
      } else if (newTransfer === '1') {
        return '传入'
      }
    },
    getType (type) {
      if (type === '0') {
        return '固定工'
      } else if (type === '1') {
        return '合同制'
      }
    },
    getGender (gender) {
      if (gender === '0') {
        return '女'
      } else if (gender === '1') {
        return '男'
      }
    },
    getIsDisabilityCertificate (isDisabilityCertificate) {
      if (isDisabilityCertificate === '0') {
        return '无'
      } else if (isDisabilityCertificate === '1') {
        return '有'
      }
    },
    getHouseholdRegistrationType (householdRegistrationType) {
      switch (householdRegistrationType) {
        case '0':
          return '外地农业'
        case '1':
          return '外地非农业'
        case '2':
          return '本地农业'
        case '3':
          return '本地非农业'
        default:
          return householdRegistrationType
      }
    },
    getPost (post) {
      switch (post) {
        case '0':
          return '管理'
        case '1':
          return '技工'
        case '2':
          return '普工'
        case '3':
          return '专技'
        default:
          return post
      }
    }
  },
  watch: {
    insuranceInsideInfoVisiable () {
      if (this.insuranceInsideInfoVisiable) {
        this.loading = true
        this.$get('staffInside/getStaffInside', {
          staffId: this.insuranceInsideInfoData.staffId
        }).then((r) => {
          this.loading = false
          if (r.data) {
            this.staffInsideData = r.data
          }
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

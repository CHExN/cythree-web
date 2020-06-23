<template>
  <a-modal
    title="编外保险人员信息"
    :centered="true"
    :width="1200"
    :visible="insuranceOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="保险信息">
        <detail-list-item term="姓名">{{insuranceOutsideInfoData.name}}</detail-list-item>
        <detail-list-item term="户口地址邮编">{{insuranceOutsideInfoData.accountPostalCode}}</detail-list-item>
        <detail-list-item term="户口地址">{{insuranceOutsideInfoData.accountAddress}}</detail-list-item>
        <detail-list-item term="类型">{{getNewTransfer(insuranceOutsideInfoData.newTransfer)}}</detail-list-item>
        <detail-list-item term="现居住地址邮编">{{insuranceOutsideInfoData.currentPostalCode}}</detail-list-item>
        <detail-list-item term="现居住地址">{{insuranceOutsideInfoData.currentAddress}}</detail-list-item>
        <detail-list-item term="银行卡号">{{insuranceOutsideInfoData.bankCardNumber}}</detail-list-item>
        <detail-list-item term="社保医院">{{insuranceOutsideInfoData.socialSecurityHospital}}</detail-list-item>
        <detail-list-item term="养老保险基数">{{insuranceOutsideInfoData.pensionInsuranceBase}}</detail-list-item>
        <detail-list-item term="工伤保险基数">{{insuranceOutsideInfoData.workInjuryInsuranceBase}}</detail-list-item>
        <detail-list-item term="医疗保险基数">{{insuranceOutsideInfoData.medicalInsuranceBase}}</detail-list-item>
        <!-- <detail-list-item term="创建时间">{{insuranceOutsideInfoData.createTime}}</detail-list-item> -->
        <!-- <detail-list-item term="修改时间">{{insuranceOutsideInfoData.modifyTime}}</detail-list-item> -->
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'staffOutside:view'" style="margin-bottom: 32px"/>
    <a-card v-hasPermission="'staffOutside:view'" :loading='loading' :bordered="false">
      <detail-list title="人员信息">
        <detail-list-item term="姓名">{{staffOutsideData.name}}</detail-list-item>
        <detail-list-item term="分队">{{staffOutsideData.team}}</detail-list-item>
        <detail-list-item term="人员类型">{{staffOutsideData.temporary}}</detail-list-item>
        <detail-list-item term="事由">{{staffOutsideData.cause}}</detail-list-item>
        <detail-list-item term="性别">{{getGender(staffOutsideData.gender)}}</detail-list-item>
        <detail-list-item term="民族">{{staffOutsideData.clan}}</detail-list-item>
        <detail-list-item term="籍贯">{{staffOutsideData.birthplace}}</detail-list-item>
        <detail-list-item term="学历">{{staffOutsideData.culture}}</detail-list-item>
        <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(staffOutsideData.householdRegistrationType)}}</detail-list-item>
        <detail-list-item term="政治面貌">{{staffOutsideData.politicalFace}}</detail-list-item>
        <detail-list-item term="家庭住址">{{staffOutsideData.address}}</detail-list-item>
        <detail-list-item term="身份证号码">{{staffOutsideData.idNum}}</detail-list-item>
        <detail-list-item term="座机联系电话">{{staffOutsideData.phoneLandLine}}</detail-list-item>
        <detail-list-item term="手机联系电话">{{staffOutsideData.phoneCell}}</detail-list-item>
        <detail-list-item term="出生年月">{{staffOutsideData.birthDate}}</detail-list-item>
        <!-- <detail-list-item term="年龄">{{this.$tools.getAge(staffOutsideData.birthDate)}}</detail-list-item> -->
        <detail-list-item term="年龄">{{staffOutsideData.age}}</detail-list-item>
        <detail-list-item term="退休年龄">{{staffOutsideData.retirementAge}}</detail-list-item>
        <detail-list-item term="退休日期">{{staffOutsideData.retirementDate}}</detail-list-item>
        <detail-list-item term="调入日期">{{staffOutsideData.transferDate}}</detail-list-item>
        <detail-list-item term="岗位">{{staffOutsideData.post}}</detail-list-item>
        <detail-list-item term="岗位类别">{{staffOutsideData.technicalType}}</detail-list-item>
        <detail-list-item term="备注">{{staffOutsideData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'InsuranceOutsideInfo',
  props: {
    insuranceOutsideInfoVisiable: {
      require: true,
      default: false
    },
    insuranceOutsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      staffOutsideData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.account.permissions
    })
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    getNewTransfer (newTransfer) {
      if (newTransfer === '0') {
        return '新参'
      } else if (newTransfer === '1') {
        return '传入'
      }
    },
    getGender (gender) {
      if (gender === '0') {
        return '女'
      } else if (gender === '1') {
        return '男'
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
    }
  },
  watch: {
    insuranceOutsideInfoVisiable () {
      if (this.insuranceOutsideInfoVisiable && this.permissions.includes('staffOutside:view')) {
        this.staffOutsideData = {}
        this.loading = true
        this.$get('staffOutside/getStaffOutsideByStaffId', {
          staffId: this.insuranceOutsideInfoData.staffId
        }).then((r) => {
          this.loading = false
          if (r.data) {
            this.staffOutsideData = r.data
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

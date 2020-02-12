<template>
  <a-modal
    title="编外合同信息"
    :centered="true"
    :width="1200"
    :visible="contractOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-card :bordered="false">
        <detail-list title="合同信息">
          <template v-for="(k, index) in contractPeriod">
            <detail-list-item :key="index" :term="k">{{contractPeriodDate[index]}}</detail-list-item>
          </template>
          <!-- <detail-list-item term="无固定期">{{contractOutsideInfoData.isFixedPeriod}}</detail-list-item> -->
          <detail-list-item term="续签备注">{{contractOutsideInfoData.remarkRenew}}</detail-list-item>
          <detail-list-item term="备注">{{contractOutsideInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
      <a-divider style="margin-bottom: 32px"/>
      <a-card :bordered="false">
        <detail-list title="岗位协议信息">
          <template v-for="(k, index) in jobAgreement">
            <detail-list-item :key="index" :term="k">{{jobAgreementDate[index]}}</detail-list-item>
          </template>
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
          <detail-list-item term="年龄">{{this.$tools.getAge(staffOutsideData.birthDate)}}</detail-list-item>
          <!-- <detail-list-item term="退休年份">{{staffOutsideData.retirementYear}}</detail-list-item> -->
          <detail-list-item term="调入环卫或报到日期">{{staffOutsideData.transferDate}}</detail-list-item>
          <detail-list-item term="到本场队日期">{{staffOutsideData.toTeamDate}}</detail-list-item>
          <detail-list-item term="岗位">{{staffOutsideData.post}}</detail-list-item>
          <detail-list-item term="岗位类别">{{staffOutsideData.technicalType}}</detail-list-item>
          <detail-list-item term="备注">{{staffOutsideData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '../../../components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group
export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'ContractOutsideInfo',
  props: {
    contractOutsideInfoVisiable: {
      require: true,
      default: false
    },
    contractOutsideInfoData: {
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
    }),
    contractPeriod () {
      return this.contractOutsideInfoData.contractPeriod ? this.contractOutsideInfoData.contractPeriod.split(',') : []
    },
    contractPeriodDate () {
      return this.contractOutsideInfoData.contractPeriodDate ? this.contractOutsideInfoData.contractPeriodDate.split(',') : []
    },
    jobAgreement () {
      return this.contractOutsideInfoData.jobAgreement ? this.contractOutsideInfoData.jobAgreement.split(',') : []
    },
    jobAgreementDate () {
      return this.contractOutsideInfoData.jobAgreementDate ? this.contractOutsideInfoData.jobAgreementDate.split(',') : []
    }
  },
  methods: {
    handleCancleClick () {
      this.staffOutsideData = {}
      this.$emit('close')
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
    contractOutsideInfoVisiable () {
      if (this.contractOutsideInfoVisiable && this.permissions.includes('staffOutside:view')) {
        this.loading = true
        this.$get('staffOutside/getStaffOutsideByIdNum', {
          idNum: this.contractOutsideInfoData.idNum
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

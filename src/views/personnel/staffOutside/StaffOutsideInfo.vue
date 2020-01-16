<template>
  <a-modal
    title="编外人员信息"
    :centered="true"
    :width="1200"
    :visible="staffOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-card :bordered="false">
        <detail-list title="人员信息">
          <detail-list-item term="姓名">{{staffOutsideInfoData.name}}</detail-list-item>
          <detail-list-item term="分队">{{staffOutsideInfoData.team}}</detail-list-item>
          <detail-list-item term="人员类型">{{staffOutsideInfoData.temporary}}</detail-list-item>
          <detail-list-item term="性别">{{getGender(staffOutsideInfoData.gender)}}</detail-list-item>
          <detail-list-item term="民族">{{staffOutsideInfoData.clan}}</detail-list-item>
          <detail-list-item term="籍贯">{{staffOutsideInfoData.birthplace}}</detail-list-item>
          <detail-list-item term="学历">{{staffOutsideInfoData.culture}}</detail-list-item>
          <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(staffOutsideInfoData.householdRegistrationType)}}</detail-list-item>
          <detail-list-item term="政治面貌">{{staffOutsideInfoData.politicalFace}}</detail-list-item>
          <detail-list-item term="家庭住址">{{staffOutsideInfoData.address}}</detail-list-item>
          <detail-list-item term="身份证号码">{{staffOutsideInfoData.idNum}}</detail-list-item>
          <detail-list-item term="座机联系电话">{{staffOutsideInfoData.phoneLandLine}}</detail-list-item>
          <detail-list-item term="手机联系电话">{{staffOutsideInfoData.phoneCell}}</detail-list-item>
          <detail-list-item term="出生年月">{{staffOutsideInfoData.birthDate}}</detail-list-item>
          <detail-list-item term="年龄">{{this.$tools.getAge(staffOutsideInfoData.birthDate)}}</detail-list-item>
          <!-- <detail-list-item term="退休年份">{{staffOutsideInfoData.retirementYear}}</detail-list-item> -->
          <detail-list-item term="调入环卫或报到日期">{{staffOutsideInfoData.transferDate}}</detail-list-item>
          <detail-list-item term="到本场队日期">{{staffOutsideInfoData.toTeamDate}}</detail-list-item>
          <detail-list-item term="岗位">{{staffOutsideInfoData.post}}</detail-list-item>
          <detail-list-item term="岗位类别">{{staffOutsideInfoData.technicalType}}</detail-list-item>
          <detail-list-item term="备注">{{staffOutsideInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
      <a-divider v-hasPermission="'contractOutside:view'" style="margin-bottom: 32px"/>
      <a-card v-hasPermission="'contractOutside:view'" :loading='loading' :bordered="false">
        <detail-list title="合同信息">
          <template v-for="(k, index) in contractPeriod">
            <detail-list-item :key="index" :term="k">{{contractPeriodDate[index]}}</detail-list-item>
          </template>
          <detail-list-item term="无固定期备注">{{contractOutsideData.remarkOnFixedPeriod}}</detail-list-item>
          <detail-list-item term="续签备注">{{contractOutsideData.remarkRenew}}</detail-list-item>
          <detail-list-item term="备注">{{contractOutsideData.remark}}</detail-list-item>
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
    staffOutsideInfoVisiable: {
      require: true,
      default: false
    },
    staffOutsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      contractOutsideData: {},
      loading: false
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.account.permissions
    }),
    contractPeriod () {
      return this.contractOutsideData.contractPeriod ? this.contractOutsideData.contractPeriod.split(',') : []
    },
    contractPeriodDate () {
      return this.contractOutsideData.contractPeriodDate ? this.contractOutsideData.contractPeriodDate.split(',') : []
    }
  },
  methods: {
    handleCancleClick () {
      this.contractOutsideData = {}
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
    staffOutsideInfoVisiable () {
      if (this.staffOutsideInfoVisiable && this.permissions.includes('contractOutside:view')) {
        this.loading = true
        this.$get('contractOutside/getContractOutside', {
          idNum: this.staffOutsideInfoData.idNum
        }).then((r) => {
          this.loading = false
          if (r.data) {
            this.contractOutsideData = r.data
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

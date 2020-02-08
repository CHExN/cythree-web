<template>
  <a-modal
    title="编内人员信息"
    :centered="true"
    :width="1200"
    :visible="staffInsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-card :bordered="false">
        <detail-list title="人员信息">
          <detail-list-item term="姓名">{{staffInsideInfoData.name}}</detail-list-item>
          <detail-list-item term="部门">{{staffInsideInfoData.deptName}}</detail-list-item>
          <detail-list-item term="人员类型">{{getType(staffInsideInfoData.type)}}</detail-list-item>
          <detail-list-item term="事由">{{staffInsideInfoData.cause}}</detail-list-item>
          <detail-list-item term="性别">{{getGender(staffInsideInfoData.gender)}}</detail-list-item>
          <detail-list-item term="民族">{{staffInsideInfoData.clan}}</detail-list-item>
          <detail-list-item term="籍贯">{{staffInsideInfoData.birthplace}}</detail-list-item>
          <detail-list-item term="原学历">{{staffInsideInfoData.cultureBefore}}</detail-list-item>
          <detail-list-item term="现学历">{{staffInsideInfoData.cultureCurrent}}</detail-list-item>
          <detail-list-item term="户籍性质">{{getHouseholdRegistrationType(staffInsideInfoData.householdRegistrationType)}}</detail-list-item>
          <detail-list-item term="专业">{{staffInsideInfoData.profession}}</detail-list-item>
          <detail-list-item term="毕业日期">{{staffInsideInfoData.graduationDate}}</detail-list-item>
          <detail-list-item term="政治面貌">{{staffInsideInfoData.politicalFace}}</detail-list-item>
          <detail-list-item term="有无残疾证">{{getIsDisabilityCertificate(staffInsideInfoData.isDisabilityCertificate)}}</detail-list-item>
          <detail-list-item term="工伤证发证日期">{{staffInsideInfoData.workInjuryCertificateDate}}</detail-list-item>
          <detail-list-item term="伤残鉴定等级">{{staffInsideInfoData.disabilityIdentificationLevel}}</detail-list-item>
          <detail-list-item term="家庭住址">{{staffInsideInfoData.address}}</detail-list-item>
          <detail-list-item term="身份证号码">{{staffInsideInfoData.idNum}}</detail-list-item>
          <detail-list-item term="座机联系电话">{{staffInsideInfoData.phoneLandLine}}</detail-list-item>
          <detail-list-item term="手机联系电话">{{staffInsideInfoData.phoneCell}}</detail-list-item>
          <detail-list-item term="出生年月">{{staffInsideInfoData.birthDate}}</detail-list-item>
          <detail-list-item term="年龄">{{this.$tools.getAge(staffInsideInfoData.birthDate)}}</detail-list-item>
          <!-- <detail-list-item term="退休年份">{{staffInsideInfoData.retirementYear}}</detail-list-item> -->
          <detail-list-item term="参加工作日期">{{staffInsideInfoData.workDate}}</detail-list-item>
          <detail-list-item term="农转工转工日期">{{staffInsideInfoData.farmerWorkDate}}</detail-list-item>
          <detail-list-item term="调入环卫或报到日期">{{staffInsideInfoData.transferDate}}</detail-list-item>
          <detail-list-item term="到本场队日期">{{staffInsideInfoData.toTeamDate}}</detail-list-item>
          <detail-list-item term="现任岗位职务">{{staffInsideInfoData.technicalType}}</detail-list-item>
          <detail-list-item term="岗位">{{getPost(staffInsideInfoData.post)}}</detail-list-item>
          <detail-list-item term="岗位级别">{{staffInsideInfoData.postLevel}}</detail-list-item>
          <detail-list-item term="聘任时间">{{staffInsideInfoData.appointmentDate}}</detail-list-item>
          <detail-list-item term="技术等级取得日期">{{staffInsideInfoData.technicalLevelDate}}</detail-list-item>
          <detail-list-item term="证书编号">{{staffInsideInfoData.certificateNum}}</detail-list-item>
          <detail-list-item term="入职状态">{{staffInsideInfoData.entryStatus}}</detail-list-item>
        </detail-list>
      </a-card>
      <a-divider v-hasPermission="'contractInside:view'" style="margin-bottom: 32px"/>
      <a-card v-hasPermission="'contractInside:view'" :loading='loading' :bordered="false">
        <detail-list title="合同信息">
          <detail-list-item term="档案编号">{{contractInsideData.fileNum}}</detail-list-item>
          <detail-list-item term="胸牌号码">{{contractInsideData.badNum}}</detail-list-item>
          <detail-list-item term="无固定期">{{contractInsideData.isFixedPeriod}}</detail-list-item>
          <detail-list-item term="劳动合同起始日期">{{contractInsideData.contractLaborStart}}</detail-list-item>
          <detail-list-item term="劳动合同结束日期">{{contractInsideData.contractLaborEnd}}</detail-list-item>
          <detail-list-item term="岗位协议起始日期">{{contractInsideData.jobAgreementStart}}</detail-list-item>
          <detail-list-item term="岗位协议结束日期">{{contractInsideData.jobAgreementEnd}}</detail-list-item>
          <detail-list-item term="续签备注">{{contractInsideData.remarkRenew}}</detail-list-item>
          <detail-list-item term="备注">{{contractInsideData.remark}}</detail-list-item>
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
  name: 'ContractInsideInfo',
  props: {
    staffInsideInfoVisiable: {
      require: true,
      default: false
    },
    staffInsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      contractInsideData: {},
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
      this.contractInsideData = {}
      this.$emit('close')
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
    staffInsideInfoVisiable () {
      if (this.staffInsideInfoVisiable && this.permissions.includes('contractInside:view')) {
        this.loading = true
        this.$get('contractInside/getContractInside', {
          staffInsideId: this.staffInsideInfoData.staffId
        }).then((r) => {
          this.loading = false
          if (r.data) {
            this.contractInsideData = r.data
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

<template>
  <a-modal
    title="工资信息"
    :centered="true"
    :width="1200"
    :visible="wageInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="工资信息">
        <detail-list-item term="年月">{{`${wageInfoData.year}-${wageInfoData.month}`}}</detail-list-item>
        <detail-list-item term="岗位工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.currentIncome.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.currentIncomeSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="补发薪级">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.reissueSalaryScale.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.reissueSalaryScaleSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="薪级工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.salarySalary.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.salarySalarySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="岗位津贴">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.postAllowance.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.postAllowanceSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="财政负担">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.financialBurdenPerformancePay.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.financialBurdenPerformancePaySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="加班费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.overtimePay.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.overtimePaySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="环卫危害岗位补助">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.environmentalSanitationDutyAllowance.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.environmentalSanitationDutyAllowanceSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="住房补贴">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.housingSubsidy.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.housingSubsidySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="独生子女费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.onlyChildFee.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.onlyChildFeeSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="临时性补贴">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.temporarySubsidy.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.temporarySubsidySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="岗位绩效">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.jobPerformance.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.jobPerformanceSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="过节费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.holidayCosts.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.holidayCostsSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="年休假工资报酬">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.annualLeavePay.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.annualLeavePaySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="综合补助">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.comprehensiveSubsidy.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.comprehensiveSubsidySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="应发工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.payable.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.payableSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="住房公积金">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.housingFund.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.housingFundSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="养老保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.basicPensionIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.basicPensionIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="失业保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.unemploymentIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.unemploymentIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="医疗保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.basicMedicalIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.basicMedicalIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="医疗互助">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.medicalMutualAid.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.medicalMutualAidSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="职业年金">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.corporateAnnuity.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.corporateAnnuitySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="扣税">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.taxDeduction.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.taxDeductionSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="实发工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.realWage.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData.realWageSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item :key="index" :term="item === '' ? `空列${index + 1}` : item" v-for="(item, index) in emptyColumn">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation[`emptyColumn${$tools.zero(index + 1)}`].join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageInfoData[`emptyColumn${$tools.zero(index + 1)}Sum`]}}</span>
          </a-popover>
        </detail-list-item>
      </detail-list>
    </a-card>
    <a-divider v-hasPermission="'staffInside:view'" style="margin-bottom: 32px"/>
    <a-card v-hasPermission="'staffInside:view'" :loading='loading' :bordered="false">
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
        <detail-list-item term="残疾证编号">{{staffInsideData.disabilityCertificateNumber}}</detail-list-item>
        <detail-list-item term="伤残鉴定等级">{{staffInsideData.disabilityIdentificationLevel}}</detail-list-item>
        <detail-list-item term="家庭住址">{{staffInsideData.address}}</detail-list-item>
        <detail-list-item term="身份证号码">{{staffInsideData.idNum}}</detail-list-item>
        <detail-list-item term="座机联系电话">{{staffInsideData.phoneLandLine}}</detail-list-item>
        <detail-list-item term="手机联系电话">{{staffInsideData.phoneCell}}</detail-list-item>
        <detail-list-item term="出生年月">{{staffInsideData.birthDate}}</detail-list-item>
        <!-- <detail-list-item term="年龄">{{this.$tools.getAge(staffInsideData.birthDate)}}</detail-list-item> -->
        <detail-list-item term="年龄">{{staffInsideData.age}}</detail-list-item>
        <detail-list-item term="退休年龄">{{staffInsideData.retirementAge}}</detail-list-item>
        <detail-list-item term="退休日期">{{staffInsideData.retirementDate}}</detail-list-item>
        <detail-list-item term="调入日期">{{staffInsideData.transferDate}}</detail-list-item>
        <detail-list-item term="参加工作日期">{{staffInsideData.workDate}}</detail-list-item>
        <detail-list-item term="农转工转工日期">{{staffInsideData.farmerWorkDate}}</detail-list-item>
        <detail-list-item term="现任职务">{{staffInsideData.technicalType}}</detail-list-item>
        <detail-list-item term="岗位">{{getPost(staffInsideData.post)}}</detail-list-item>
        <detail-list-item term="岗位级别">{{staffInsideData.postLevel}}</detail-list-item>
        <detail-list-item term="聘任岗位">{{staffInsideData.hiringPositions}}</detail-list-item>
        <detail-list-item term="聘任时间">{{staffInsideData.appointmentDate}}</detail-list-item>
        <detail-list-item term="技术等级取得日期">{{staffInsideData.technicalLevelDate}}</detail-list-item>
        <detail-list-item term="证书编号">{{staffInsideData.certificateNum}}</detail-list-item>
        <detail-list-item term="入职状态">{{staffInsideData.entryStatus}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'WageInfo',
  props: {
    wageInfoVisiable: {
      require: true,
      default: false
    },
    wageInfoData: {
      require: true
    }
  },
  data () {
    return {
      staffInsideData: {},
      loading: false,
      emptyColumn: [
        '空列1',
        '空列2',
        '空列3',
        '空列4',
        '空列5',
        '空列6',
        '空列7',
        '空列8',
        '空列9',
        '空列10'
      ],
      monthlyInformation: {
        currentIncome: [],
        reissueSalaryScale: [],
        salarySalary: [],
        postAllowance: [],
        financialBurdenPerformancePay: [],
        overtimePay: [],
        environmentalSanitationDutyAllowance: [],
        housingSubsidy: [],
        onlyChildFee: [],
        temporarySubsidy: [],
        jobPerformance: [],
        holidayCosts: [],
        annualLeavePay: [],
        comprehensiveSubsidy: [],
        payable: [],
        housingFund: [],
        basicPensionIp: [],
        unemploymentIp: [],
        basicMedicalIp: [],
        medicalMutualAid: [],
        corporateAnnuity: [],
        taxDeduction: [],
        emptyColumn01: [],
        emptyColumn02: [],
        emptyColumn03: [],
        emptyColumn04: [],
        emptyColumn05: [],
        emptyColumn06: [],
        emptyColumn07: [],
        emptyColumn08: [],
        emptyColumn09: [],
        emptyColumn10: [],
        realWage: []
      }
    }
  },
  computed: {
    ...mapState({
      permissions: state => state.account.permissions
    })
  },
  methods: {
    handleCancleClick () {
      this.monthlyInformation = {
        currentIncome: [],
        reissueSalaryScale: [],
        salarySalary: [],
        postAllowance: [],
        financialBurdenPerformancePay: [],
        overtimePay: [],
        environmentalSanitationDutyAllowance: [],
        housingSubsidy: [],
        onlyChildFee: [],
        temporarySubsidy: [],
        jobPerformance: [],
        holidayCosts: [],
        annualLeavePay: [],
        comprehensiveSubsidy: [],
        payable: [],
        housingFund: [],
        basicPensionIp: [],
        unemploymentIp: [],
        basicMedicalIp: [],
        medicalMutualAid: [],
        corporateAnnuity: [],
        taxDeduction: [],
        emptyColumn01: [],
        emptyColumn02: [],
        emptyColumn03: [],
        emptyColumn04: [],
        emptyColumn05: [],
        emptyColumn06: [],
        emptyColumn07: [],
        emptyColumn08: [],
        emptyColumn09: [],
        emptyColumn10: [],
        realWage: []
      }
      this.$emit('close')
    },
    wageInfoDataProcessing (oneInfo) {
      oneInfo.forEach(element => {
        Object.keys(element).forEach(e => {
          if (this.monthlyInformation[e]) {
            this.monthlyInformation[e].push(`${element.month}月 ${element[e]}元`)
          }
        })
      })
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
          return '管理岗'
        case '1':
          return '技工'
        case '2':
          return '工勤岗'
        case '3':
          return '专业技术岗'
        default:
          return post
      }
    }
  },
  watch: {
    wageInfoVisiable () {
      if (this.wageInfoVisiable) {
        this.staffInsideData = {}
        this.loading = true
        if (this.permissions.includes('staffInside:view')) {
          this.$get('staffInside/getStaffInsideByStaffId', {
            staffId: this.wageInfoData.staffId
          }).then((r) => {
            if (r.data) this.staffInsideData = r.data
          })
        }
        this.$get('wage/oneInfo', {
          staffId: this.wageInfoData.staffId,
          year: this.wageInfoData.year,
          monthArr: this.wageInfoData.monthArr
        }).then((r) => {
          this.wageInfoDataProcessing(r.data)
        })
        this.$get('wageRemark/getOne', {
          insideOrOutside: 0,
          year: this.wageInfoData.year
        }).then((r) => {
          this.loading = false
          if (r.data) this.emptyColumn = r.data.remark.split(',')
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-waged i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-waged .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

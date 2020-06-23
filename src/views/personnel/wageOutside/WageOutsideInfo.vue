<template>
  <a-modal
    title="工资信息"
    :centered="true"
    :width="1200"
    :visible="wageOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="工资信息">
        <detail-list-item term="年月">{{`${wageOutsideInfoData.year}-${wageOutsideInfoData.month}`}}</detail-list-item>
        <detail-list-item term="基本工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.currentIncome.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.currentIncomeSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="岗位津贴">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.postAllowance.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.postAllowanceSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="环卫津贴">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.sanitationAllowance.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.sanitationAllowanceSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="危岗补助">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.dangerousSubsidy.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.dangerousSubsidySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="绩效奖金">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.performanceBonus.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.performanceBonusSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="加班费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.overtimePay.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.overtimePaySum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="过节费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.holidayCosts.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.holidayCostsSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="应发工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.payable.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.payableSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="养老保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.basicPensionIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.basicPensionIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="失业保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.unemploymentIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.unemploymentIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="医疗保险">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.basicMedicalIp.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.basicMedicalIpSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="税金">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.taxDeduction.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.taxDeductionSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="会费">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.membership.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.membershipSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="住房公积金">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.housingFund.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.housingFundSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="病事假">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.sickLeave.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.sickLeaveSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item term="实发工资">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation.realWage.join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData.realWageSum}}</span>
          </a-popover>
        </detail-list-item>
        <detail-list-item :key="index" :term="item === '' ? `空列${index + 1}` : item" v-for="(item, index) in emptyColumn">
          <a-popover trigger="hover">
            <template slot="content">
              <p>{{monthlyInformation[`emptyColumn${$tools.zero(index + 1)}`].join('；')}}</p>
            </template>
            <span style="cursor: pointer;">{{wageOutsideInfoData[`emptyColumn${$tools.zero(index + 1)}Sum`]}}</span>
          </a-popover>
        </detail-list-item>
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
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'WageOutsideInfo',
  props: {
    wageOutsideInfoVisiable: {
      require: true,
      default: false
    },
    wageOutsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      staffOutsideData: {},
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
        postAllowance: [],
        sanitationAllowance: [],
        dangerousSubsidy: [],
        performanceBonus: [],
        overtimePay: [],
        holidayCosts: [],
        payable: [],
        basicPensionIp: [],
        unemploymentIp: [],
        basicMedicalIp: [],
        taxDeduction: [],
        membership: [],
        housingFund: [],
        sickLeave: [],
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
        postAllowance: [],
        sanitationAllowance: [],
        dangerousSubsidy: [],
        performanceBonus: [],
        overtimePay: [],
        holidayCosts: [],
        payable: [],
        basicPensionIp: [],
        unemploymentIp: [],
        basicMedicalIp: [],
        taxDeduction: [],
        membership: [],
        housingFund: [],
        sickLeave: [],
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
    wageOutsideInfoDataProcessing (oneInfo) {
      oneInfo.forEach(element => {
        Object.keys(element).forEach(e => {
          if (this.monthlyInformation[e]) {
            this.monthlyInformation[e].push(`${element.month}月 ${element[e]}元`)
          }
        })
      })
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
    wageOutsideInfoVisiable () {
      if (this.wageOutsideInfoVisiable) {
        this.staffOutsideData = {}
        this.loading = true
        if (this.permissions.includes('staffOutside:view')) {
          this.$get('staffOutside/getStaffOutsideByStaffId', {
            staffId: this.wageOutsideInfoData.staffId
          }).then((r) => {
            if (r.data) this.staffOutsideData = r.data
          })
        }
        this.$get('wageOutside/oneInfo', {
          staffId: this.wageOutsideInfoData.staffId,
          year: this.wageOutsideInfoData.year,
          monthArr: this.wageOutsideInfoData.monthArr
        }).then((r) => {
          this.wageOutsideInfoDataProcessing(r.data)
        })
        this.$get('wageRemark/getOne', {
          insideOrOutside: 1,
          year: this.wageOutsideInfoData.year
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

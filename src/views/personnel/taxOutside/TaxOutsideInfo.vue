<template>
  <a-modal
    title="编外个税信息"
    :centered="true"
    :width="850"
    :visible="taxOutsideInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <!-- <detail-list-item term="姓名">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation[currentIncome].join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.staffName}}</span>
            </a-popover>
          </detail-list-item> -->
          <detail-list-item term="姓名">{{taxOutsideInfoData.staffName}}</detail-list-item>
          <detail-list-item term="证照类型">{{taxOutsideInfoData.idCardTypeToDict}}</detail-list-item>
          <detail-list-item term="证照号码">{{taxOutsideInfoData.staffIdCard}}</detail-list-item>
          <detail-list-item term="年月">{{`${taxOutsideInfoData.year}-${taxOutsideInfoData.month}`}}</detail-list-item>
          <detail-list-item term="本期收入">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.currentIncome.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.currentIncomeSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="本期免税收入">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.currentTaxFreeIncome.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.currentTaxFreeIncomeSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="基本养老保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.basicPensionIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.basicPensionIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="基本医疗保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.basicMedicalIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.basicMedicalIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="失业保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.unemploymentIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.unemploymentIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="住房公积金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.housingFund.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.housingFundSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计子女教育">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeChildE.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.cumulativeChildESum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计继续教育">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeContinuingE.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.cumulativeContinuingESum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计住房贷款利息">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeHomeLoanInterest.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.cumulativeHomeLoanInterestSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计住房租金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeHousingRent.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.cumulativeHousingRentSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计赡养老人">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeElderlySupport.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.cumulativeElderlySupportSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="企业(职业)年金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.corporateAnnuity.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.corporateAnnuitySum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="商业健康保险">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.commercialHealthInsurance.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.commercialHealthInsuranceSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="税延养老保险">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.taxExtensionPensionInsurance.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.taxExtensionPensionInsuranceSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="其他">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.other.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.otherSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="准予扣除的捐赠额">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.allowanceForDeduction.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.allowanceForDeductionSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="减免税额">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.taxDeduction.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.taxDeductionSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="应扣税额">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.finalWage.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxOutsideInfoData.finalWageSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="月缴税数">
            <a-popover trigger="hover">
              <template slot="content">
                <p value>{{monthlyTaxesPaid.text}}</p>
              </template>
              <span style="cursor: pointer;">{{monthlyTaxesPaid.value}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="备注">{{taxOutsideInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'TaxOutsideInfo',
  props: {
    taxOutsideInfoVisiable: {
      require: true,
      default: false
    },
    taxOutsideInfoData: {
      require: true
    }
  },
  data () {
    return {
      monthlyInformation: {
        currentIncome: [],
        currentTaxFreeIncome: [],
        basicPensionIp: [],
        basicMedicalIp: [],
        unemploymentIp: [],
        housingFund: [],
        cumulativeChildE: [],
        cumulativeContinuingE: [],
        cumulativeHomeLoanInterest: [],
        cumulativeHousingRent: [],
        cumulativeElderlySupport: [],
        corporateAnnuity: [],
        commercialHealthInsurance: [],
        taxExtensionPensionInsurance: [],
        other: [],
        allowanceForDeduction: [],
        taxDeduction: [],
        finalWage: []
      },
      monthlyTaxesPaid: {
        value: 0,
        text: ''
      }
    }
  },
  methods: {
    handleCancleClick () {
      this.monthlyInformation = {
        currentIncome: [],
        currentTaxFreeIncome: [],
        basicPensionIp: [],
        basicMedicalIp: [],
        unemploymentIp: [],
        housingFund: [],
        cumulativeChildE: [],
        cumulativeContinuingE: [],
        cumulativeHomeLoanInterest: [],
        cumulativeHousingRent: [],
        cumulativeElderlySupport: [],
        corporateAnnuity: [],
        commercialHealthInsurance: [],
        taxExtensionPensionInsurance: [],
        other: [],
        allowanceForDeduction: [],
        taxDeduction: [],
        finalWage: []
      }
      this.$emit('close')
    },
    taxOutsideInfoDataProcessing (oneInfo) {
      oneInfo.forEach(element => {
        Object.keys(element).forEach(e => {
          if (this.monthlyInformation[e]) {
            this.monthlyInformation[e].push(`${element.month}月 ${element[e]}元`)
          }
        })
      })
    }
  },
  watch: {
    taxOutsideInfoVisiable () {
      if (this.taxOutsideInfoVisiable) {
        // 扣税率, 速算扣除数
        let deductionRate, quickCalculationDeductions
        if (this.taxOutsideInfoData.finalWageSum <= 36000) {
          deductionRate = 0.03
          quickCalculationDeductions = 0
        } else if (this.taxOutsideInfoData.finalWageSum <= 144000) {
          deductionRate = 0.1
          quickCalculationDeductions = 2520
        } else if (this.taxOutsideInfoData.finalWageSum <= 300000) {
          deductionRate = 0.2
          quickCalculationDeductions = 16920
        } else if (this.taxOutsideInfoData.finalWageSum <= 420000) {
          deductionRate = 0.25
          quickCalculationDeductions = 31920
        } else if (this.taxOutsideInfoData.finalWageSum <= 660000) {
          deductionRate = 0.3
          quickCalculationDeductions = 52920
        } else if (this.taxOutsideInfoData.finalWageSum <= 960000) {
          deductionRate = 0.35
          quickCalculationDeductions = 85920
        } else {
          deductionRate = 0.45
          quickCalculationDeductions = 181920
        }
        // this.monthlyTaxesPaid.value = this.$tools.addZero(Math.round(this.taxOutsideInfoData.monthTaxPaid * 100) / 100)
        this.monthlyTaxesPaid.value = this.$tools.addZero(this.taxOutsideInfoData.monthTaxPaid)
        this.monthlyTaxesPaid.text = `${this.taxOutsideInfoData.finalWageSum} * ${deductionRate} - ${quickCalculationDeductions} - （以往月份的月缴税数） = ${this.taxOutsideInfoData.monthTaxPaid}`
        this.$get('taxOutside/oneInfo', {
          staffId: this.taxOutsideInfoData.staffId,
          year: this.taxOutsideInfoData.year,
          monthArr: this.taxOutsideInfoData.monthArr
        }).then((r) => {
          this.taxOutsideInfoDataProcessing(r.data)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-taxd i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-taxd .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

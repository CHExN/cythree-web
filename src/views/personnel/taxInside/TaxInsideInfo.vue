<template>
  <a-modal
    title="编内个税信息"
    :centered="true"
    :width="850"
    :visible="taxInsideInfoVisiable"
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
              <span style="cursor: pointer;">{{taxInsideInfoData.staffName}}</span>
            </a-popover>
          </detail-list-item> -->
          <detail-list-item term="姓名">{{taxInsideInfoData.staffName}}</detail-list-item>
          <detail-list-item term="证照类型">{{taxInsideInfoData.idCardTypeToDict}}</detail-list-item>
          <detail-list-item term="证照号码">{{taxInsideInfoData.staffIdCard}}</detail-list-item>
          <detail-list-item term="年月">{{`${taxInsideInfoData.year}-${taxInsideInfoData.month}`}}</detail-list-item>
          <detail-list-item term="本期收入">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.currentIncome.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.currentIncomeSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="本期免税收入">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.currentTaxFreeIncome.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.currentTaxFreeIncomeSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="基本养老保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.basicPensionIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.basicPensionIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="基本医疗保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.basicMedicalIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.basicMedicalIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="失业保险费">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.unemploymentIp.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.unemploymentIpSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="住房公积金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.housingFund.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.housingFundSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计子女教育">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeChildE.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.cumulativeChildESum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计继续教育">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeContinuingE.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.cumulativeContinuingESum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计住房贷款利息">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeHomeLoanInterest.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.cumulativeHomeLoanInterestSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计住房租金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeHousingRent.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.cumulativeHousingRentSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="累计赡养老人">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.cumulativeElderlySupport.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.cumulativeElderlySupportSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="企业(职业)年金">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.corporateAnnuity.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.corporateAnnuitySum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="商业健康保险">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.commercialHealthInsurance.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.commercialHealthInsuranceSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="税延养老保险">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.taxExtensionPensionInsurance.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.taxExtensionPensionInsuranceSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="其他">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.other.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.otherSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="准予扣除的捐赠额">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.allowanceForDeduction.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.allowanceForDeductionSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="减免税额">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.taxDeduction.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.taxDeductionSum}}</span>
            </a-popover>
          </detail-list-item>
          <detail-list-item term="最终收入">
            <a-popover trigger="hover">
              <template slot="content">
                <p>{{monthlyInformation.finalWage.join('；')}}</p>
              </template>
              <span style="cursor: pointer;">{{taxInsideInfoData.finalWageSum}}</span>
            </a-popover>
          </detail-list-item>
          <!-- <detail-list-item term="本期收入">{{taxInsideInfoData.currentIncome}}</detail-list-item>
          <detail-list-item term="本期免税收入">{{taxInsideInfoData.currentTaxFreeIncome}}</detail-list-item>
          <detail-list-item term="基本养老保险费">{{taxInsideInfoData.basicPensionIp}}</detail-list-item>
          <detail-list-item term="基本医疗保险费">{{taxInsideInfoData.basicMedicalIp}}</detail-list-item>
          <detail-list-item term="失业保险费">{{taxInsideInfoData.unemploymentIp}}</detail-list-item>
          <detail-list-item term="住房公积金">{{taxInsideInfoData.housingFund}}</detail-list-item>
          <detail-list-item term="累计子女教育">{{taxInsideInfoData.cumulativeChildE}}</detail-list-item>
          <detail-list-item term="累计继续教育">{{taxInsideInfoData.cumulativeContinuingE}}</detail-list-item>
          <detail-list-item term="累计住房贷款利息">{{taxInsideInfoData.cumulativeHomeLoanInterest}}</detail-list-item>
          <detail-list-item term="累计住房租金">{{taxInsideInfoData.cumulativeHousingRent}}</detail-list-item>
          <detail-list-item term="累计赡养老人">{{taxInsideInfoData.cumulativeElderlySupport}}</detail-list-item>
          <detail-list-item term="企业(职业)年金">{{taxInsideInfoData.corporateAnnuity}}</detail-list-item>
          <detail-list-item term="商业健康保险">{{taxInsideInfoData.commercialHealthInsurance}}</detail-list-item>
          <detail-list-item term="税延养老保险">{{taxInsideInfoData.taxExtensionPensionInsurance}}</detail-list-item>
          <detail-list-item term="其他">{{taxInsideInfoData.other}}</detail-list-item>
          <detail-list-item term="准予扣除的捐赠额">{{taxInsideInfoData.allowanceForDeduction}}</detail-list-item>
          <detail-list-item term="减免税额">{{taxInsideInfoData.taxDeduction}}</detail-list-item>
          <detail-list-item term="最终收入">{{taxInsideInfoData.finalWage}}</detail-list-item> -->
          <detail-list-item term="备注">{{taxInsideInfoData.remark}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '../../../components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'TaxInsideInfo',
  props: {
    taxInsideInfoVisiable: {
      require: true,
      default: false
    },
    taxInsideInfoData: {
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
    taxInsideInfoDataProcessing (oneInfo) {
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
    taxInsideInfoVisiable () {
      if (this.taxInsideInfoVisiable) {
        this.$get('taxInside/oneInfo', {
          staffId: this.taxInsideInfoData.staffId,
          year: this.taxInsideInfoData.year,
          monthArr: this.taxInsideInfoData.monthArr
        }).then((r) => {
          this.taxInsideInfoDataProcessing(r.data)
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

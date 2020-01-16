<template>
  <a-drawer
    title="修改编内个税信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="taxInsideEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='选择人员' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          autoFocus
          placeholder='人员'
          autocomplete="off"
          v-decorator="['staffName',
            {rules: [{ required: true, message: '请选择人员'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='月份' v-bind="formItemLayout">
        <a-month-picker
          placeholder='月份'
          style="width: 100%;"
          v-decorator="['yearMonth',
            {rules: [{ required: true, message: '月份不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='证照类型' v-bind="formItemLayout">
        <a-select placeholder='证照类型' v-decorator="['idCardType', {
          initialValue: [dictData.idCardType && JSON.stringify(dictData.idCardType)!=='{}' ? Object.keys(dictData.idCardType)[0] : ''],
          rules: [{ required: true, message: '请选择证照类型' }]
        }]">
          <a-select-option v-for="i in Object.keys(dictData.idCardType||[])" :key="i">{{ dictData.idCardType[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='本期收入' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='本期收入'
          v-decorator="['currentIncome',{
            rules: [{ required: true, message: '本期收入不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='免税收入' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='本期免税收入'
          v-decorator="['currentTaxFreeIncome']"/>
      </a-form-item>
      <a-form-item label='养老保险费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='基本养老保险费'
          v-decorator="['basicPensionIp']"/>
      </a-form-item>
      <a-form-item label='医疗保险费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='基本医疗保险费'
          v-decorator="['basicMedicalIp']"/>
      </a-form-item>
      <a-form-item label='失业保险费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='失业保险费'
          v-decorator="['unemploymentIp']"/>
      </a-form-item>
      <a-form-item label='住房公积金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='住房公积金'
          v-decorator="['housingFund']"/>
      </a-form-item>
      <a-form-item label='子女教育' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='累计子女教育'
          v-decorator="['cumulativeChildE']"/>
      </a-form-item>
      <a-form-item label='继续教育' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='累计继续教育'
          v-decorator="['cumulativeContinuingE']"/>
      </a-form-item>
      <a-form-item label='住房贷款利息' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='累计住房贷款利息'
          v-decorator="['cumulativeHomeLoanInterest']"/>
      </a-form-item>
      <a-form-item label='住房租金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='累计住房租金'
          v-decorator="['cumulativeHousingRent']"/>
      </a-form-item>
      <a-form-item label='赡养老人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='累计赡养老人'
          v-decorator="['cumulativeElderlySupport']"/>
      </a-form-item>
      <a-form-item label='企业年金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='企业(职业)年金'
          v-decorator="['corporateAnnuity']"/>
      </a-form-item>
      <a-form-item label='商业健康保险' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='商业健康保险'
          v-decorator="['commercialHealthInsurance']"/>
      </a-form-item>
      <a-form-item label='税延养老保险' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='税延养老保险'
          v-decorator="['taxExtensionPensionInsurance']"/>
      </a-form-item>
      <a-form-item label='其他' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='其他'
          v-decorator="['other']"/>
      </a-form-item>
      <a-form-item label='准予扣除的捐赠额' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='准予扣除的捐赠额'
          v-decorator="['allowanceForDeduction']"/>
      </a-form-item>
      <a-form-item label='减免税额' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='减免税额'
          v-decorator="['taxDeduction']"/>
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark']"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <staff-inside-list
      :staffInsideListVisiable="staffInsideList.visiable"
      @change="handleStaffInsideListChange"
      @close="handleStaffInsideListClose"
    >
    </staff-inside-list>
  </a-drawer>
</template>
<script>
import StaffInsideList from '../staffInside/StaffInsideList'
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'TaxInsideEdit',
  components: { StaffInsideList },
  props: {
    taxInsideEditVisiable: {
      default: false
    },
    dictData: {
      require: true
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffInsideList: {
        visiable: false
      },
      staffId: '',
      id: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.staffId = ''
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setFormValues ({...taxInside}) {
      this.id = taxInside.id
      this.form.getFieldDecorator('yearMonth')
      this.form.setFieldsValue({yearMonth: moment(`${taxInside.year}-${taxInside.month}`)})
      let obj = {}
      let fields = ['createTime', 'modifyTime', 'finalWage']
      Object.keys(taxInside).forEach((key) => {
        if (fields.includes(key)) return
        this.form.getFieldDecorator(key)
        obj[key] = taxInside[key]
      })
      this.form.setFieldsValue(obj)
    },
    selectName () {
      this.staffInsideList.visiable = true
    },
    handleStaffInsideListChange (staffName, staffId) {
      this.form.getFieldDecorator('staffName')
      this.form.setFieldsValue({ staffName: staffName })
      this.staffId = staffId
    },
    handleStaffInsideListClose () {
      this.staffInsideList.visiable = false
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let yearMonth = values.yearMonth
          values.yearMonth = undefined
          values.year = yearMonth.format('YYYY')
          values.month = yearMonth.format('MM')
          values.currentIncome = values.currentIncome || 0
          values.currentTaxFreeIncome = values.currentTaxFreeIncome || 0
          values.basicPensionIp = values.basicPensionIp || 0
          values.basicMedicalIp = values.basicMedicalIp || 0
          values.unemploymentIp = values.unemploymentIp || 0
          values.housingFund = values.housingFund || 0
          values.cumulativeChildE = values.cumulativeChildE || 0
          values.cumulativeContinuingE = values.cumulativeContinuingE || 0
          values.cumulativeHomeLoanInterest = values.cumulativeHomeLoanInterest || 0
          values.cumulativeHousingRent = values.cumulativeHousingRent || 0
          values.cumulativeElderlySupport = values.cumulativeElderlySupport || 0
          values.corporateAnnuity = values.corporateAnnuity || 0
          values.commercialHealthInsurance = values.commercialHealthInsurance || 0
          values.taxExtensionPensionInsurance = values.taxExtensionPensionInsurance || 0
          values.other = values.other || 0
          values.allowanceForDeduction = values.allowanceForDeduction || 0
          values.taxDeduction = values.taxDeduction || 0
          this.$put('taxInside', {
            ...values,
            id: this.id,
            staffId: this.staffId
          }).then((r) => {
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.$message.warning('格式出错，请检查表单')
        }
      })
    }
  }
}
</script>

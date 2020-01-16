<template>
  <a-drawer
    title="修改保险信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="insuranceEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='编制类别' v-bind="formItemLayout">
        <a-radio-group @change="onRadioChange" v-decorator="['insideOrOutside',
          {rules: [{ required: true, message: '请选择编制类别' }]}
        ]">
          <a-radio-button value="0">编内</a-radio-button>
          <a-radio-button value="1">编外</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='选择社保' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          placeholder='保险人员'
          autocomplete="off"
          v-decorator="['name',
            {rules: [{ required: true, message: '请选择社保'}]}
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
      <a-form-item label='养老保险基数' v-bind="formItemLayout">
        <a-input-number
          :disabled="true"
          style="width: 100%;"
          placeholder='养老保险基数'
          v-decorator="['pensionInsuranceBase']"/>
      </a-form-item>
      <a-form-item label='工伤保险基数' v-bind="formItemLayout">
        <a-input-number
          :disabled="true"
          style="width: 100%;"
          placeholder='工伤保险基数'
          v-decorator="['workInjuryInsuranceBase']"/>
      </a-form-item>
      <a-form-item label='医疗保险基数' v-bind="formItemLayout">
        <a-input-number
          :disabled="true"
          style="width: 100%;"
          placeholder='医疗保险基数'
          v-decorator="['medicalInsuranceBase']"/>
      </a-form-item>
      <a-form-item label='养老保险个人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='养老保险个人'
          v-decorator="['pensionInsuranceIndividual']"/>
      </a-form-item>
      <a-form-item label='失业保险个人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='失业保险个人'
          v-decorator="['unemploymentInsuranceIndividual']"/>
      </a-form-item>
      <a-form-item label='医疗保险个人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗保险个人'
          v-decorator="['medicalInsuranceIndividual']"/>
      </a-form-item>
      <a-form-item label='医疗互助个人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗互助个人'
          v-decorator="['medicalMutualAidIndividual']"/>
      </a-form-item>
      <a-form-item label='职业年金个人' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='职业年金个人'
          v-decorator="['corporateAnnuityIndividual']"/>
      </a-form-item>
      <a-form-item label='养老保险单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='养老保险单位'
          v-decorator="['pensionInsuranceUnit']"/>
      </a-form-item>
      <a-form-item label='失业保险单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='失业保险单位'
          v-decorator="['unemploymentInsuranceUnit']"/>
      </a-form-item>
      <a-form-item label='工伤保险单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='工伤保险单位'
          v-decorator="['workInjuryInsuranceUnit']"/>
      </a-form-item>
      <a-form-item label='生育保险单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='生育保险单位'
          v-decorator="['maternityInsuranceUnit']"/>
      </a-form-item>
      <a-form-item label='医疗保险单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗保险单位'
          v-decorator="['medicalInsuranceUnit']"/>
      </a-form-item>
      <a-form-item label='医疗互助单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗互助单位'
          v-decorator="['medicalMutualAidUnit']"/>
      </a-form-item>
      <a-form-item label='公疗补充单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='公疗补充单位'
          v-decorator="['publicTherapySupplementUnit']"/>
      </a-form-item>
      <a-form-item label='职业年金单位' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='职业年金单位'
          v-decorator="['corporateAnnuityUnit']"/>
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <insurance-outside-list
      :insuranceOutsideListVisiable="insuranceOutsideList.visiable"
      @change="handleInsuranceOutsideListChange"
      @close="handleInsuranceOutsideListClose"
    >
    </insurance-outside-list>
    <insurance-inside-list
      :insuranceInsideListVisiable="insuranceInsideList.visiable"
      @change="handleInsuranceInsideListChange"
      @close="handleInsuranceInsideListClose"
    >
    </insurance-inside-list>
  </a-drawer>
</template>
<script>
import InsuranceOutsideList from '../insuranceOutside/InsuranceOutsideList'
import InsuranceInsideList from '../insuranceInside/InsuranceInsideList'
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'InsuranceEdit',
  components: { InsuranceOutsideList, InsuranceInsideList },
  props: {
    insuranceEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      insuranceOutsideList: {
        visiable: false
      },
      insuranceInsideList: {
        visiable: false
      },
      insuranceId: '',
      id: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.insuranceId = ''
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    onRadioChange (e) {
      // 切换radio时 重置选择人员
      this.form.getFieldDecorator('name')
      this.form.setFieldsValue({ name: '' })
      this.insuranceId = ''
    },
    setFormValues ({...insurance}) {
      this.id = insurance.id
      this.form.getFieldDecorator('yearMonth')
      this.form.setFieldsValue({yearMonth: moment(`${insurance.year}-${insurance.month}`)})
      let obj = {}
      let fields = ['createTime', 'modifyTime', 'finalInsurance']
      Object.keys(insurance).forEach((key) => {
        if (fields.includes(key)) return
        this.form.getFieldDecorator(key)
        obj[key] = insurance[key]
      })
      this.form.setFieldsValue(obj)
    },
    selectName () {
      let insideOrOutside = this.form.getFieldValue('insideOrOutside')
      if (insideOrOutside === '0') {
        this.insuranceInsideList.visiable = true
      } else if (insideOrOutside === '1') {
        this.insuranceOutsideList.visiable = true
      } else {
        this.$message.warning('请先选择编制类别')
      }
    },
    handleInsuranceInsideListChange (name, insuranceId, householdRegistrationType, pensionInsuranceBase, workInjuryInsuranceBase, medicalInsuranceBase) {
      const fields = ['name', 'pensionInsuranceBase', 'workInjuryInsuranceBase', 'medicalInsuranceBase', 'pensionInsuranceIndividual',
        'unemploymentInsuranceIndividual', 'medicalInsuranceIndividual', 'corporateAnnuityIndividual', 'pensionInsuranceUnit',
        'unemploymentInsuranceUnit', 'workInjuryInsuranceUnit', 'maternityInsuranceUnit', 'medicalInsuranceUnit', 'medicalMutualAidUnit',
        'publicTherapySupplementUnit', 'corporateAnnuityUnit']
      const insideOrOutside = this.form.getFieldValue('insideOrOutside')
      fields.forEach((key) => {
        this.form.getFieldDecorator(key)
      })
      this.form.setFieldsValue({
        name: name,
        // 养老保险基数
        pensionInsuranceBase: pensionInsuranceBase,
        // 工伤保险基数
        workInjuryInsuranceBase: workInjuryInsuranceBase,
        // 医疗保险基数
        medicalInsuranceBase: medicalInsuranceBase,
        // 养老保险 个人 (养老保险基数 * 0.08)
        pensionInsuranceIndividual: pensionInsuranceBase * 0.08,
        // 失业保险 个人 (工伤保险基数 * 0.002)  城镇户口的扣,农村户口的不扣
        unemploymentInsuranceIndividual: ['1', '3'].includes(householdRegistrationType) ? workInjuryInsuranceBase * 0.002 : 0,
        // 医疗保险 个人 (医疗保险基数 * 0.02)
        medicalInsuranceIndividual: medicalInsuranceBase * 0.02,
        // 职业年金 个人 (养老保险基数 * 0.04)  编外无
        corporateAnnuityIndividual: insideOrOutside === '0' ? pensionInsuranceBase * 0.04 : 0,
        // 养老保险 单位 (养老保险基数 * 0.16)
        pensionInsuranceUnit: pensionInsuranceBase * 0.16,
        // 失业保险 单位 (养老保险基数 * 0.008)
        unemploymentInsuranceUnit: pensionInsuranceBase * 0.008,
        // 工伤保险 单位 (工伤保险基数 * 0.002)
        workInjuryInsuranceUnit: workInjuryInsuranceBase * 0.002,
        // 生育保险 单位 (医疗保险基数 * 0.008)
        maternityInsuranceUnit: medicalInsuranceBase * 0.008,
        // 医疗保险 单位 (医疗保险基数 * 0.09)
        medicalInsuranceUnit: medicalInsuranceBase * 0.09,
        // 医疗互助 单位 (医疗保险基数 * 0.01)
        medicalMutualAidUnit: medicalInsuranceBase * 0.01,
        // 公疗补充 单位 (医疗保险基数 * 0.03)  编外无
        publicTherapySupplementUnit: insideOrOutside === '0' ? medicalInsuranceBase * 0.03 : 0,
        // 职业年金 单位 (养老保险基数 * 0.08)  编外无
        corporateAnnuityUnit: insideOrOutside === '0' ? pensionInsuranceBase * 0.08 : 0
      })
      this.insuranceId = insuranceId
    },
    handleInsuranceInsideListClose () {
      this.insuranceInsideList.visiable = false
    },
    handleInsuranceOutsideListChange (name, insuranceId, householdRegistrationType, pensionInsuranceBase, workInjuryInsuranceBase, medicalInsuranceBase) {
      const fields = ['name', 'pensionInsuranceBase', 'workInjuryInsuranceBase', 'medicalInsuranceBase', 'pensionInsuranceIndividual',
        'unemploymentInsuranceIndividual', 'medicalInsuranceIndividual', 'corporateAnnuityIndividual', 'pensionInsuranceUnit',
        'unemploymentInsuranceUnit', 'workInjuryInsuranceUnit', 'maternityInsuranceUnit', 'medicalInsuranceUnit', 'medicalMutualAidUnit',
        'publicTherapySupplementUnit', 'corporateAnnuityUnit']
      const insideOrOutside = this.form.getFieldValue('insideOrOutside')
      fields.forEach((key) => {
        this.form.getFieldDecorator(key)
      })
      this.form.setFieldsValue({
        name: name,
        // 养老保险基数
        pensionInsuranceBase: pensionInsuranceBase,
        // 工伤保险基数
        workInjuryInsuranceBase: workInjuryInsuranceBase,
        // 医疗保险基数
        medicalInsuranceBase: medicalInsuranceBase,
        // 养老保险 个人 (养老保险基数 * 0.08)
        pensionInsuranceIndividual: pensionInsuranceBase * 0.08,
        // 失业保险 个人 (工伤保险基数 * 0.002)  城镇户口的扣,农村户口的不扣
        unemploymentInsuranceIndividual: ['1', '3'].includes(householdRegistrationType) ? workInjuryInsuranceBase * 0.002 : 0,
        // 医疗保险 个人 (医疗保险基数 * 0.02)
        medicalInsuranceIndividual: medicalInsuranceBase * 0.02,
        // 职业年金 个人 (养老保险基数 * 0.04)  编外无
        corporateAnnuityIndividual: insideOrOutside === '0' ? pensionInsuranceBase * 0.04 : 0,
        // 养老保险 单位 (养老保险基数 * 0.16)
        pensionInsuranceUnit: pensionInsuranceBase * 0.16,
        // 失业保险 单位 (养老保险基数 * 0.008)
        unemploymentInsuranceUnit: pensionInsuranceBase * 0.008,
        // 工伤保险 单位 (工伤保险基数 * 0.002)
        workInjuryInsuranceUnit: workInjuryInsuranceBase * 0.002,
        // 生育保险 单位 (医疗保险基数 * 0.008)
        maternityInsuranceUnit: medicalInsuranceBase * 0.008,
        // 医疗保险 单位 (医疗保险基数 * 0.09)
        medicalInsuranceUnit: medicalInsuranceBase * 0.09,
        // 医疗互助 单位 (医疗保险基数 * 0.01)
        medicalMutualAidUnit: medicalInsuranceBase * 0.01,
        // 公疗补充 单位 (医疗保险基数 * 0.03)  编外无
        publicTherapySupplementUnit: insideOrOutside === '0' ? medicalInsuranceBase * 0.03 : 0,
        // 职业年金 单位 (养老保险基数 * 0.08)  编外无
        corporateAnnuityUnit: insideOrOutside === '0' ? pensionInsuranceBase * 0.08 : 0
      })
      this.insuranceId = insuranceId
    },
    handleInsuranceOutsideListClose () {
      this.insuranceOutsideList.visiable = false
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let yearMonth = values.yearMonth
          values.yearMonth = undefined
          values.year = yearMonth.format('YYYY')
          values.month = yearMonth.format('MM')
          values.pensionInsuranceIndividual = values.pensionInsuranceIndividual || 0
          values.unemploymentInsuranceIndividual = values.unemploymentInsuranceIndividual || 0
          values.medicalInsuranceIndividual = values.medicalInsuranceIndividual || 0
          values.medicalMutualAidIndividual = values.medicalMutualAidIndividual || 0
          values.corporateAnnuityIndividual = values.corporateAnnuityIndividual || 0
          values.pensionInsuranceUnit = values.pensionInsuranceUnit || 0
          values.unemploymentInsuranceUnit = values.unemploymentInsuranceUnit || 0
          values.workInjuryInsuranceUnit = values.workInjuryInsuranceUnit || 0
          values.maternityInsuranceUnit = values.maternityInsuranceUnit || 0
          values.medicalInsuranceUnit = values.medicalInsuranceUnit || 0
          values.medicalMutualAidUnit = values.medicalMutualAidUnit || 0
          values.publicTherapySupplementUnit = values.publicTherapySupplementUnit || 0
          values.corporateAnnuityUnit = values.corporateAnnuityUnit || 0
          this.$put('insurance', {
            ...values,
            id: this.id,
            insuranceId: this.insuranceId
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

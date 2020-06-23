<template>
  <a-drawer
    title="修改工资信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wageOutsideEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='选择人员' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
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
      <a-form-item label='基本工资' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='基本工资'
          v-decorator="['currentIncome']"/>
      </a-form-item>
      <a-form-item label='岗位津贴' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='岗位津贴'
          v-decorator="['postAllowance']"/>
      </a-form-item>
      <a-form-item label='环卫津贴' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='环卫津贴'
          v-decorator="['sanitationAllowance']"/>
      </a-form-item>
      <a-form-item label='危岗补助' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='危岗补助'
          v-decorator="['dangerousSubsidy']"/>
      </a-form-item>
      <a-form-item label='绩效奖金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='绩效奖金'
          v-decorator="['performanceBonus']"/>
      </a-form-item>
      <a-form-item label='加班费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='加班费'
          v-decorator="['overtimePay']"/>
      </a-form-item>
      <a-form-item label='过节费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='过节费'
          v-decorator="['holidayCosts']"/>
      </a-form-item>

      <a-form-item label='空列1' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列1'
          v-decorator="['emptyColumn01']"/>
      </a-form-item>
      <a-form-item label='空列2' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列2'
          v-decorator="['emptyColumn02']"/>
      </a-form-item>
      <a-form-item label='空列3' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列3'
          v-decorator="['emptyColumn03']"/>
      </a-form-item>
      <a-form-item label='空列4' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列4'
          v-decorator="['emptyColumn04']"/>
      </a-form-item>
      <a-form-item label='空列5' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列5'
          v-decorator="['emptyColumn05']"/>
      </a-form-item>

      <a-form-item label='应发工资' v-bind="formItemLayout">
        <a-input-number
          disabled
          style="width: 100%;"
          placeholder='应发工资'
          v-decorator="['payable']"/>
      </a-form-item>
      <a-form-item label='养老保险' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='养老保险'
          v-decorator="['basicPensionIp']"/>
      </a-form-item>
      <a-form-item label='失业保险' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='失业保险'
          v-decorator="['unemploymentIp']"/>
      </a-form-item>
      <a-form-item label='医疗保险' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗保险'
          v-decorator="['basicMedicalIp']"/>
      </a-form-item>
      <a-form-item label='税金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='税金'
          v-decorator="['taxDeduction']"/>
      </a-form-item>
      <a-form-item label='会费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='会费'
          v-decorator="['membership']"/>
      </a-form-item>
      <a-form-item label='住房公积金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='住房公积金'
          v-decorator="['housingFund']"/>
      </a-form-item>
      <a-form-item label='病事假' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='病事假'
          v-decorator="['sickLeave']"/>
      </a-form-item>

      <a-form-item label='空列6' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列6'
          v-decorator="['emptyColumn06']"/>
      </a-form-item>
      <a-form-item label='空列7' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列7'
          v-decorator="['emptyColumn07']"/>
      </a-form-item>
      <a-form-item label='空列8' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列8'
          v-decorator="['emptyColumn08']"/>
      </a-form-item>
      <a-form-item label='空列9' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列9'
          v-decorator="['emptyColumn09']"/>
      </a-form-item>
      <a-form-item label='空列10' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='空列10'
          v-decorator="['emptyColumn10']"/>
      </a-form-item>

      <a-form-item label='实发工资' v-bind="formItemLayout">
        <a-input-number
          disabled
          style="width: 100%;"
          placeholder='实发工资'
          v-decorator="['realWage']"/>
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list>
  </a-drawer>
</template>
<script>
import StaffOutsideList from '../staffOutside/StaffOutsideList'
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WageOutsideEdit',
  components: { StaffOutsideList },
  props: {
    wageOutsideEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffOutsideList: {
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
    setFormValues ({...wageOutside}) {
      this.id = wageOutside.id
      this.form.getFieldDecorator('yearMonth')
      this.form.setFieldsValue({yearMonth: moment(`${wageOutside.year}-${wageOutside.month}`)})
      let obj = {}
      let fields = ['createTime', 'modifyTime']
      Object.keys(wageOutside).forEach((key) => {
        if (fields.includes(key)) return
        this.form.getFieldDecorator(key)
        obj[key] = wageOutside[key]
      })
      this.form.setFieldsValue(obj)
    },
    selectName () {
      this.staffOutsideList.visiable = true
    },
    handleStaffOutsideListChange (staffName, staffId) {
      this.form.getFieldDecorator('staffName')
      this.form.setFieldsValue({ staffName: staffName })
      this.staffId = staffId
    },
    handleStaffOutsideListClose () {
      this.staffOutsideList.visiable = false
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
          values.postAllowance = values.postAllowance || 0
          values.sanitationAllowance = values.sanitationAllowance || 0
          values.dangerousSubsidy = values.dangerousSubsidy || 0
          values.performanceBonus = values.performanceBonus || 0
          values.overtimePay = values.overtimePay || 0
          values.holidayCosts = values.holidayCosts || 0
          values.emptyColumn01 = values.emptyColumn01 || 0
          values.emptyColumn02 = values.emptyColumn02 || 0
          values.emptyColumn03 = values.emptyColumn03 || 0
          values.emptyColumn04 = values.emptyColumn04 || 0
          values.emptyColumn05 = values.emptyColumn05 || 0
          // values.payable = values.payable || 0
          values.basicPensionIp = values.basicPensionIp || 0
          values.unemploymentIp = values.unemploymentIp || 0
          values.basicMedicalIp = values.basicMedicalIp || 0
          values.taxDeduction = values.taxDeduction || 0
          values.membership = values.membership || 0
          values.housingFund = values.housingFund || 0
          values.sickLeave = values.sickLeave || 0
          values.emptyColumn06 = values.emptyColumn06 || 0
          values.emptyColumn07 = values.emptyColumn07 || 0
          values.emptyColumn08 = values.emptyColumn08 || 0
          values.emptyColumn09 = values.emptyColumn09 || 0
          values.emptyColumn10 = values.emptyColumn10 || 0
          // values.realWage = values.realWage || 0
          this.$put('wageOutside', {
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

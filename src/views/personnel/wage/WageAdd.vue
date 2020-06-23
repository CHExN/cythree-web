<template>
  <a-drawer
    title="新增工资信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wageAddVisiable"
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
      <a-form-item label='岗位工资' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='岗位工资'
          v-decorator="['currentIncome']"/>
      </a-form-item>
      <a-form-item label='补发薪级' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='补发薪级'
          v-decorator="['reissueSalaryScale']"/>
      </a-form-item>
      <a-form-item label='薪级工资' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='薪级工资'
          v-decorator="['salarySalary']"/>
      </a-form-item>
      <a-form-item label='岗位津贴' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='岗位津贴'
          v-decorator="['postAllowance']"/>
      </a-form-item>
      <a-form-item label='财政负担' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='财政负担'
          v-decorator="['financialBurdenPerformancePay']"/>
      </a-form-item>
      <a-form-item label='加班费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='加班费'
          v-decorator="['overtimePay']"/>
      </a-form-item>
      <a-form-item label='环卫危害岗位补助' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='环卫危害岗位补助'
          v-decorator="['environmentalSanitationDutyAllowance']"/>
      </a-form-item>
      <a-form-item label='住房补贴' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='住房补贴'
          v-decorator="['housingSubsidy']"/>
      </a-form-item>
      <a-form-item label='独生子女费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='独生子女费'
          v-decorator="['onlyChildFee']"/>
      </a-form-item>
      <a-form-item label='临时性补贴' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='临时性补贴'
          v-decorator="['temporarySubsidy']"/>
      </a-form-item>
      <a-form-item label='岗位绩效' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='岗位绩效'
          v-decorator="['jobPerformance']"/>
      </a-form-item>
      <a-form-item label='过节费' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='过节费'
          v-decorator="['holidayCosts']"/>
      </a-form-item>
      <a-form-item label='年休假工资报酬' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='年休假工资报酬'
          v-decorator="['annualLeavePay']"/>
      </a-form-item>
      <a-form-item label='综合补助' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='综合补助'
          v-decorator="['comprehensiveSubsidy']"/>
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

      <a-form-item label='住房公积金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='住房公积金'
          v-decorator="['housingFund']"/>
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
          placeholder='基本医疗保险'
          v-decorator="['basicMedicalIp']"/>
      </a-form-item>
      <a-form-item label='医疗互助' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='医疗互助'
          v-decorator="['medicalMutualAid']"/>
      </a-form-item>
      <a-form-item label='职业年金' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='职业年金'
          v-decorator="['corporateAnnuity']"/>
      </a-form-item>
      <a-form-item label='扣税' v-bind="formItemLayout">
        <a-input-number
          style="width: 100%;"
          placeholder='扣税'
          v-decorator="['taxDeduction']"/>
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
    <!-- <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list> -->
    <staff-inside-list
      :staffInsideListVisiable="staffInsideList.visiable"
      @change="handleStaffInsideListChange"
      @close="handleStaffInsideListClose"
    >
    </staff-inside-list>
  </a-drawer>
</template>
<script>
// import StaffOutsideList from '../staffOutside/StaffOutsideList'
import StaffInsideList from '../staffInside/StaffInsideList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WageAdd',
  // components: { StaffOutsideList, StaffInsideList },
  components: { StaffInsideList },
  props: {
    wageAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      // staffOutsideList: {
      //   visiable: false
      // },
      staffInsideList: {
        visiable: false
      },
      staffId: ''
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
    // onRadioChange (e) {
    //   // 切换radio时 重置选择人员
    //   this.form.getFieldDecorator('staffName')
    //   this.form.setFieldsValue({ staffName: '' })
    //   this.staffId = ''
    // },
    selectName () {
      // let insideOrOutside = this.form.getFieldValue('insideOrOutside')
      // if (insideOrOutside === '0') {
      //   this.staffInsideList.visiable = true
      // } else if (insideOrOutside === '1') {
      //   this.staffOutsideList.visiable = true
      // } else {
      //   this.$message.warning('请先选择编制类别')
      // }
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
    // handleStaffOutsideListChange (staffName, staffId) {
    //   this.form.getFieldDecorator('staffName')
    //   this.form.setFieldsValue({ staffName: staffName })
    //   this.staffId = staffId
    // },
    // handleStaffOutsideListClose () {
    //   this.staffOutsideList.visiable = false
    // },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let yearMonth = values.yearMonth
          values.yearMonth = undefined
          values.year = yearMonth.format('YYYY')
          values.month = yearMonth.format('MM')
          values.currentIncome = values.currentIncome || 0
          values.reissueSalaryScale = values.reissueSalaryScale || 0
          values.salarySalary = values.salarySalary || 0
          values.postAllowance = values.postAllowance || 0
          values.financialBurdenPerformancePay = values.financialBurdenPerformancePay || 0
          values.overtimePay = values.overtimePay || 0
          values.environmentalSanitationDutyAllowance = values.environmentalSanitationDutyAllowance || 0
          values.housingSubsidy = values.housingSubsidy || 0
          values.onlyChildFee = values.onlyChildFee || 0
          values.temporarySubsidy = values.temporarySubsidy || 0
          values.jobPerformance = values.jobPerformance || 0
          values.holidayCosts = values.holidayCosts || 0
          values.annualLeavePay = values.annualLeavePay || 0
          values.comprehensiveSubsidy = values.comprehensiveSubsidy || 0
          values.emptyColumn01 = values.emptyColumn01 || 0
          values.emptyColumn02 = values.emptyColumn02 || 0
          values.emptyColumn03 = values.emptyColumn03 || 0
          values.emptyColumn04 = values.emptyColumn04 || 0
          values.emptyColumn05 = values.emptyColumn05 || 0
          // values.payable = values.payable || 0
          values.housingFund = values.housingFund || 0
          values.basicPensionIp = values.basicPensionIp || 0
          values.unemploymentIp = values.unemploymentIp || 0
          values.basicMedicalIp = values.basicMedicalIp || 0
          values.medicalMutualAid = values.medicalMutualAid || 0
          values.corporateAnnuity = values.corporateAnnuity || 0
          values.taxDeduction = values.taxDeduction || 0
          values.emptyColumn06 = values.emptyColumn06 || 0
          values.emptyColumn07 = values.emptyColumn07 || 0
          values.emptyColumn08 = values.emptyColumn08 || 0
          values.emptyColumn09 = values.emptyColumn09 || 0
          values.emptyColumn10 = values.emptyColumn10 || 0
          // values.realWage = values.realWage || 0
          this.$post('wage', {
            ...values,
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

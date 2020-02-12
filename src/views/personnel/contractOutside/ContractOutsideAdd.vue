<template>
  <a-drawer
    title="新增编外合同"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="contractOutsideAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input
          disabled
          autocomplete="off"
          v-decorator="['name']"/>
      </a-form-item>
      <a-form-item label='身份证号' v-bind="formItemLayout">
        <a-input-search
          @search="selectIdNum"
          placeholder='身份证号'
          autocomplete="off"
          v-decorator="['idNum']"
        />
      </a-form-item>

      <a-form-item
        v-for="(k, index) in form.getFieldValue('contractPeriodKeys')"
        :key="k"
        :label="index === 0 ? '合同期' : ''"
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
        :required="false"
      >
        <a-input
          placeholder='合同期'
          style="width: 90%; margin-right: 8px"
          autocomplete="off"
          v-decorator="[`contractPeriod[${k}]`,
            {rules: [{ required: true, message: '合同期不能为空'}]}
          ]"
        />
        <a-range-picker
          :allowClear="false"
          style="width: 90%; margin-right: 8px"
          v-decorator="[`contractPeriodDate[${k}]`,
            {rules: [{ required: true, message: '日期选择不能为空'}]}
          ]"
        />
        <a-icon
          v-if="form.getFieldValue('contractPeriodKeys').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="form.getFieldValue('contractPeriodKeys').length === 1"
          @click="() => contractPeriodRemove(k)"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="contractPeriodAdd">
          <a-icon type="plus" /> 添加合同期
        </a-button>
      </a-form-item>

      <a-form-item
        v-for="(k, index) in form.getFieldValue('jobAgreementKeys')"
        :key="k"
        :label="index === 0 ? '职位协议' : ''"
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
        :required="false"
      >
        <a-input
          placeholder='职位协议'
          style="width: 90%; margin-right: 8px"
          autocomplete="off"
          v-decorator="[`jobAgreement[${k}]`,
            {rules: [{ required: true, message: '职位协议不能为空'}]}
          ]"
        />
        <a-range-picker
          :allowClear="false"
          style="width: 90%; margin-right: 8px"
          v-decorator="[`jobAgreementDate[${k}]`,
            {rules: [{ required: true, message: '日期选择不能为空'}]}
          ]"
        />
        <a-icon
          v-if="form.getFieldValue('jobAgreementKeys').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="form.getFieldValue('jobAgreementKeys').length === 1"
          @click="() => jobAgreementRemove(k)"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="jobAgreementAdd">
          <a-icon type="plus" /> 添加职位协议
        </a-button>
      </a-form-item>

      <a-form-item label='无固定期' v-bind="formItemLayout">
        <a-radio-group v-decorator="['isFixedPeriod', {initialValue: '1'}]">
          <a-radio-button value="0">开</a-radio-button>
          <a-radio-button value="1">关</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='续签备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='续签备注'
          autocomplete="off"
          v-decorator="['remarkRenew']"
        />
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
    <!-- <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      temporary="123123"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list> -->
  </a-drawer>
</template>
<script>
// import StaffOutsideList from '../staffOutside/StaffOutsideList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 17, offset: 0 },
    sm: { span: 17, offset: 4 }
  }
}
let contractPeriodIndex = 0
let jobAgreementIndex = 0

export default {
  name: 'ContractOutsideAdd',
  // components: { StaffOutsideList },
  props: {
    contractOutsideAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      formItemLayoutWithOutLabel,
      form: this.$form.createForm(this),
      // staffOutsideList: {
      //   visiable: false
      // },
      idNum: ''
    }
  },
  created () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('contractPeriodKeys', { initialValue: [], preserve: true })
    this.form.getFieldDecorator('jobAgreementKeys', { initialValue: [], preserve: true })
  },
  methods: {
    selectIdNum (value) {
      this.$message.loading('查询此身份证号中...', 0)
      this.$get('staffOutside/getStaffOutsideByIdNum', {
        idNum: value
      }).then((r) => {
        this.$message.destroy()
        if (r.data) {
          this.$message.success(`查询成功，姓名为 [${r.data.name}]`)
          this.form.getFieldDecorator('name')
          this.form.setFieldsValue({ name: r.data.name })
        } else {
          this.$message.warning('查询失败，未查找到此身份证号信息')
        }
      })
    },
    contractPeriodRemove (k) {
      const { form } = this
      // can use data-binding to get
      const contractPeriodKeys = form.getFieldValue('contractPeriodKeys')
      // We need at least one passenger
      if (contractPeriodKeys.length === 1) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        contractPeriodKeys: contractPeriodKeys.filter(key => key !== k)
      })
    },
    contractPeriodAdd () {
      const { form } = this
      // can use data-binding to get
      const contractPeriodKeys = form.getFieldValue('contractPeriodKeys')
      const nextKeys = contractPeriodKeys.concat(contractPeriodIndex++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        contractPeriodKeys: nextKeys
      })
    },
    jobAgreementRemove (k) {
      const { form } = this
      const jobAgreementKeys = form.getFieldValue('jobAgreementKeys')
      if (jobAgreementKeys.length === 1) {
        return
      }
      form.setFieldsValue({
        jobAgreementKeys: jobAgreementKeys.filter(key => key !== k)
      })
    },
    jobAgreementAdd () {
      const { form } = this
      const jobAgreementKeys = form.getFieldValue('jobAgreementKeys')
      const nextKeys = jobAgreementKeys.concat(jobAgreementIndex++)
      form.setFieldsValue({
        jobAgreementKeys: nextKeys
      })
    },
    reset () {
      this.loading = false
      contractPeriodIndex = 0
      jobAgreementIndex = 0
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    // selectName () {
    //   this.staffOutsideList.visiable = true
    // },
    // handleStaffOutsideListChange (name, idNum) {
    //   this.form.getFieldDecorator('name')
    //   this.form.setFieldsValue({ name: name })
    //   this.idNum = idNum
    // },
    // handleStaffOutsideListClose () {
    //   this.staffOutsideList.visiable = false
    // },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          // filter去数组空值假值
          let contractPeriodArr = this.form.getFieldValue('contractPeriod').filter(d => d)
          let contractPeriodDateArr = []
          this.form.getFieldValue('contractPeriodDate').forEach(element => {
            contractPeriodDateArr.push(`${element[0].format('YYYY-MM-DD')}~${element[1].format('YYYY-MM-DD')}`)
          })
          let jobAgreementArr = this.form.getFieldValue('jobAgreement').filter(d => d)
          let jobAgreementDateArr = []
          this.form.getFieldValue('jobAgreementDate').forEach(element => {
            jobAgreementDateArr.push(`${element[0].format('YYYY-MM-DD')}~${element[1].format('YYYY-MM-DD')}`)
          })
          this.loading = true
          this.$post('contractOutside', {
            ...values,
            contractPeriod: contractPeriodArr.join(),
            contractPeriodDate: contractPeriodDateArr.join(),
            jobAgreement: jobAgreementArr.join(),
            jobAgreementDate: jobAgreementDateArr.join()
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
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
  },
  watch: {
    contractOutsideAddVisiable () {
      if (this.contractOutsideAddVisiable) {
        this.contractPeriodAdd()
        this.jobAgreementAdd()
      }
    }
  }
}
</script>

<template>
  <a-drawer
    title="修改编外保险人员"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="insuranceOutsideEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='类型' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['newTransfer',
            {rules: [{ required: true, message: '请选择类型'}]}
          ]">
          <a-radio-button value="0">新参</a-radio-button>
          <a-radio-button value="1">转入</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          placeholder='姓名'
          autocomplete="off"
          v-decorator="['name']"/>
      </a-form-item>
      <a-form-item label='户口地址' v-bind="formItemLayout">
        <a-textarea
          placeholder='户口地址'
          autocomplete="off"
          v-decorator="['accountAddress']"
        />
      </a-form-item>
      <a-form-item label='户口邮编' v-bind="formItemLayout">
        <a-input
          placeholder='户口地址邮编'
          autocomplete="off"
          v-decorator="['accountPostalCode']"
        />
      </a-form-item>
      <a-form-item label='现地址' v-bind="formItemLayout">
        <a-textarea
          placeholder='现居住地址'
          autocomplete="off"
          v-decorator="['currentAddress']"
        />
      </a-form-item>
      <a-form-item label='现邮编' v-bind="formItemLayout">
        <a-input
          placeholder='现居住地址邮编'
          autocomplete="off"
          v-decorator="['currentPostalCode']"
        />
      </a-form-item>
      <a-form-item label='银行卡号' v-bind="formItemLayout">
        <a-input
          placeholder='银行卡号'
          autocomplete="off"
          v-decorator="['bankCardNumber']"
        />
      </a-form-item>
      <a-form-item label='社保医院' v-bind="formItemLayout">
        <a-textarea
          placeholder='社保医院'
          autocomplete="off"
          v-decorator="['socialSecurityHospital']"
        />
      </a-form-item>
      <a-form-item label='养老保险' v-bind="formItemLayout">
        <a-input-number
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='养老保险'
          v-decorator="['pensionInsuranceBase']"/>
      </a-form-item>
      <a-form-item label='工伤保险' v-bind="formItemLayout">
        <a-input-number
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='工伤保险'
          v-decorator="['workInjuryInsuranceBase']"/>
      </a-form-item>
      <a-form-item label='医疗保险' v-bind="formItemLayout">
        <a-input-number
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='医疗保险'
          v-decorator="['medicalInsuranceBase']"/>
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
      post="123123"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list>
  </a-drawer>
</template>
<script>
import StaffOutsideList from '../staffOutside/StaffOutsideList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'InsuranceOutsideEdit',
  components: { StaffOutsideList },
  props: {
    insuranceOutsideEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      id: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffOutsideList: {
        visiable: false
      },
      staffId: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    selectName () {
      this.staffOutsideList.visiable = true
    },
    handleStaffOutsideListChange (name, staffId) {
      this.form.getFieldDecorator('name')
      this.form.setFieldsValue({ name: name })
      this.staffId = staffId
    },
    handleStaffOutsideListClose () {
      this.staffOutsideList.visiable = false
    },
    setFormValues ({...insuranceOutside}) {
      this.id = insuranceOutside.id
      this.staffId = insuranceOutside.staffId
      let fields = ['createTime', 'modifyTime']
      let obj = {}
      Object.keys(insuranceOutside).forEach((key) => {
        if (fields.indexOf(key) === -1) {
          this.form.getFieldDecorator(key)
          obj[key] = insuranceOutside[key]
        }
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$put('insuranceOutside', {
            ...values,
            staffId: this.staffId,
            id: this.id
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

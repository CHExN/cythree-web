<template>
  <a-drawer
    title="修改印章审批单"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="sealEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='使用人' v-bind="formItemLayout">
        <a-input
          placeholder='印章使用人'
          autocomplete="off"
          v-decorator="['sealUser',
            {rules: [{required: true, message: '印章使用人不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='份数' v-bind="formItemLayout">
        <a-input-number
          :min="1"
          :max="10000"
          :formatter="value => value"
          :parser="value => parseFloat(value) || 0"
          style="width: 100%;"
          placeholder='份数'
          v-decorator="['amount',
            {rules: [{required: true, message: '份数不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='使用事由' v-bind="formItemLayout">
        <a-textarea
          placeholder='印章使用事由'
          autocomplete="off"
          v-decorator="['remark',
            {rules: [{required: true, message: '印章使用事由不能为空'}]}
          ]"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'SealEdit',
  props: {
    sealEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      id: undefined,
      form: this.$form.createForm(this)
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
    setFormValues ({...seal}) {
      this.id = seal.sealId
      let obj = {}
      Object.keys(seal).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = seal[key]
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$put('seal', {
            ...values,
            sealId: this.id
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

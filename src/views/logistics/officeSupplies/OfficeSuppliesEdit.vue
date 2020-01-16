<template>
  <a-drawer
    title="修改办公用品申请日期"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="officeSuppliesEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='申请日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='申请日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['createDate',
            {rules: [{ required: true, message: '申请日期不能为空'}]}
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
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'OfficeSuppliesEdit',
  props: {
    officeSuppliesEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      id: '',
      loading: false
    }
  },
  methods: {
    onClose () {
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues ({...officeSupplies}) {
      this.id = officeSupplies.id
      this.form.getFieldDecorator('createDate')
      this.form.setFieldsValue({'createDate': moment(officeSupplies.createDate)})
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$put('application', {
            createDate: values.createDate.format('YYYY-MM-DD'),
            id: this.id
          }).then((r) => {
            this.loading = false
            this.$emit('success')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

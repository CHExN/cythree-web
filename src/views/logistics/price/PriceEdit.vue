<template>
  <a-drawer
    title="修改物品价格"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="priceEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='物品名称' v-bind="formItemLayout">
        <a-input placeholder='物品名称'
                 autocomplete="off"
                 v-decorator="['name',
                  {rules: [
                    {pattern: '^[^^]+$', message: '不能包含 ^ 符号'},
                    {required: true, message: '不能为空'},
                    {max: 20, message: '长度不能超过20个字符'}
                  ]}]"/>
      </a-form-item>
      <a-form-item label='价格' v-bind="formItemLayout">
        <a-input-number class="card-area"
                 placeholder='单价'
                 autocomplete="off"
                 :min="0"
                 :precision="2"
                 :formatter="value => value"
                 v-decorator="['money',
                  {rules: [
                    {required: true, message: '不能为空'}
                  ]}]"/>
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
  name: 'PriceEdit',
  props: {
    priceEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      id: null
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.id = null
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setFormValues ({...price}) {
      let obj = {}
      Object.keys(price).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = price[key]
      })
      this.form.setFieldsValue(obj)
      this.id = price.id
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$put('price', {
            ...values,
            id: this.id
          }).then(() => {
            this.reset()
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

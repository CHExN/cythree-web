<template>
  <a-drawer
    title="新增固定办公用品选项"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="planStableAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='物品名称' v-bind="formItemLayout">
        <a-input
          autoFocus
          placeholder='物品名称'
          autocomplete="off"
          v-decorator="['name',
            {rules: [{ required: true, message: '物品名称不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='型号' v-bind="formItemLayout">
        <a-input
          placeholder='型号'
          autocomplete="off"
          v-decorator="['type']"/>
      </a-form-item>
      <a-form-item label='单位' v-bind="formItemLayout">
        <a-input
          placeholder='单位'
          autocomplete="off"
          v-decorator="['unit',
            {rules: [{ required: true, message: '单位不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-input
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark']"/>
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
  name: 'PlanStableAdd',
  props: {
    planStableAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$post('planStable', {
            ...values
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

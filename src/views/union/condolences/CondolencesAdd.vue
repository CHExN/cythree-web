<template>
  <a-drawer
    title="新增职工慰问"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="condolencesAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input
          placeholder='职工姓名'
          autocomplete="off"
          autoFocus
          v-decorator="['name',
          {rules: [{ required: true, message: '职工姓名不能为空'}]}
        ]"/>
      </a-form-item>
      <a-form-item label='性别' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['sexx',
            {rules: [{ required: true, message: '请选择性别' }]}
          ]">
          <a-radio-button value="1">男</a-radio-button>
          <a-radio-button value="2">女</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='年龄' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="100"
          :formatter="value => value"
          :parser="value => parseFloat(value) || 0"
          autocomplete="off"
          placeholder='年龄'
          style="width: 100%;"
          v-decorator="['age',
            {rules: [{ required: true, message: '年龄不能为空' }]}
          ]"/>
      </a-form-item>
      <a-form-item label='电话' v-bind="formItemLayout">
        <a-input
          placeholder='联系电话'
          autocomplete="off"
          v-decorator="['phone',
            {rules: [{ required: true, message: '联系电话不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='地址' v-bind="formItemLayout">
        <a-textarea
          auto-size
          placeholder='地址'
          autocomplete="off"
          v-decorator="['address',
            {rules: [{ required: true, message: '地址不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='情况说明' v-bind="formItemLayout">
        <a-textarea
          auto-size
          placeholder='疾病名称、病发时间、是否手术等'
          autocomplete="off"
          v-decorator="['text',
            {rules: [{ required: true, message: '情况说明不能为空'}]}
          ]"/>
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
  name: 'CondolencesAdd',
  props: {
    condolencesAddVisiable: {
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
          this.$post('condolences', {
            ...values
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
<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
</style>

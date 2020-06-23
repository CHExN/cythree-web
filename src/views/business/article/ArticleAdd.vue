<template>
  <a-drawer
    title="新增动态信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="articleAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='标题' v-bind="formItemLayout">
        <a-input
          placeholder='标题'
          autocomplete="off"
          v-decorator="['title',
          {rules: [{ required: true, message: '标题不能为空'}]}
        ]"
        />
      </a-form-item>
      <a-form-item label='内容' v-bind="formItemLayout">
        <a-textarea
          placeholder='内容'
          :auto-size="{ minRows: 30, maxRows: 500 }"
          autocomplete="off"
          v-decorator="['content']"
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
  name: 'ArticleAdd',
  props: {
    articleAddVisiable: {
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
      // 清空表单
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
          this.$post('news', {
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

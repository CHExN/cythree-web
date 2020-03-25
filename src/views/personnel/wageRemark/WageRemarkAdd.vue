<template>
  <a-drawer
    title="新增工资备注"
    :maskClosable="false"
    width=500
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wageRemarkAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='月份' v-bind="formItemLayout">
        <a-month-picker
          autoFocus
          placeholder='月份'
          style="width: 100%;"
          v-decorator="['yearMonth',
            {rules: [{ required: true, message: '月份不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='空列1' v-bind="formItemLayout">
        <a-input
          placeholder='空列1'
          autocomplete="off"
          v-decorator="['emptyColumn01']"/>
      </a-form-item>
      <a-form-item label='空列2' v-bind="formItemLayout">
        <a-input
          placeholder='空列2'
          autocomplete="off"
          v-decorator="['emptyColumn02']"/>
      </a-form-item>
      <a-form-item label='空列3' v-bind="formItemLayout">
        <a-input
          placeholder='空列3'
          autocomplete="off"
          v-decorator="['emptyColumn03']"/>
      </a-form-item>
      <a-form-item label='空列4' v-bind="formItemLayout">
        <a-input
          placeholder='空列4'
          autocomplete="off"
          v-decorator="['emptyColumn04']"/>
      </a-form-item>
      <a-form-item label='空列5' v-bind="formItemLayout">
        <a-input
          placeholder='空列5'
          autocomplete="off"
          v-decorator="['emptyColumn05']"/>
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
  name: 'WageRemarkAdd',
  props: {
    wageRemarkAddVisiable: {
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
          let yearMonth = values.yearMonth
          let emptyColumnArr = []
          for (let i = 1; i < 6; ++i) {
            emptyColumnArr.push(values[`emptyColumn0${i}`] || '')
          }
          this.$post('wageRemark', {
            remark: emptyColumnArr.join(),
            year: yearMonth.format('YYYY'),
            month: yearMonth.format('MM'),
            insideOrOutside: '0'
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

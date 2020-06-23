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
      <a-form-item label='年份' v-bind="formItemLayout">
        <a-input v-model="year" disabled/>
      </a-form-item>
      <a-form-item v-for="i in remarkCount" :key="i" :label="`空列${i}`" v-bind="formItemLayout">
        <a-input
          :placeholder="`空列${i}`"
          autocomplete="off"
          v-decorator="[`emptyColumn${$tools.zero(i)}`,
            {rules: [{pattern: '^[^,]+$', message: '不能包含 , 符号'}]}
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
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WageRemarkAdd',
  props: {
    wageRemarkAddVisiable: {
      default: false
    },
    insideOrOutside: {
      require: true
    },
    remarkCount: {
      require: true
    },
    year: {
      require: true
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
          let emptyColumnArr = []
          for (let i = 1; i <= this.remarkCount; ++i) {
            emptyColumnArr.push(values[`emptyColumn${this.$tools.zero(i)}`] || '')
          }
          let isTrue = true
          emptyColumnArr.forEach(entity => {
            if (entity) isTrue = false
          })
          if (isTrue) return this.$message.warning('请至少填写一项')
          this.$post('wageRemark', {
            year: this.year,
            remark: emptyColumnArr.join(),
            insideOrOutside: this.insideOrOutside
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

<template>
  <a-modal
    title="单位转换"
    centered
    @close="onClose"
    :maskClosable="false"
    :closable="false"
    :visible="unitConversionVisiable">
    <a-form :form="form">
      <a-form-item>
        <a-input
          :addonBefore="`${storeroom ? storeroom.unitOriginal : ''}`"
          placeholder="单位转换"
          autocomplete="off"
          v-decorator="['unit',
            {rules: [{ required: true, message: '转换的单位不能为空'}]}
          ]">
          <a-icon slot="prefix" type="arrow-right" />
          <a-tooltip slot="suffix" title="在这里填写想要转换的单位">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          :addonBefore="`1`"
          placeholder='数量转换'
          autocomplete="off"
          v-decorator="['amountConversion',
            {rules: [{ required: true, message: '转换的数量不能为空'}]}
          ]">
          <a-icon slot="prefix" type="arrow-right" />
          <a-tooltip slot="suffix" title="原先单位的一个，相当于现在的单位的多少个？">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      </a-form-item>
    </a-form>
    <template slot="footer">
      <!-- <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button>取消</a-button>
      </a-popconfirm> -->
      <a-button @click="onClose">取消</a-button>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </template >
  </a-modal>
</template>
<script>
export default {
  name: 'UnitConversion',
  props: {
    unitConversionVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      storeroom: null
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.storeroom = null
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...storeroom}) {
      this.storeroom = storeroom
      this.$get('unitConversion/' + storeroom.id).then((r) => {
        if (!r.data) return
        let obj = {}
        Object.keys(r.data).forEach((key) => {
          this.form.getFieldDecorator(key)
          obj[key] = r.data[key]
        })
        this.form.setFieldsValue(obj)
      })
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let unit = values.unit
          let amountConversion = Number(values.amountConversion)
          if (isNaN(amountConversion)) return this.$message.warning('转换的数量不是数字，请检查')
          this.loading = true
          this.$post('unitConversion', {
            unit,
            amountConversion,
            storeroomId: this.storeroom.id,
            amountOriginal: this.storeroom.amountOriginal,
            amountDist: this.storeroom.amountDist
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

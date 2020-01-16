<template>
  <a-drawer
    title="新增合同联审单"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="contractAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='合同名称' v-bind="formItemLayout">
        <a-input
          placeholder='合同名称'
          autocomplete="off"
          v-decorator="['contractName',{
            rules: [{ required: true, message: '合同名称不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='合同对方' v-bind="formItemLayout">
        <a-input
          placeholder='合同对方'
          autocomplete="off"
          v-decorator="['contractPartner']"
        />
      </a-form-item>
      <a-form-item label='经过招标否' v-bind="formItemLayout">
        <a-select
          placeholder='合同约定事项是否经过招标'
          :allowClear="true"
          v-decorator="['isTender', {
            rules: [{ required: true, message: '请选择' }]
          }]"
        >
          <a-select-option key="1">是</a-select-option>
          <a-select-option key="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='合同编号' v-bind="formItemLayout">
        <a-input
          placeholder='合同编号'
          autocomplete="off"
          v-decorator="['contractNum',{
            rules: [{ required: true, message: '合同编号不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='合同金额' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="99999999"
          :precision="2"
          :formatter="value => value"
          autocomplete="off"
          placeholder='合同金额'
          style="width: 100%;"
          v-decorator="['contractAmount',{
            rules: [{ required: true, message: '合同金额不能为空' }]
          }]"
        />
      </a-form-item>
      <a-form-item label='其他情况说明' v-bind="formItemLayout">
        <a-textarea
          placeholder='其他情况说明'
          autocomplete="off"
          v-decorator="['remark']"
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
  name: 'ContractAdd',
  props: {
    contractAddVisiable: {
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
          this.$post('contract', {
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

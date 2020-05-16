<template>
  <a-drawer
    title="新增公厕状态信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wcStatusEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='选择公厕' v-bind="formItemLayout">
        <a-input
          @click="selectWc"
          readOnly
          autoFocus
          placeholder='公厕'
          autocomplete="off"
          v-decorator="['wcName',
            {rules: [{ required: true, message: '请选择公厕'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='公厕状态' v-bind="formItemLayout">
        <a-input
          placeholder='公厕状态'
          autocomplete="off"
          v-decorator="['status',
            {rules: [{ required: true, message: '公厕状态不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='开始日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='开始日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['startDate',
            {rules: [{ required: true, message: '请选择开始日期'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='结束日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='结束日期（不填就是永远）'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['endDate']"
        />
      </a-form-item>
    </a-form>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
    <wc-list
      :wcListVisiable="wcList.visiable"
      @change="handleWcListChange"
      @close="handleWcListClose"
    >
    </wc-list>
  </a-drawer>
</template>
<script>
import moment from 'moment'
import WcList from '../wc/WCList'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WcStatusEdit',
  components: { WcList },
  props: {
    wcStatusEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      wcList: {
        visiable: false
      },
      wcId: '',
      wcStatusId: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...wcStatus}) {
      this.wcStatusId = wcStatus.id
      let obj = {}
      Object.keys(wcStatus).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = wcStatus[key]
      })
      // 把时间类型插件的数据用moment包装一下
      obj['startDate'] = moment(obj['startDate'])
      obj['endDate'] = moment(obj['endDate'])
      this.form.setFieldsValue(obj)
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleWcListChange (wcName, wcNum, wcId) {
      this.form.getFieldDecorator('wcName')
      this.form.setFieldsValue({ 'wcName': wcName })
      this.wcId = wcId
    },
    handleWcListClose () {
      this.wcList.visiable = false
    },
    selectWc () {
      this.wcList.visiable = true
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const startDate = values['startDate'].format('YYYY-MM-DD')
          const endDate = values['endDate'].format('YYYY-MM-DD')
          const wcStatusData = {
            ...values,
            startDate,
            endDate,
            wcId: this.wcId,
            id: this.wcStatusId
          }
          this.loading = true
          this.$put('wcStatus', {
            ...wcStatusData
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

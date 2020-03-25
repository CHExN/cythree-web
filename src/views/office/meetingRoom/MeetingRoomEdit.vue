<template>
  <a-drawer
    title="修改预约"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="meetingRoomEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='申请日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='申请日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          :disabledDate="disabledDate"
          v-decorator="['dateFrom',{
            rules: [{ required: true, message: '申请日期不能为空'}]
          }]"
        />
      </a-form-item>
      <a-form-item label='开始时间' v-bind="formItemLayout">
        <a-input
          placeholder='开始时间'
          autocomplete="off"
          v-decorator="['timeFrom',
            {rules: [
              {pattern: '^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$', message: '请以24小时制的00:00的格式填写'},
              {required: true, message: '开始时间不能为空'}
            ]}
          ]"/>
      </a-form-item>
      <a-form-item label='结束时间' v-bind="formItemLayout">
        <a-input
          placeholder='结束时间'
          autocomplete="off"
          v-decorator="['timeTo',
            {rules: [
              {pattern: '^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$', message: '请以24小时制的00:00的格式填写'},
              {required: true, message: '结束时间不能为空'}
            ]}
          ]"/>
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark',
            {rules: [{required: true, message: '备注不能为空'}]}
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
  name: 'MeetingRoomEdit',
  props: {
    meetingRoomEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      id: undefined,
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
    disabledDate (current) {
      // Can not select days before today and today
      return current && current < moment().startOf('day')
    },
    setFormValues ({...meetingRoom}) {
      this.id = meetingRoom.id
      let obj = {}
      Object.keys(meetingRoom).forEach((key) => {
        this.form.getFieldDecorator(key)
        if (key === 'dateFrom') {
          obj[key] = moment(meetingRoom[key])
        } else if (key === 'timeFrom' || key === 'timeTo') {
          obj[key] = meetingRoom[key].substr(0, 5)
        } else {
          obj[key] = meetingRoom[key]
        }
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const dateFrom = values['dateFrom']
          const data = {
            ...values,
            'dateFrom': dateFrom ? dateFrom.format('YYYY-MM-DD') : dateFrom
          }
          this.loading = true
          this.$put('meetingRoom', {
            ...data,
            'id': this.id
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

<template>
  <a-drawer
    title="修改公厕状态信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wcStatusEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='公厕名称' v-bind="formItemLayout">
        <a-input
          disabled
          autocomplete="off"
          v-decorator="['wcName',
            {rules: [{ required: true, message: '请填写正确的公厕编号，已此验证公厕信息'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='编号后四' v-bind="formItemLayout">
        <a-input-search
          autoFocus
          @search="selectIdNum"
          @change="handleIdNumChange"
          placeholder='公厕编号后四位'
          autocomplete="off"
          v-decorator="['wcNum',
            {rules: [{ required: true, message: '请填写公厕编号后四位'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='是否重点位置' v-bind="formItemLayout">
        <a-radio-group v-decorator="['isFocus']">
          <a-radio-button value="1">
            是重点位置
          </a-radio-button>
          <a-radio-button value="0">
            非重点位置
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='关门日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='粪井满冒/关门日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['startDate',
            {rules: [{ required: true, message: '请选择粪井满冒/关门日期'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='是否关门' v-bind="formItemLayout">
        <a-radio-group v-decorator="['isOpen']">
          <a-radio-button value="1">
            开门
          </a-radio-button>
          <a-radio-button value="0">
            关门
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='关门原因' v-bind="formItemLayout">
        <a-input
          placeholder='关门原因（不填，默认“井满”）'
          autocomplete="off"
          v-decorator="['status']"
        />
      </a-form-item>
      <a-form-item label='是否通知三场' v-bind="formItemLayout">
        <a-radio-group v-decorator="['isNotice']">
          <a-radio-button value="1">
            通知
          </a-radio-button>
          <a-radio-button value="0">
            不通知
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='通知日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='通知日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['noticeDate']"
        />
      </a-form-item>
      <a-form-item label='开门日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='三场抽运/开门日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['endDate']"
        />
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
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
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'WcStatusEdit',
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
      let forbids = ['createTime', 'modifyTime']
      let obj = {}
      Object.keys(wcStatus).forEach((key) => {
        if (forbids.indexOf(key) === -1) {
          this.form.getFieldDecorator(key)
          obj[key] = wcStatus[key]
        }
      })
      // 把时间类型插件的数据用moment包装一下
      obj['startDate'] = moment(obj['startDate'])
      obj['noticeDate'] = obj['noticeDate'] ? moment(obj['noticeDate']) : null
      obj['endDate'] = obj['endDate'] ? moment(obj['endDate']) : null
      this.form.setFieldsValue(obj)
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    selectIdNum (value) {
      if (!value) return this.$message.warning('请填写公厕编号')
      this.$message.loading('查询此公厕编号中...', 0)
      this.$get('wc/getWcByWcNum', {
        wcNum: value,
        isLastFour: true
      }).then((r) => {
        this.$message.destroy()
        if (r.data) {
          this.$message.success(`查询成功，公厕名为 [${r.data.wcName}]`)
          this.form.getFieldDecorator('wcName')
          this.form.setFieldsValue({ wcName: r.data.wcName })
          this.wcId = r.data.wcId
        } else {
          this.$message.warning('查询失败，未查找到此后四位公厕编号信息')
        }
      })
    },
    handleIdNumChange () {
      this.form.getFieldDecorator('wcName')
      this.form.setFieldsValue({ wcName: '' })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const startDate = values['startDate'].format('YYYY-MM-DD')
          const noticeDate = values['noticeDate'] ? values['noticeDate'].format('YYYY-MM-DD') : null
          const endDate = values['endDate'] ? values['endDate'].format('YYYY-MM-DD') : null
          const wcStatusData = {
            ...values,
            startDate,
            noticeDate,
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

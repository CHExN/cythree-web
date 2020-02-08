<template>
  <a-drawer
    title="修改编内合同"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="contractInsideEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input-search
          v-if="staffId"
          @click="selectName"
          @search="untied"
          readOnly
          placeholder='姓名'
          autocomplete="off"
          v-decorator="['name']">
          <a-button slot="enterButton">解绑</a-button>
        </a-input-search>
        <a-input
          v-else
          @click="selectName"
          readOnly
          autoFocus
          placeholder='姓名'
          autocomplete="off"
          v-decorator="['name']"/>
      </a-form-item>
      <a-form-item label='档案编号' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='档案编号'
          :dataSource="fileNumData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['fileNum']"
        />
      </a-form-item>
      <a-form-item label='胸牌号码' v-bind="formItemLayout">
        <a-input
          placeholder='胸牌号码'
          autocomplete="off"
          v-decorator="['badNum']"
        />
      </a-form-item>
      <a-form-item label='无固定期' v-bind="formItemLayout">
        <a-textarea
          placeholder='无固定期'
          autocomplete="off"
          v-decorator="['isFixedPeriod']"
        />
      </a-form-item>
      <a-form-item label='劳始日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='劳动合同起始日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['contractLaborStart']"
        />
      </a-form-item>
      <a-form-item label='劳止日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='劳动合同结束日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['contractLaborEnd']"
        />
      </a-form-item>
      <a-form-item label='岗始日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='岗位协议起始日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['jobAgreementStart']"
        />
      </a-form-item>
      <a-form-item label='岗止日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='岗位协议结束日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['jobAgreementEnd']"
        />
      </a-form-item>
      <a-form-item label='续签备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='续签备注'
          autocomplete="off"
          v-decorator="['remarkRenew']"
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
    <staff-inside-list
      :staffInsideListVisiable="staffInsideList.visiable"
      lowCause="123123"
      @change="handleStaffInsideListChange"
      @close="handleStaffInsideListClose"
    >
    </staff-inside-list>
  </a-drawer>
</template>
<script>
import StaffInsideList from '../staffInside/StaffInsideList'
import moment from 'moment'
moment.locale('zh-cn')

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'ContractInsideEdit',
  components: { StaffInsideList },
  props: {
    contractInsideEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      id: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffInsideList: {
        visiable: false
      },
      staffId: '',
      fileNumData: ['编内合同制', '编内固定工']
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
    untied () {
      this.loading = true
      this.$put('contractInside', {
        id: this.id,
        staffId: 0
      }).then((r) => {
        this.loading = false
        this.$message.success('解除绑定成功')
        this.staffId = ''
        this.form.getFieldDecorator('name')
        this.form.setFieldsValue({name: ''})
        this.$emit('untied')
      })
    },
    selectName () {
      this.staffInsideList.visiable = true
    },
    handleStaffInsideListChange (name, staffId) {
      this.form.getFieldDecorator('name')
      this.form.setFieldsValue({ name: name })
      this.staffId = staffId
      console.log(this.staffId)
    },
    handleStaffInsideListClose () {
      this.staffInsideList.visiable = false
    },
    setFormValues ({...contractInside}) {
      this.id = contractInside.id
      const fields = ['contractLaborStart', 'contractLaborEnd', 'jobAgreementStart', 'jobAgreementEnd']
      let obj = {}
      Object.keys(contractInside).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = contractInside[key]
      })
      // 把时间类型插件的数据用moment包装一下
      fields.forEach((item) => {
        if (obj[item]) { obj[item] = moment(obj[item]) }
      })
      this.staffId = contractInside.staffId
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const contractLaborStart = values['contractLaborStart']
          const contractLaborEnd = values['contractLaborEnd']
          const jobAgreementStart = values['jobAgreementStart']
          const jobAgreementEnd = values['jobAgreementEnd']
          const contractInsideData = {
            id: this.id,
            staffId: this.staffId,
            ...values,
            contractLaborStart: contractLaborStart ? contractLaborStart.format('YYYY-MM-DD') : contractLaborStart,
            contractLaborEnd: contractLaborEnd ? contractLaborEnd.format('YYYY-MM-DD') : contractLaborEnd,
            jobAgreementStart: jobAgreementStart ? jobAgreementStart.format('YYYY-MM-DD') : jobAgreementStart,
            jobAgreementEnd: jobAgreementEnd ? jobAgreementEnd.format('YYYY-MM-DD') : jobAgreementEnd
          }
          this.loading = true
          this.$put('contractInside', {
            ...contractInsideData
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
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    }
  }
}
</script>

<template>
  <a-drawer
    title="修改编外合同"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="contractOutsideEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='身份证号' v-bind="formItemLayout">
        <a-input
          placeholder='身份证号'
          autocomplete="off"
          v-decorator="['idNum']"
        />
      </a-form-item>
      <a-form-item
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        :label="index === 0 ? '合同期' : ''"
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
        :required="false"
      >
        <a-input
          placeholder='合同期'
          style="width: 90%; margin-right: 8px"
          autocomplete="off"
          v-decorator="[`names[${k}]`,
            {rules: [{ required: true, message: '合同期不能为空'}]}
          ]"
        />
        <a-range-picker
          :allowClear="false"
          style="width: 90%; margin-right: 8px"
          v-decorator="[`namess[${k}]`,
            {rules: [{ required: true, message: '日期选择不能为空'}]}
          ]"
        />
        <a-icon
          v-if="form.getFieldValue('keys').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="form.getFieldValue('keys').length === 1"
          @click="() => remove(k)"
        />
      </a-form-item>
      <a-form-item v-bind="formItemLayoutWithOutLabel">
        <a-button type="dashed" style="width: 60%" @click="add">
          <a-icon type="plus" /> 添加合同期
        </a-button>
      </a-form-item>

      <!-- 暂时注释 -->
      <!-- <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input-search
          v-if="idNum"
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
      </a-form-item> -->
      <a-form-item label='无固定期备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='无固定期备注'
          autocomplete="off"
          v-decorator="['remarkOnFixedPeriod']"
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
    <!-- <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      temporary="123123"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list> -->
  </a-drawer>
</template>
<script>
// import StaffOutsideList from '../staffOutside/StaffOutsideList'
import moment from 'moment'
moment.locale('zh-cn')
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 17, offset: 0 },
    sm: { span: 17, offset: 4 }
  }
}
let id = 0
export default {
  name: 'ContractOutsideEdit',
  // components: { StaffOutsideList },
  props: {
    contractOutsideEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      id: '',
      loading: false,
      formItemLayout,
      formItemLayoutWithOutLabel,
      form: this.$form.createForm(this),
      // staffOutsideList: {
      //   visiable: false
      // },
      fileNumData: ['编外合同制', '编外固定工']
    }
  },
  created () {
    this.form = this.$form.createForm(this, { name: 'dynamic_form_item' })
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  methods: {
    remove (k) {
      const { form } = this
      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    add () {
      const { form } = this
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    reset () {
      this.loading = false
      id = 0
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    // untied () {
    //   this.loading = true
    //   this.$put('contractOutside', {
    //     id: this.id,
    //     idNum: 0
    //   }).then((r) => {
    //     this.loading = false
    //     this.$message.success('解除绑定成功')
    //     this.idNum = ''
    //     this.form.getFieldDecorator('name')
    //     this.form.setFieldsValue({name: ''})
    //     this.$emit('untied')
    //   })
    // },
    // selectName () {
    //   this.staffOutsideList.visiable = true
    // },
    // handleStaffOutsideListChange (name, idNum) {
    //   console.log(idNum)
    //   this.form.getFieldDecorator('name')
    //   this.form.setFieldsValue({ name: name })
    //   this.idNum = idNum
    // },
    // handleStaffOutsideListClose () {
    //   this.staffOutsideList.visiable = false
    // },
    setFormValues ({...contractOutside}) {
      this.id = contractOutside.id
      let obj = {}
      Object.keys(contractOutside).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = contractOutside[key]
      })
      let contractPeriodArr = contractOutside.contractPeriod.split(',')
      let contractPeriodDateArr = contractOutside.contractPeriodDate.split(',')
      obj['keys'] = []
      obj['names'] = []
      obj['namess'] = []
      contractPeriodDateArr.forEach((element, index) => {
        this.form.getFieldDecorator(`names[${index}]`)
        this.form.getFieldDecorator(`namess[${index}]`)
        obj['keys'] = obj['keys'].concat(id++)
        obj['names'].push(contractPeriodArr[index])
        obj['namess'].push(element.split('~').map(e => moment(e)))
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let contractPeriodArr = this.form.getFieldValue('names').filter(d => d)
          let contractPeriodDateArr = []
          this.form.getFieldValue('namess').forEach(element => {
            contractPeriodDateArr.push(`${element[0].format('YYYY-MM-DD')}~${element[1].format('YYYY-MM-DD')}`)
          })
          this.loading = true
          this.$put('contractOutside', {
            id: this.id,
            ...values,
            contractPeriod: contractPeriodArr.join(),
            contractPeriodDate: contractPeriodDateArr.join()
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

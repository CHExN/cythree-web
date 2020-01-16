<template>
  <a-drawer
    title="修改人员休假"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="vacationEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='编制类别' v-bind="formItemLayout">
        <a-radio-group v-decorator="['insOut',
          {rules: [{ required: true, message: '请选择编制类别' }]}
        ]">
          <a-radio-button value="0">编内</a-radio-button>
          <a-radio-button value="1">编外</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='选择人员' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          placeholder='人员'
          autocomplete="off"
          v-decorator="['name',
            {rules: [{ required: true, message: '请选择人员'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='休假类型' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='休假类型'
          :dataSource="typeData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['type',
            {rules: [{ required: true, message: '休假类型不能为空'}]}
          ]"
        />
      </a-form-item>
      <!-- <a-form-item label='天数' v-bind="formItemLayout">
        <a-input-number
          autocomplete="off"
          placeholder='天数'
          style="width: 100%;"
          v-decorator="['day']"/>
      </a-form-item> -->
      <a-form-item
        v-for="(k, index) in form.getFieldValue('keys')"
        :key="k"
        :label="index === 0 ? '日期选择' : ''"
        v-bind="index === 0 ? formItemLayout : formItemLayoutWithOutLabel"
        :required="false"
      >
        <a-range-picker
          :allowClear="false"
          style="width: 90%; margin-right: 8px"
          v-decorator="[`names[${k}]`,
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
          <a-icon type="plus" /> 添加日期选择
        </a-button>
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark',
            {rules: [{ required: true, message: '备注不能为空'}]}
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
    <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list>
    <staff-inside-list
      :staffInsideListVisiable="staffInsideList.visiable"
      @change="handleStaffInsideListChange"
      @close="handleStaffInsideListClose"
    >
    </staff-inside-list>
  </a-drawer>
</template>
<script>
import StaffOutsideList from '../staffOutside/StaffOutsideList'
import StaffInsideList from '../staffInside/StaffInsideList'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
let id = 0
export default {
  name: 'VacationEdit',
  components: { StaffOutsideList, StaffInsideList },
  props: {
    vacationEditVisiable: {
      default: false
    },
    typeData: {
      require: true
    }
  },
  data () {
    return {
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 17, offset: 0 },
          sm: { span: 17, offset: 4 }
        }
      },
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffOutsideList: {
        visiable: false
      },
      staffInsideList: {
        visiable: false
      },
      staffId: '',
      id: ''
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
      // 清空表单
      this.form.resetFields()
    },
    setFormValues ({...vacation}) {
      this.id = vacation.id
      let obj = {}
      Object.keys(vacation).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = vacation[key]
      })
      let dateArr = vacation.date.split(',')
      id = 0
      obj['keys'] = []
      obj['names'] = []
      dateArr.forEach((element, index) => {
        this.form.getFieldDecorator(`names[${index}]`)
        obj['keys'] = obj['keys'].concat(id++)
        obj['names'].push(element.split('~').map(e => moment(e)))
      })
      this.form.setFieldsValue(obj)
    },
    selectName () {
      let insOut = this.form.getFieldValue('insOut')
      if (insOut === '0') {
        this.staffInsideList.visiable = true
      } else if (insOut === '1') {
        this.staffOutsideList.visiable = true
      } else {
        this.$message.warning('请先选择编制类别')
      }
    },
    handleStaffInsideListChange (name, staffId) {
      this.form.getFieldDecorator('name')
      this.form.setFieldsValue({ name: name })
      this.staffId = staffId
    },
    handleStaffInsideListClose () {
      this.staffInsideList.visiable = false
    },
    handleStaffOutsideListChange (name, staffId) {
      this.form.getFieldDecorator('name')
      this.form.setFieldsValue({ name: name })
      this.staffId = staffId
    },
    handleStaffOutsideListClose () {
      this.staffOutsideList.visiable = false
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let day = 0
          let dateArr = []
          this.form.getFieldValue('names').forEach(element => {
            day = day + element[1].diff(element[0], 'days') + 1
            dateArr.push(`${element[0].format('YYYY-MM-DD')}~${element[1].format('YYYY-MM-DD')}`)
          })
          const vacationData = {
            ...values,
            id: this.id,
            staffId: this.staffId,
            date: dateArr.join(),
            day
          }
          this.loading = true
          this.$put('vacation', {
            ...vacationData
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

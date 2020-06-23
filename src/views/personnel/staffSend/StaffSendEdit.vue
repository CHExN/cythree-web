<template>
  <a-drawer
    title="修改劳务派遣人员"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="staffSendEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='在职与否' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['isLeave',
            {rules: [{ required: true, message: '请选择人员状态'}]}
          ]">
          <a-radio-button value="0">在职</a-radio-button>
          <a-radio-button value="1">非在职</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.getFieldValue('isLeave')==='1'" label='减少日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='减少日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['leaveDate',{
            rules: [{required: true, message: '减少日期不能为空'}]
          }]"
        />
      </a-form-item>
       <a-form-item label='增加日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='增加日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['addDate',{
            rules: [{required: true, message: '增加日期不能为空'}]
          }]"
        />
      </a-form-item>
      <a-form-item label='姓名' v-bind="formItemLayout">
        <a-input
          placeholder='姓名'
          autocomplete="off"
          v-decorator="['name',
            {rules: [{ required: true, message: '姓名不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='身份证号' v-bind="formItemLayout">
        <a-input
          placeholder='身份证号'
          autocomplete="off"
          @blur="onIdNumChange"
          v-decorator="['idNum',{rules: [
            {required: true, message: '身份证号不能为空'},
          ]}]"/>
      </a-form-item>
      <a-form-item label='籍贯' v-bind="formItemLayout">
        <a-input
          placeholder='籍贯'
          autocomplete="off"
          v-decorator="['birthplace']"/>
      </a-form-item>
      <a-form-item label='性别' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['gender']">
          <a-radio-button value="0">女</a-radio-button>
          <a-radio-button value="1">男</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='出生年月' v-bind="formItemLayout">
        <a-date-picker
          placeholder='出生年月'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['birthDate']"
        />
      </a-form-item>
      <a-form-item label='手机电话' v-bind="formItemLayout">
        <a-input
          placeholder='手机电话'
          autocomplete="off"
          v-decorator="['phoneCell']"/>
      </a-form-item>
      <a-form-item label='学历' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='现学历'
          :dataSource="cultureData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['culture']"
        />
      </a-form-item>
      <a-form-item label='调入日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='调入或报到日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['transferDate']"
        />
      </a-form-item>
      <a-form-item label='银行卡号' v-bind="formItemLayout">
        <a-input
          placeholder='银行卡号'
          autocomplete="off"
          v-decorator="['bankCardNumber']"/>
      </a-form-item>
      <a-form-item label='卡归属' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='银行卡归属'
          :dataSource="bankCardAttributionData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['bankCardAttribution']"
        />
      </a-form-item>
      <a-form-item label='公司' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='公司'
          :dataSource="companyData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['company']"
        />
      </a-form-item>
      <a-form-item label='备注' v-bind="formItemLayout">
        <a-textarea
          placeholder='备注'
          autocomplete="off"
          v-decorator="['remark']"
        />
      </a-form-item>
      <!-- <a-form-item label='排序编号' v-bind="formItemLayout">
        <a-input-number
          placeholder='排序编号'
          autocomplete="off"
          style="width: 100%;"
          v-decorator="['sortNum']"
        />
      </a-form-item> -->
      <a-form-item label='排序编号' v-bind="formItemLayout">
        <a-input-number
          placeholder='会插入到排列顺序当中，不填写默认排最后'
          autocomplete="off"
          style="width: 100%;"
          v-decorator="['sortNum']"
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
import DeptInputTree from '../../system/dept/DeptInputTree'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'StaffSendEdit',
  components: { DeptInputTree },
  props: {
    staffSendEditVisiable: {
      default: false
    },
    bankCardAttributionData: {
      require: true
    },
    companyData: {
      require: true
    }
  },
  data () {
    return {
      staffId: '',
      sortNum: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      cultureData: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士']
    }
  },
  methods: {
    reset () {
      this.loading = false
      // 清空表单
      this.form.resetFields()
    },
    onIdNumChange () {
      const idNum = this.form.getFieldValue('idNum')
      const birthDate = moment(this.$tools.getBirthday(idNum))
      const birthplace = this.$tools.getBirthplace(idNum)
      const gender = this.$tools.getGender(idNum)

      this.form.getFieldDecorator('birthDate')
      this.form.getFieldDecorator('birthplace')
      this.form.getFieldDecorator('gender')

      this.form.setFieldsValue({ birthDate })
      this.form.setFieldsValue({ birthplace })
      this.form.setFieldsValue({ gender: gender + '' })
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setFormValues ({...staffSend}) {
      this.staffId = staffSend.staffId
      this.sortNum = staffSend.sortNum
      const fields = ['addDate', 'leaveDate', 'birthDate', 'transferDate']
      const excludes = ['sortNum']
      let obj = {}
      Object.keys(staffSend).forEach((key) => {
        if (excludes.includes(key)) return
        this.form.getFieldDecorator(key)
        obj[key] = staffSend[key]
      })
      // 把时间类型插件的数据用moment包装一下
      fields.forEach((item) => {
        if (obj[item]) { obj[item] = moment(obj[item]) }
      })
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const {addDate, leaveDate, birthDate, transferDate} = values
          const staffSendData = {
            staffId: this.staffId,
            ...values,
            addDate: addDate ? addDate.format('YYYY-MM-DD') : addDate,
            leaveDate: leaveDate ? leaveDate.format('YYYY-MM-DD') : leaveDate,
            birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : birthDate,
            transferDate: transferDate ? transferDate.format('YYYY-MM-DD') : transferDate
          }
          this.loading = true
          this.$put('staffSend', {
            ...staffSendData
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

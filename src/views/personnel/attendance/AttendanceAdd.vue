<template>
  <a-drawer
    title="新增考勤信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="attendanceAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='选择人员' v-bind="formItemLayout">
        <a-input
          @click="selectName"
          readOnly
          autoFocus
          placeholder='人员'
          autocomplete="off"
          v-decorator="['staffName',
            {rules: [{ required: true, message: '请选择人员'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='开始日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='开始日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['startDate',
            {rules: [{ required: true, message: '开始日期不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='结束日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='结束日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['endDate',
            {rules: [{ required: true, message: '结束日期不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='日勤' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='日勤'
          v-decorator="['dayWork',{
            initialValue: 0,
            rules: [{ required: true, message: '日勤不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='夜勤' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='夜勤'
          v-decorator="['nightWork',{
            initialValue: 0,
            rules: [{ required: true, message: '夜勤不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='双加' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='双加'
          v-decorator="['doublePlus',{
            initialValue: 0,
            rules: [{ required: true, message: '双加不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='节加' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='节加'
          v-decorator="['holidayPlus',{
            initialValue: 0,
            rules: [{ required: true, message: '节加不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='1.5倍' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='1.5倍小时加班'
          v-decorator="['hour15',{
            initialValue: 0,
            rules: [{ required: true, message: '1.5倍小时加班不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='2倍' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='2倍小时加班'
          v-decorator="['hour20',{
            initialValue: 0,
            rules: [{ required: true, message: '2倍小时加班不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='公休' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='公休'
          v-decorator="['publicHoliday',{
            initialValue: 0,
            rules: [{ required: true, message: '公休不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='工龄假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='工龄假'
          v-decorator="['workingLeave',{
            initialValue: 0,
            rules: [{ required: true, message: '工龄假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='病假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='病假'
          v-decorator="['sickLeave',{
            initialValue: 0,
            rules: [{ required: true, message: '病假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='事假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='事假'
          v-decorator="['thingLeave',{
            initialValue: 0,
            rules: [{ required: true, message: '事假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='婚假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='婚假'
          v-decorator="['marriageLeave',{
            initialValue: 0,
            rules: [{ required: true, message: '婚假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='丧假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='丧假'
          v-decorator="['funeralLeave',{
            initialValue: 0,
            rules: [{ required: true, message: '丧假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='工伤假' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='工伤假'
          v-decorator="['workInjury',{
            initialValue: 0,
            rules: [{ required: true, message: '工伤假不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='迟到早退' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='迟到早退折合天数'
          v-decorator="['lateAndLeaveEarly',{
            initialValue: 0,
            rules: [{ required: true, message: '迟到早退折合天数不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='平时值班' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='平时值班'
          v-decorator="['usuallyDuty',{
            initialValue: 0,
            rules: [{ required: true, message: '平时值班不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='周末值班' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='周末值班'
          v-decorator="['weekendDuty',{
            initialValue: 0,
            rules: [{ required: true, message: '周末值班不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='节日值班' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='节日值班'
          v-decorator="['holidayWatch',{
            initialValue: 0,
            rules: [{ required: true, message: '节日值班不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='扣分' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='扣分'
          v-decorator="['deduction',{
            initialValue: 0,
            rules: [{ required: true, message: '扣分不能为空'}]
          }]"/>
      </a-form-item>
      <a-form-item label='总计' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="31"
          style="width: 100%;"
          placeholder='总计(出勤天数)'
          v-decorator="['totalAttendanceDays',{
            initialValue: 0,
            rules: [{ required: true, message: '总计(出勤天数)不能为空'}]
          }]"/>
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
    <staff-outside-list
      :staffOutsideListVisiable="staffOutsideList.visiable"
      @change="handleStaffOutsideListChange"
      @close="handleStaffOutsideListClose"
    >
    </staff-outside-list>
  </a-drawer>
</template>
<script>
import StaffOutsideList from '../staffOutside/StaffOutsideList'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'AttendanceAdd',
  components: { StaffOutsideList },
  props: {
    attendanceAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      staffOutsideList: {
        visiable: false
      },
      staffId: ''
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.staffId = ''
      // 清空表单
      this.form.resetFields()
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    selectName () {
      this.staffOutsideList.visiable = true
    },
    handleStaffOutsideListChange (staffName, staffId) {
      this.form.getFieldDecorator('staffName')
      this.form.setFieldsValue({ staffName: staffName })
      this.staffId = staffId
    },
    handleStaffOutsideListClose () {
      this.staffOutsideList.visiable = false
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$post('attendance', {
            ...values,
            staffId: this.staffId
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

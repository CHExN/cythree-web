<template>
  <a-drawer
    title="修改编外人员"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="staffOutsideEditVisiable"
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
      <a-form-item v-if="form.getFieldValue('isLeave')==='1'" label='非在职日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='[减少]日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['leaveDate',{
            rules: [{required: true, message: '[减少]日期不能为空'}]
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
      <a-form-item label='户籍性质' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['householdRegistrationType']">
          <a-radio-button value="0">外地农业</a-radio-button>
          <a-radio-button value="1">外地非农业</a-radio-button>
          <a-radio-button value="2">本地农业</a-radio-button>
          <a-radio-button value="3">本地非农业</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='人员类型' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='人员类型'
          :dataSource="temporaryData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['temporary']"
        />
      </a-form-item>
      <a-form-item label='分队' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='分队'
          :dataSource="teamData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['team']"
        />
      </a-form-item>
      <!-- <a-form-item label='所管理部门' v-bind="formItemLayout">
        <a-select
          v-decorator="['type']">
          <a-select-option v-for="i in typeData" :key="i.key">{{ i.value }}</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item label='所管理部门' v-bind="formItemLayout">
        <a-radio-group v-decorator="['type']">
          <a-radio-button value="0">劳资</a-radio-button>
          <a-radio-button value="1">北分队</a-radio-button>
          <a-radio-button value="2">南分队</a-radio-button>
          <a-radio-button value="3">保洁分队</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='事由' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='事由'
          :dataSource="causeData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['cause']"
        />
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
      <a-form-item label='民族' v-bind="formItemLayout">
        <a-input
          placeholder='民族'
          autocomplete="off"
          v-decorator="['clan']"/>
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
      <!-- <a-form-item label='年龄' v-bind="formItemLayout">
        <a-input-number
          :min="0"
          :max="200"
          autocomplete="off"
          placeholder='年龄'
          style="width: 100%;"
          v-decorator="['age']"/>
      </a-form-item> -->
      <!-- <a-form-item label='退休年份' v-bind="formItemLayout">
        <a-input
          placeholder='退休年份'
          autocomplete="off"
          v-decorator="['retirementYear']"/>
      </a-form-item> -->
      <a-form-item label='家庭住址' v-bind="formItemLayout">
        <a-textarea
          placeholder='家庭住址'
          autocomplete="off"
          v-decorator="['address']"
        />
      </a-form-item>
      <a-form-item label='座机联系电话' v-bind="formItemLayout">
        <a-input
          placeholder='座机电话'
          autocomplete="off"
          v-decorator="['phoneLandLine']"/>
      </a-form-item>
      <a-form-item label='手机联系电话' v-bind="formItemLayout">
        <a-input
          placeholder='手机电话'
          autocomplete="off"
          v-decorator="['phoneCell']"/>
      </a-form-item>
      <a-form-item label='学历' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='原学历'
          :dataSource="cultureData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['culture']"
        />
      </a-form-item>
      <a-form-item label='政治面貌' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='政治面貌'
          :dataSource="politicalFaceData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['politicalFace']"
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
      <a-form-item label='到本场队日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='到本场队日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['toTeamDate']"
        />
      </a-form-item>
      <a-form-item label='岗位' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='岗位'
          :dataSource="postData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['post']"
        />
      </a-form-item>
      <a-form-item label='现任岗位职务' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='现任岗位职务'
          :dataSource="technicalTypeData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['technicalType']"
        />
      </a-form-item>
      <!-- <a-form-item label='排序序号1' v-bind="formItemLayout">
        <a-input-number
          placeholder='排序序号1会排列总数居'
          autocomplete="off"
          style="width: 100%;"
          v-decorator="['sortNum1']"
        />
      </a-form-item> -->
      <a-form-item label='分队序号' v-bind="formItemLayout">
        <a-input-number
          :placeholder="'填写序号会插入到相应的位置上，不填写不变，当前序号：' + sortNum2"
          autocomplete="off"
          style="width: 100%;"
          v-decorator="['sortNum2']"
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
import DeptInputTree from '../../system/dept/DeptInputTree'
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17 }
}
export default {
  name: 'StaffOutsideEdit',
  components: { DeptInputTree },
  props: {
    staffOutsideEditVisiable: {
      default: false
    },
    technicalTypeData: {
      require: true
    },
    postData: {
      require: true
    },
    teamData: {
      require: true
    }
  },
  data () {
    return {
      staffId: '',
      sortNum2: '',
      deptId: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      temporaryData: ['临时合同工'],
      causeData: ['在册', '增加', '解除', '调离', '终止', '退休', '亡故'],
      cultureData: ['小学', '初中', '高中', '专科', '本科', '硕士', '博士'],
      politicalFaceData: ['群众', '团员', '党员', '预备党员']
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
      // const age = this.$tools.getAge(birthDate)
      const birthplace = this.$tools.getBirthplace(idNum)
      const gender = this.$tools.getGender(idNum)
      // const retirementYear = this.$tools.getRetirement(birthDate, gender) // 退休年份

      this.form.getFieldDecorator('birthDate')
      // this.form.getFieldDecorator('age')
      this.form.getFieldDecorator('birthplace')
      this.form.getFieldDecorator('gender')
      // this.form.getFieldDecorator('retirementYear')

      this.form.setFieldsValue({ birthDate })
      // this.form.setFieldsValue({ age })
      this.form.setFieldsValue({ birthplace })
      this.form.setFieldsValue({ gender: gender + '' })
      // this.form.setFieldsValue({ retirementYear })
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setFormValues ({...staffOutside}) {
      this.staffId = staffOutside.staffId
      this.sortNum2 = staffOutside.sortNum2
      const fields = ['leaveDate', 'birthDate', 'transferDate', 'toTeamDate']
      const excludes = ['sortNum1', 'sortNum2']
      let obj = {}
      Object.keys(staffOutside).forEach((key) => {
        if (excludes.includes(key)) return
        this.form.getFieldDecorator(key)
        obj[key] = staffOutside[key]
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
          const {leaveDate, birthDate, transferDate, toTeamDate} = values
          const staffOutsideData = {
            staffId: this.staffId,
            ...values,
            leaveDate: leaveDate ? leaveDate.format('YYYY-MM-DD') : leaveDate,
            birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : birthDate,
            transferDate: transferDate ? transferDate.format('YYYY-MM-DD') : transferDate,
            toTeamDate: toTeamDate ? toTeamDate.format('YYYY-MM-DD') : toTeamDate
          }
          this.loading = true
          this.$put('staffOutside', {
            ...staffOutsideData
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

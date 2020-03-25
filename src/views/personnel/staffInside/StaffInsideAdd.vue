<template>
  <a-drawer
    title="新增编内人员"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="staffInsideAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
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
        <a-radio-group
          v-decorator="['type',
            {rules: [{ required: true, message: '请选择人员类型'}]}
          ]">
          <a-radio-button value="0">固定工</a-radio-button>
          <a-radio-button value="1">合同制</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='部门' v-bind="formItemLayout">
        <a-tree-select
          :allowClear="true"
          :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
          :treeData="deptTreeData"
          v-decorator="['deptId']">
        </a-tree-select>
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
      <a-form-item label='原学历' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='原学历'
          :dataSource="cultureData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['cultureBefore']"
        />
      </a-form-item>
      <a-form-item label='现学历' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='现学历'
          :dataSource="cultureData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['cultureCurrent']"
        />
      </a-form-item>
      <a-form-item label='专业' v-bind="formItemLayout">
        <a-input
          placeholder='专业'
          autocomplete="off"
          v-decorator="['profession']"/>
      </a-form-item>
      <a-form-item label='毕业日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='毕业日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['graduationDate']"
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
      <a-form-item label='残疾证' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['isDisabilityCertificate']">
          <a-radio-button value="0">无</a-radio-button>
          <a-radio-button value="1">有</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='残疾证编号' v-bind="formItemLayout">
        <a-input
          placeholder='伤残鉴定等级'
          autocomplete="off"
          v-decorator="['disabilityCertificateNumber']"/>
      </a-form-item>
      <a-form-item label='伤残鉴定等级' v-bind="formItemLayout">
        <a-input
          placeholder='伤残鉴定等级'
          autocomplete="off"
          v-decorator="['disabilityIdentificationLevel']"/>
      </a-form-item>
      <a-form-item label='参加工作日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='参加工作日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['workDate']"
        />
      </a-form-item>
      <a-form-item label='农转工日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='农转工转工日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['farmerWorkDate']"
        />
      </a-form-item>
      <a-form-item label='调入日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='调入或报到日期，【增加人员报表】就是根据此项进行查询'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['transferDate']"
        />
      </a-form-item>
      <a-form-item label='岗位' v-bind="formItemLayout">
        <a-radio-group
          v-decorator="['post']">
          <a-radio-button value="0">管理岗</a-radio-button>
          <a-radio-button value="1">技工</a-radio-button>
          <a-radio-button value="2">工勤岗</a-radio-button>
          <a-radio-button value="3">专业技术岗</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label='现任职务' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='现任职务'
          :dataSource="technicalTypeData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['technicalType',
            {rules: [{ required: true, message: '现任职务不能为空'}]}
          ]"
        />
      </a-form-item>
      <a-form-item label='岗位级别' v-bind="formItemLayout">
        <!-- <a-input
          placeholder='岗位级别'
          autocomplete="off"
          v-decorator="['postLevel']"/> -->
        <a-auto-complete
          placeholder='岗位级别'
          :dataSource="postLevelData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['postLevel']"
        />
      </a-form-item>
      <a-form-item label='等级取得日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='技术等级取得日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['technicalLevelDate']"
        />
      </a-form-item>
      <a-form-item label='聘任岗位' v-bind="formItemLayout">
        <a-input
          placeholder='聘任岗位'
          autocomplete="off"
          v-decorator="['hiringPositions']"/>
      </a-form-item>
      <a-form-item label='聘任时间' v-bind="formItemLayout">
        <a-date-picker
          placeholder='聘任时间'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['appointmentDate']"
        />
      </a-form-item>
      <a-form-item label='证书编号' v-bind="formItemLayout">
        <a-input
          placeholder='证书编号'
          autocomplete="off"
          v-decorator="['certificateNum']"/>
      </a-form-item>
      <a-form-item label='入职状态' v-bind="formItemLayout">
        <a-auto-complete
          placeholder='入职状态'
          :dataSource="entryStatusData"
          :allowClear='true'
          :filterOption="filterOption"
          v-decorator="['entryStatus']"
        />
      </a-form-item>
      <a-form-item label='排序编号' v-bind="formItemLayout">
        <a-input-number
          placeholder='排序编号'
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
  name: 'StaffInsideAdd',
  components: { DeptInputTree },
  props: {
    staffInsideAddVisiable: {
      default: false
    },
    technicalTypeData: {
      require: true
    },
    entryStatusData: {
      require: true
    },
    postLevelData: {
      require: true
    },
    deptTreeData: {
      require: true
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
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
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          const {birthDate, graduationDate, workDate, farmerWorkDate, transferDate, technicalLevelDate, appointmentDate} = values
          const staffInsideData = {
            ...values,
            birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : birthDate,
            graduationDate: graduationDate ? graduationDate.format('YYYY-MM-DD') : graduationDate,
            workDate: workDate ? workDate.format('YYYY-MM-DD') : workDate,
            farmerWorkDate: farmerWorkDate ? farmerWorkDate.format('YYYY-MM-DD') : farmerWorkDate,
            transferDate: transferDate ? transferDate.format('YYYY-MM-DD') : transferDate,
            technicalLevelDate: technicalLevelDate ? technicalLevelDate.format('YYYY-MM-DD') : technicalLevelDate,
            appointmentDate: appointmentDate ? appointmentDate.format('YYYY-MM-DD') : appointmentDate
          }
          this.loading = true
          this.$post('staffInside', {
            ...staffInsideData
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

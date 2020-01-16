<template>
  <a-drawer
    title="修改公厕"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="wcEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item label='公厕名' v-bind="formItemLayout">
        <a-input
          placeholder='公厕名'
          autocomplete="off"
          autoFocus
          v-decorator="['wcName',
            {rules: [{ required: true, message: '公厕名不能为空' }]}
          ]"/>
      </a-form-item>
      <a-form-item label='所在区县' v-bind="formItemLayout">
        <a-select
          v-decorator="['district']">
          <!-- <a-select-option v-for="i in wcDictData.district" :key="i.key">{{ i.value }}</a-select-option> -->
          <a-select-option v-for="i in Object.keys(dictData.district||[])" :key="i">{{ dictData.district[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='管理单位' v-bind="formItemLayout">
        <a-select
          v-decorator="['manageUnit']">
          <a-select-option v-for="i in Object.keys(dictData.manageUnit||[])" :key="i">{{ dictData.manageUnit[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='公厕编号' v-bind="formItemLayout">
        <a-input
          placeholder='公厕编号'
          autocomplete="off"
          v-decorator="['wcNum',
            {rules: [{ required: true, message: '公厕编号不能为空'}]}
          ]"/>
      </a-form-item>
      <a-form-item label='经度' v-bind="formItemLayout">
        <a-input
          placeholder='经度'
          autocomplete="off"
          v-decorator="['longitude']"
        />
      </a-form-item>
      <a-form-item label='纬度' v-bind="formItemLayout">
        <a-input
          placeholder='纬度'
          autocomplete="off"
          v-decorator="['latitude']"
        />
      </a-form-item>
      <a-form-item label='种类' v-bind="formItemLayout">
        <a-select
          v-decorator="['wcKind',
            {rules: [{ required: true, message: '请选择种类' }]}
          ]">
          <a-select-option v-for="i in Object.keys(dictData.wcKind||[])" :key="i">{{ dictData.wcKind[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='建设方式' v-bind="formItemLayout">
        <a-select
          v-decorator="['buildingMethod',
            {rules: [{ required: true, message: '请选择建设方式' }]}
          ]">
          <a-select-option v-for="i in Object.keys(dictData.buildingMethod||[])" :key="i">{{ dictData.buildingMethod[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='建筑类型' v-bind="formItemLayout">
        <a-select
          v-decorator="['buildingType',
            {rules: [{ required: true, message: '请选择建筑类型' }]}
          ]">
          <a-select-option v-for="i in Object.keys(dictData.buildingType||[])" :key="i">{{ dictData.buildingType[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='管理间' v-bind="formItemLayout">
        <a-input
          placeholder='有无管理间'
          autocomplete="off"
          v-decorator="['isManageRoom']"
        />
      </a-form-item>
      <a-form-item label='类别' v-bind="formItemLayout">
        <a-select
          v-decorator="['wcSort',
            {rules: [{ required: true, message: '请选择类别' }]}
          ]">
          <a-select-option v-for="i in Object.keys(dictData.wcSort||[])" :key="i">{{ dictData.wcSort[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='冲洗方式' v-bind="formItemLayout">
        <a-input
          placeholder='冲洗方式'
          autocomplete="off"
          v-decorator="['flushingMethod']"
        />
      </a-form-item>
      <a-form-item label='指标状况' v-bind="formItemLayout">
        <a-input
          placeholder='指标状况'
          autocomplete="off"
          v-decorator="['indicatorStatus']"
        />
      </a-form-item>
      <a-form-item label='所在街乡' v-bind="formItemLayout">
        <a-input
          placeholder='所在街乡'
          autocomplete="off"
          v-decorator="['streetTown']"
        />
      </a-form-item>
      <a-form-item label='使用日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='投入使用日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['useDate']"
        />
      </a-form-item>
      <a-form-item label='接管日期' v-bind="formItemLayout">
        <a-date-picker
          placeholder='接管日期'
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['replaceDate']"
        />
      </a-form-item>
      <a-form-item label='五环内外' v-bind="formItemLayout">
        <a-input
          placeholder='五环内外'
          autocomplete="off"
          v-decorator="['is5thRing']"
        />
      </a-form-item>
      <a-form-item label='初建投资' v-bind="formItemLayout">
        <a-input
          placeholder='初建投资'
          autocomplete="off"
          v-decorator="['initialMoney']"
        />
      </a-form-item>
      <a-form-item label='建筑面积' v-bind="formItemLayout">
        <a-input
          placeholder='建筑面积'
          autocomplete="off"
          v-decorator="['wcArea']"
        />
      </a-form-item>
      <a-form-item label='有无产权' v-bind="formItemLayout">
        <a-input
          placeholder='有无产权'
          autocomplete="off"
          v-decorator="['isPropertyRight']"
        />
      </a-form-item>
      <a-form-item label='洗手盆数' v-bind="formItemLayout">
        <a-input
          placeholder='洗手盆数量'
          autocomplete="off"
          v-decorator="['sink']"
        />
      </a-form-item>
      <a-form-item label='男坑位数' v-bind="formItemLayout">
        <a-input
          placeholder='男坑位数'
          autocomplete="off"
          v-decorator="['pitMale']"
        />
      </a-form-item>
      <a-form-item label='女坑位数' v-bind="formItemLayout">
        <a-input
          placeholder='女坑位数'
          autocomplete="off"
          v-decorator="['pitFemale']"
        />
      </a-form-item>
      <a-form-item label='无性别数' v-bind="formItemLayout">
        <a-input
          placeholder='无性别坑位数'
          autocomplete="off"
          v-decorator="['pitSexless']"
        />
      </a-form-item>
      <a-form-item label='小便器类型' v-bind="formItemLayout">
        <a-input
          placeholder='小便器类型'
          autocomplete="off"
          v-decorator="['urinalsType']"
        />
      </a-form-item>
      <a-form-item label='小便器数' v-bind="formItemLayout">
        <a-input
          placeholder='小便器数量'
          autocomplete="off"
          v-decorator="['urinalsNum']"
        />
      </a-form-item>
      <a-form-item label='无障碍设施' v-bind="formItemLayout">
        <a-input
          placeholder='有无无障碍设施'
          autocomplete="off"
          v-decorator="['isAccessibility']"
        />
      </a-form-item>
      <a-form-item label='导向牌数' v-bind="formItemLayout">
        <a-input
          placeholder='导向牌数'
          autocomplete="off"
          v-decorator="['indicatorNum']"
        />
      </a-form-item>
      <a-form-item label='残疾间' v-bind="formItemLayout">
        <a-input
          placeholder='有无残疾间'
          autocomplete="off"
          v-decorator="['isDisabledRoom']"
        />
      </a-form-item>
      <a-form-item label='粪便处理' v-bind="formItemLayout">
        <a-input
          placeholder='粪便处理方式'
          autocomplete="off"
          v-decorator="['fecalMethod']"
        />
      </a-form-item>
      <a-form-item label='小便器长' v-bind="formItemLayout">
        <a-input
          placeholder='小便器长度'
          autocomplete="off"
          v-decorator="['urinalsLen']"
        />
      </a-form-item>
      <a-form-item label='开放时间' v-bind="formItemLayout">
        <a-input
          placeholder='开放时间'
          autocomplete="off"
          v-decorator="['openHour']"
        />
      </a-form-item>
      <a-form-item label='作业方式' v-bind="formItemLayout">
        <a-input
          placeholder='作业方式'
          autocomplete="off"
          v-decorator="['assignmentStyle']"
        />
      </a-form-item>
      <a-form-item label='所属分队' v-bind="formItemLayout">
        <a-auto-complete
          :dataSource="wcOwnData"
          :allowClear='true'
          :filterOption="filterOption"
          placeholder="所属分队名称"
          v-decorator="['wcOwn',
            {rules: [{ required: true, message: '所属分队不能为空' }]}
          ]"/>
      </a-form-item>
      <a-form-item label='管理形式' v-bind="formItemLayout">
        <a-select
          v-decorator="['manageType',
            {rules: [{ required: true, message: '请选择管理形式' }]}
          ]">
          <a-select-option v-for="i in Object.keys(dictData.manageType||[])" :key="i">{{ dictData.manageType[i] }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label='保洁人数' v-bind="formItemLayout">
        <a-input
          placeholder='保洁人数'
          autocomplete="off"
          v-decorator="['cleanNum']"
        />
      </a-form-item>
      <a-form-item label='公厕地址' v-bind="formItemLayout">
        <a-input
          placeholder='公厕地址'
          autocomplete="off"
          v-decorator="['wcAddress']"
        />
      </a-form-item>
      <a-form-item label='公厕状态' v-bind="formItemLayout">
        <a-input
          placeholder='公厕状态'
          autocomplete="off"
          v-decorator="['wcNowStatus']"
        />
      </a-form-item>
      <a-form-item label='水表编号' v-bind="formItemLayout">
        <a-input
          placeholder='水表编号'
          autocomplete="off"
          v-decorator="['waterNum']"
        />
      </a-form-item>
      <a-form-item label='电表编号' v-bind="formItemLayout">
        <a-input
          placeholder='电表编号'
          autocomplete="off"
          v-decorator="['electricityNum']"
        />
      </a-form-item>
      <a-form-item label='缴费号' v-bind="formItemLayout">
        <a-input
          placeholder='缴费号'
          autocomplete="off"
          v-decorator="['paymentNum']"/>
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
  name: 'WCEdit',
  props: {
    wcEditVisiable: {
      default: false
    },
    dictData: {
      require: true
    },
    wcOwnData: {
      require: true
    }
  },
  data () {
    return {
      wcId: '',
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    onClose () {
      this.loading = false
      this.form.resetFields()
      this.$emit('close')
    },
    setFormValues ({...wc}) {
      this.wcId = wc.wcId
      let fields = ['useDate', 'replaceDate']
      let obj = {}
      Object.keys(wc).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = wc[key]
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
          const useDate = values['useDate']
          const replaceDate = values['replaceDate']
          const wcData = {
            ...values,
            'wcId': this.wcId,
            'useDate': useDate ? useDate.format('YYYY-MM-DD') : useDate,
            'replaceDate': replaceDate ? replaceDate.format('YYYY-MM-DD') : replaceDate
          }
          this.loading = true
          this.$put('wc', {
            ...wcData
          }).then((r) => {
            this.loading = false
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

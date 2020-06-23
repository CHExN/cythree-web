<template>
  <a-drawer
    title="修改固定资产申请"
    :maskClosable="false"
    width=920
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="fixedAssetsEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='申请部门' v-bind="formItemLayout">
            <a-input placeholder='申请部门' autocomplete="off" disabled :value="this.deptName"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='联系人' v-bind="formItemLayout">
            <a-input
              placeholder='联系人'
              autocomplete="off"
              autoFocus
              v-decorator="['handle']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='电话' v-bind="formItemLayout">
            <a-input
              placeholder='电话'
              autocomplete="off"
              v-decorator="['num']"/> <!-- 原先为申请单编号 -->
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='预计金额' v-bind="formItemLayout">
            <a-input-number
              :min="0"
              :precision="2"
              :formatter="value => value"
              autocomplete="off"
              placeholder='预计金额'
              style="width: 100%;"
              v-decorator="['money',{rules: [{ required: true, message: '预计金额不能为空' }]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='购买理由' v-bind="formItemLayout">
            <a-textarea
              placeholder='申请购买理由'
              autocomplete="off"
              v-decorator="['description']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='规格要求' v-bind="formItemLayout">
            <a-textarea
              placeholder='规格要求'
              autocomplete="off"
              v-decorator="['appDept']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='申请日期' v-bind="formItemLayout">
            <a-date-picker
              placeholder='申请日期'
              format='YYYY-MM-DD'
              style="width: 100%;"
              v-decorator="['createDate',
                {rules: [{ required: true, message: '申请日期不能为空'}]}
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        rowKey="id"
      >
        <template  v-for="(col, i) in ['name', 'amount', 'remark']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            style="margin: -5px 0"
            v-model="record[col]"
            :placeholder="columns[i].title"
            @change="e => handlePlanChange(e.target.value, record.id, col)"
          />
        </template>

        <template slot="amount" slot-scope="text, record">
          <a-input-number
            v-model="record.amount"
            :min="0.01"
            :precision="2"
            :formatter="value => value"
            placeholder='数量'
          />
        </template>

        <template slot="remark" slot-scope="text, record">
          <a-input-number
            v-model="record.remark"
            :min="0.01"
            :max="1000000"
            :precision="2"
            :formatter="value => value"
            placeholder='金额'
          />
        </template>

        <template slot="operation" slot-scope="text, record">
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </template>

      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newRow">新增物品</a-button>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="editLoading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import moment from 'moment'
moment.locale('zh-cn')
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17, offset: 1 }
}
export default {
  name: 'FixedAssetsEdit',
  props: {
    fixedAssetsEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this),
      id: '',
      loading: false,
      editLoading: false,
      tableIndex: 0,
      dataSource: [],
      deptName: ''
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '金额',
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' }
      }, {
        title: '操作',
        dataIndex: 'action',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.form.resetFields()
      this.dataSource = []
      this.tableIndex = 0
    },
    onClose () {
      this.editLoading = false
      this.form.resetFields()
      this.reset()
      this.$emit('close')
    },
    setTableValues (plan) {
      this.dataSource = plan
    },
    handlePlanChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    setFormValues ({...fixedAssets}) {
      this.id = fixedAssets.id
      this.deptName = fixedAssets.deptName
      let obj = {}
      Object.keys(fixedAssets).forEach((key) => {
        this.form.getFieldDecorator(key)
        obj[key] = fixedAssets[key]
      })
      obj['createDate'] = moment(obj['createDate'])
      this.form.setFieldsValue(obj)
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let isReturn = false
          this.dataSource.forEach(item => {
            if (!item.name) {
              this.$message.warning('请填写物品名称')
              isReturn = true
            }
            if (!item.amount) {
              this.$message.warning('请填写数量')
              isReturn = true
            }
            if (!item.remark) {
              this.$message.warning('请填写金额')
              isReturn = true
            }
          })
          if (this.dataSource.length === 0) {
            this.$message.warning('计划单至少要有一条数据')
            isReturn = true
          }
          if (isReturn) return
          this.editLoading = true
          let planList = JSON.stringify(this.dataSource)
          this.$put('application', {
            ...values,
            createDate: values.createDate.format('YYYY-MM-DD'),
            planList: planList,
            id: this.id
          }).then((r) => {
            this.editLoading = false
            this.reset()
            this.$emit('success')
          }).catch(() => {
            this.editLoading = false
          })
        }
      })
    },
    newRow () {
      this.tableIndex++
      this.dataSource.push({
        id: this.tableIndex,
        name: '',
        amount: 1,
        remark: 1
      })
    },
    remove (id) {
      const newData = this.dataSource.filter(item => item.id !== id)
      this.dataSource = newData
    }
  },
  watch: {
    fixedAssetsEditVisiable () {
      if (this.fixedAssetsEditVisiable) {
        this.loading = true
        this.$get('application/applicationPlan', {
          applicationId: this.id
        }).then((r) => {
          this.loading = false
          this.setTableValues(r.data)
        })
      }
    }
  }
}
</script>

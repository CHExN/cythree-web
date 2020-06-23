<template>
  <a-drawer
    title="新增采购申请"
    :maskClosable="false"
    width=920
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="applicationAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='编号' v-bind="formItemLayout">
            <a-input
              placeholder='申请单编号'
              autocomplete="off"
              autoFocus
              v-decorator="['num',
                {rules: [{ required: true, message: '申请单编号不能为空'}]}
              ]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='申请部门' v-bind="formItemLayout">
            <a-input
              placeholder='申请部门'
              autocomplete="off"
              disabled
              :value="this.user.deptName"
            />
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='物资类别' v-bind="formItemLayout">
            <a-select
              placeholder='物资类别'
              v-decorator="['typeApplication', {
                initialValue: [dictData.typeApplication && JSON.stringify(dictData.typeApplication)!=='{}' ? Object.keys(dictData.typeApplication)[0] : ''],
                rules: [{ required: true, message: '请选择物资类别' }]
              }]">
              <a-select-option v-for="i in Object.keys(dictData.typeApplication||[])" :key="i">{{ dictData.typeApplication[i] }}</a-select-option>
            </a-select>
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
              v-decorator="['money']"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :md="12" :sm="24">
          <a-form-item label='采负责人' v-bind="formItemLayout">
            <a-input placeholder='分管采购工作负责人' autocomplete="off" v-decorator="['purDept']"/>
          </a-form-item>
        </a-col> -->
        <a-col :md="12" :sm="24">
          <a-form-item label='采购说明' v-bind="formItemLayout">
            <a-textarea
              placeholder='采购用途、采购数量、功能要求等'
              autocomplete="off"
              v-decorator="['description']"/>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="12" :sm="24">
          <a-form-item label='申负责人' v-bind="formItemLayout">
            <a-input
              placeholder='申请部门负责人'
              autocomplete="off"
              v-decorator="['appDept']"/>
          </a-form-item>
        </a-col> -->
        <a-col :md="12" :sm="24">
          <a-form-item label='经办人' v-bind="formItemLayout">
            <a-input
              placeholder='分管采购工作经办人'
              autocomplete="off"
              v-decorator="['handle']"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
      >
        <template  v-for="(col, i) in ['name', 'type', 'amount', 'unit', 'remark']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handlePlanChange(e.target.value, record.key, col)"
          />
          <template v-else>{{text}}</template>
        </template>
        <template slot="amount" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <a-input-number
              v-model="record.amount"
              :min="0.01"
              :precision="2"
              :formatter="value => value"
              placeholder='数量'
            />
          </template>
          <span v-else>{{ text }}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record.key)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record.key)">保存</a>
              <a-divider type="vertical" />
              <a @click="cancle(record.key)">取消</a>
            </span>
          </template>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newRow">新增物品</a-button>
    </a-card>
    <div class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="onClose" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="loading">提交</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { mapState } from 'vuex'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 17, offset: 1 }
}

export default {
  name: 'ApplicationAdd',
  props: {
    applicationAddVisiable: {
      default: false
    },
    dictData: {
      require: true
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this),
      dataSource: [],
      tableIndex: 0
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name',
        width: '23%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '型号',
        dataIndex: 'type',
        width: '15%',
        scopedSlots: { customRender: 'type' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '15%',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: '12%',
        scopedSlots: { customRender: 'unit' }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '20%',
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
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = []
          this.dataSource.forEach(item => {
            if (item.isNew === false && item.editable === false) {
              data.push(item)
            }
          })
          if (data.length !== 0) {
            let planList = JSON.stringify(data, function (key, value) {
              return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
            })
            this.loading = true
            this.$post('application', {
              ...values,
              'deptId': this.user.deptId,
              'planList': planList
            }).then((r) => {
              this.reset()
              this.$emit('success')
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$message.warning('计划单至少要有一条数据')
          }
        }
      })
    },
    newRow () {
      this.tableIndex++
      this.dataSource.push({
        key: this.tableIndex,
        name: '',
        type: '',
        unit: '',
        amount: 1,
        remark: '',
        editable: true,
        isNew: true
      })
    },
    remove (key) {
      const newData = this.dataSource.filter(item => item.key !== key)
      this.dataSource = newData
    },
    saveRow (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
      target.isNew = false
    },
    edit (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
    },
    handlePlanChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
</style>

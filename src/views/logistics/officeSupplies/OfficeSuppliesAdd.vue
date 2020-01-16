<template>
  <a-drawer
    title="新增办公用品申请"
    :maskClosable="false"
    width=920
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="officeSuppliesAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <!-- <a-form :form="form">
      <a-row class="form-row">
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
      </a-row>
    </a-form> -->
    <!-- <a-card :bordered="false"> -->
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
    <!-- </a-card> -->
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
  name: 'OfficeSuppliesAdd',
  props: {
    officeSuppliesAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      formItemLayout,
      // form: this.$form.createForm(this),
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
        width: '20%',
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
        width: '23%',
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
      // this.form.resetFields()
      this.dataSource = []
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    handleSubmit () {
      // this.form.validateFields((err, values) => {
      // if (!err) {
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
          // ...values,
          typeApplication: 3, // 办公用品
          deptId: this.user.deptId,
          planList: planList
        }).then((r) => {
          this.reset()
          this.$emit('success')
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.$message.warning('计划单至少要有一条数据')
      }
      // }
      // })
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

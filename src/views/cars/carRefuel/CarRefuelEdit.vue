<template>
  <a-drawer
    title="修改车辆加油信息"
    :maskClosable="false"
    width=650
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="carRefuelEditVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-form-item
        label='日期'
        :labelCol="{span: 3}"
        :wrapperCol="{span: 18}">
        <a-date-picker
          autoFocus
          placeholder='录入日期'
          autocomplete="off"
          format='YYYY-MM-DD'
          style="width: 100%;"
          v-decorator="['date',{
            rules: [{ required: true, message: '请选择录入日期'}]
          }]"/>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="tableLoading"
      rowKey="carRefuelId"
    >
      <template  v-for="(col, i) in ['carNum', 'cardNum']" :slot="col" slot-scope="text, record">
        <a-input
          :key="col"
          style="margin: -5px 0"
          :value="text"
          :placeholder="columns[i].title"
          @change="e => handleCarRefuelChange(e.target.value, record.carId, col)"
        />
      </template>
      <template slot="amount" slot-scope="text, record">
        <a-input-number
          v-model="record.amount"
          :min="1"
          :max="100000"
          :precision="2"
          :formatter="value => value"
          style="width: 100%;"
          placeholder='金额'
        />
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm title="是否要删除此行？" @confirm="remove(record.carRefuelId)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
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

export default {
  name: 'CarRefuelEdit',
  props: {
    carRefuelEditVisiable: {
      default: false
    }
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      form: this.$form.createForm(this),
      dataSource: [],
      dataUpdate: {},
      tableIndex: 0
    }
  },
  computed: {
    columns () {
      return [{
        title: '车牌号',
        dataIndex: 'carNum',
        width: '30%',
        scopedSlots: { customRender: 'carNum' }
      }, {
        title: '卡号',
        dataIndex: 'cardNum',
        width: '30%',
        scopedSlots: { customRender: 'cardNum' }
      }, {
        title: '金额',
        dataIndex: 'amount',
        width: '30%',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '操作',
        dataIndex: 'action',
        width: '10%',
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
    setFormValues (date) {
      this.form.getFieldDecorator('date')
      this.form.setFieldsValue({ date: moment(date) })
      this.tableLoading = true
      this.$get('carRefuel/carRefuelDetail', {
        date: date
      }).then((r) => {
        this.tableLoading = false
        this.dataSource = r.data
      })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.dataSource.length !== 0) {
            if (!this.dataSource.find(item => {
              return !item.carNum || !item.cardNum
            })) {
              this.dataSource.forEach(element => {
                element.date = values.date.format('YYYY-MM-DD')
              })
              let data = JSON.stringify(this.dataSource, function (key, value) {
                // 去除null值
                return value === null || key === 'cardNum' || key === 'carNum' ? undefined : value
              })
              this.loading = true
              this.$put('carRefuel', {
                carRefuels: data
              }).then((r) => {
                this.reset()
                this.$emit('success')
              }).catch(() => {
                this.loading = false
              })
              let dataUpdateArr = Object.values(this.dataUpdate)
              if (dataUpdateArr.length !== 0) {
                this.$put('car/updateBatchCar', {
                  cars: JSON.stringify(dataUpdateArr)
                })
              }
            } else {
              this.$message.warning('车牌号与卡号不能为空')
            }
          } else {
            this.$message.warning('至少要有一条数据')
          }
        }
      })
    },
    remove (carRefuelId) {
      delete this.dataUpdate[carRefuelId]
      const newSource = this.dataSource.filter(item => item.carRefuelId !== carRefuelId)
      this.dataSource = newSource
    },
    handleCarRefuelChange (value, carId, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => item.carId === carId)[0]
      if (target) {
        target[column] = value
        this.dataUpdate[target.carId] = target
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

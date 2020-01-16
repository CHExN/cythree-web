<template>
  <a-drawer
    title="新增入库"
    :maskClosable="false"
    width=1220
    placement="right"
    :closable="false"
    @close="onClose"
    :visible="putAddVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-form :form="form">
      <a-row class="form-row">
        <a-col :md="12" :sm="24">
          <a-form-item label='单号' v-bind="formItemLayout">
            <a-input placeholder='入库单单号' autocomplete="off" autoFocus
              v-decorator="['num',{rules: [{ required: true, message: '入库单单号不能为空'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='日期' v-bind="formItemLayout">
            <a-date-picker placeholder='日期' autocomplete="off" format='YYYY-MM-DD' style="width: 100%;"
              v-decorator="['date',{rules: [{ required: true, message: '请选择录入日期'}]}]"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='经手人' v-bind="formItemLayout">
            <a-input placeholder='经手人' autocomplete="off"  v-decorator="['handle']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='保管员' v-bind="formItemLayout">
            <a-input placeholder='保管员' autocomplete="off"  v-decorator="['storage']"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='物资类别' v-bind="formItemLayout">
            <a-select disabled placeholder='物资类别' v-decorator="['typeApplication', {
              initialValue: [dictData.typeApplication && dictData.typeApplication.length > 0 ? dictData.typeApplication[0].key : ''],
              rules: [{ required: true, message: '请选择物资类别' }]
            }]">
              <a-select-option v-for="i in dictData.typeApplication" :key="i.key">{{ i.value }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24">
          <a-form-item label='供应商' v-bind="formItemLayout">
            <a-select placeholder='供应商' v-decorator="['supplier', {
              initialValue: [dictData.supplier && dictData.supplier.length > 0 ? dictData.supplier[0].key : ''],
              rules: [{ required: true, message: '请选择供应商' }]
            }]">
              <a-select-option v-for="i in dictData.supplier" :key="i.key">{{ i.value }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-card title="入库名单" :bordered="false">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
      >
        <template v-for="(col, i) in ['name', 'money', 'amount', 'unit', 'type', 'remark', 'receipt']" :slot="col" slot-scope="text, record">
          <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            @change="e => handleStoreroomChange(e.target.value, record.key, col)"
          />
          <template v-else>{{text}}</template>
        </template>

        <template slot="name" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <!-- 这里的showSearch属性费了我多少时间，官方api根本没这个东西，我只是想在触发handleSearch的时候调出autoComplete的下拉框而已  -->
            <!-- :showSearch="showSearch" -->
            <a-auto-complete
              :ref="record.key"
              v-model="record.name"
              placeholder='物品名称'
              @select="e => onSelect(e, record.key)"
              :filterOption="filterOption">
              <template slot="dataSource">                      <!-- value不转成string就会报Error: Invalid `value` of type `number`  -->
                <a-select-option v-for="item in autoData[record.key]" :key="item.id" :value="item.money + '^' + item.name" >{{item.name}}</a-select-option>
              </template>
              <a-input @pressEnter="handleSearch(record.name, record.key)">
                <a-icon @click="handleSearch(record.name, record.key)" slot="suffix" type="search" class="certain-category-icon" />
              </a-input>
            </a-auto-complete>
          </template>
          <span v-else>{{ text }}</span>
        </template>

        <template slot="amount" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <a-input-number
              v-model="record.amount"
              :min="0.01"
              :precision="2"
              :formatter="value => value"
              placeholder='数量'/>
          </template>
          <span v-else>{{ $tools.toNumFormant(text) }}</span>
        </template>

        <template slot="money" slot-scope="text, record">
          <template v-if="record.editable || record.isNew">
            <a-input-number
              v-model="record.money"
              :min="0"
              :precision="2"
              :formatter="value => value"
              placeholder='单价'/>
          </template>
          <span v-else>{{ $tools.addZero($tools.toNumFormant(text)) }}</span>
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
      <a-button type="primary" ghost  @click="showModal" :loading="putOutLoading">即入即出</a-button>
      &nbsp;&nbsp;
      <a-modal
        title="选择出库到哪个部门"
        v-model="modalVisible"
        :mask='false'
        :maskClosable="false"
        :width='350'
        style="left: 30%;top: 65%"
        @ok="subPutOut"
        okText="提交"
        cancelText="取消">
        <dept-input-tree @change="handleDeptChange" placeholder='请选择部门' ref="deptTree" style="width: 100%;"></dept-input-tree>
      </a-modal>
      <a-button @click="handleSubmit" type="primary" :loading="putLoading">提交</a-button>
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
  name: 'StoreroomPutAdd',
  components: { DeptInputTree },
  props: {
    putAddVisiable: {
      default: false
    }
  },
  data () {
    return {
      putLoading: false,
      putOutLoading: false,
      dataSource: [],
      autoData: {},
      open: false,
      tableIndex: 0,
      modalVisible: false,
      dictData: {},
      // showSearch: false,
      deptId: '',
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  computed: {
    columns () {
      return [{
        title: '物品名称',
        dataIndex: 'name',
        width: '20%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '单价',
        dataIndex: 'money',
        width: '11%',
        scopedSlots: { customRender: 'money' }
      }, {
        title: '数量',
        dataIndex: 'amount',
        width: '11%',
        scopedSlots: { customRender: 'amount' }
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: '10%',
        scopedSlots: { customRender: 'unit' }
      }, {
        title: '型号',
        dataIndex: 'type',
        width: '10%',
        scopedSlots: { customRender: 'type' }
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: '14%',
        scopedSlots: { customRender: 'remark' }
      }, {
        title: '收据',
        dataIndex: 'receipt',
        width: '14%',
        scopedSlots: { customRender: 'receipt' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  methods: {
    reset () {
      this.putLoading = false
      this.putOutLoading = false
      this.form.resetFields()
      this.dataSource = []
      this.autoData = {}
      this.tableIndex = 0
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setTableValues (typeApplication, storeroom) {
      this.form.getFieldDecorator('typeApplication')
      this.form.setFieldsValue({ typeApplication: typeApplication })
      for (const item in storeroom) {
        this.tableIndex++
        this.dataSource.push({
          key: this.tableIndex,
          name: storeroom[item].name,
          type: storeroom[item].type,
          unit: storeroom[item].unit,
          amount: storeroom[item].amount,
          remark: storeroom[item].money ? '' : storeroom[item].remark,
          money: storeroom[item].money || 0,
          receipt: '',
          editable: true,
          isNew: true
        })
        this.handleSearch(storeroom[item].name, this.tableIndex)
      }
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
          if (data.length > 0) {
            let storeroomList = JSON.stringify(data, function (key, value) {
              return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
            })
            const date = values['date']
            this.putLoading = true
            this.$post('storeroomPut', {
              ...values,
              date: date.format('YYYY-MM-DD'),
              storeroomList: storeroomList
            }).then((r) => {
              this.reset()
              this.$emit('success')
            }).catch(() => {
              this.putLoading = false
            })
          } else {
            this.$message.warning('入库名单至少要有一条数据')
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
        money: 0,
        receipt: '',
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
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
    },
    edit (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = !target.editable
    },
    cancle (key) {
      let target = this.dataSource.filter(item => item.key === key)[0]
      target.editable = false
      target.name = target.name.indexOf('^') === -1 ? target.name : target.name.split('^')[1]
    },
    handleStoreroomChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.dataSource = newData
      }
    },
    onSelect (moneyAndName, key) {
      const moneyAndNameArr = moneyAndName.split('^')
      // 鼠标点击选中项时触发
      this.dataSource.forEach(item => {
        if (item.key === key) { item.money = moneyAndNameArr[0] }
      })
    },
    handleSearch (name, key) {
      if (name) {
        this.$get('price/' + name, {
        }).then((r) => {
          if (r.data.length) {
            // 触发autoComplete展示下拉框
            // this.showSearch = true
            // 这里会报[Vue warn]: Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value.
            // 但我找不到别的办法调用当前autoComplete的下拉框
            // 除非你能不报warn的完成这些效果
            this.autoData[key] = r.data
            this.$refs[key].showSearch = true
          }
        })
      }
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    showModal () {
      this.form.validateFields((err) => {
        if (!err) {
          if (this.dataSource.length !== 0) {
            this.modalVisible = true
          } else {
            this.$message.warning('入库名单至少要有一条数据')
          }
        }
      })
    },
    subPutOut () {
      this.form.validateFields((err, values) => {
        if (this.deptId) {
          if (!err) {
            let data = []
            this.dataSource.forEach(item => {
              if (item.isNew === false && item.editable === false) {
                data.push(item)
              }
            })
            if (data.length > 0) {
              this.modalVisible = false
              let storeroomList = JSON.stringify(data, function (key, value) {
                return key === 'key' || key === 'editable' || key === 'isNew' ? undefined : value
              })
              this.putOutLoading = true
              const date = values['date']
              this.$post('storeroomPut/inOut', {
                ...values,
                toDeptId: this.deptId,
                date: date.format('YYYY-MM-DD'),
                storeroomList: storeroomList
              }).then((r) => {
                // 清空部门树选择
                this.$refs.deptTree.reset()
                this.reset()
                this.$emit('success')
              }).catch(() => {
                this.putOutLoading = false
              })
            } else {
              this.$message.warning('入库名单至少要有一条数据')
            }
          }
        } else {
          this.$message.warning('请选择出库到哪个部门')
        }
      })
    },
    handleDeptChange (value) {
      this.deptId = value || ''
    }
  },
  watch: {
    putAddVisiable () {
      if (this.putAddVisiable) {
        this.form.getFieldDecorator('date')
        this.form.setFieldsValue({ date: moment() })
        this.$get('supplier/all', {
        }).then((r) => {
          let dictList = {}
          r.data.forEach((item) => {
            if (dictList.supplier) {
              dictList.supplier.push({key: item.id, value: item.name})
            } else {
              dictList.supplier = [{key: item.id, value: item.name}]
            }
          })
          this.dictData = {...this.dictData, ...dictList}
        })
        this.$get('dict/cy_storeroom', {
        }).then((r) => {
          let dictList = {}
          r.data.forEach((item) => {
            let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
            if (dictList[fieldName]) {
              dictList[fieldName].push({key: item.keyy, value: item.valuee})
            } else {
              dictList[fieldName] = [{key: item.keyy, value: item.valuee}]
            }
          })
          this.dictData = {...this.dictData, ...dictList}
        })
      }
    }
  }
}
</script>

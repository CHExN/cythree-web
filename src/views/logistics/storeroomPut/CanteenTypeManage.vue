<template>
  <a-drawer
    title="食堂用品类别管理"
    width=500
    placement="right"
    @close="onClose"
    :closable="false"
    :visible="canteenTypeManageVisiable"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :loading="loading"
      rowKey="id"
    >
      <template slot="name" slot-scope="text, record">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          placeholder="类别名称"
          v-model="record.name"
        />
        <template v-else>{{text}}</template>
      </template>

      <template slot="operation" slot-scope="text, record">
        <template v-if="record.editable">
          <span v-if="record.isNew">
            <a @click="saveRow(record.id)">添加</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id)">
              <a>删除</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="saveRow(record.id)">保存</a>
            <a-divider type="vertical" />
            <a @click="cancle(record.id)">取消</a>
          </span>
        </template>
        <span v-else>
          <a @click="edit(record.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要删除此行？" @confirm="remove(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </template>
    </a-table>
    <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newRow">新增类别</a-button>
  </a-drawer>
</template>
<script>
export default {
  name: 'CanteenTypeManage',
  props: {
    canteenTypeManageVisiable: {
      require: true,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      form: this.$form.createForm(this),
      dataSource: []
    }
  },
  computed: {
    columns () {
      return [{
        title: '类别',
        dataIndex: 'name',
        width: '70%',
        scopedSlots: { customRender: 'name' }
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: '30%',
        scopedSlots: { customRender: 'operation' }
      }]
    }
  },
  methods: {
    reset () {
      this.loading = false
      this.dataSource = []
    },
    onClose () {
      this.reset()
      this.$emit('close')
    },
    setTableValues (data) {
      if (!data) return []
      let newData = []
      data.forEach(item => {
        newData.push({
          id: item.id,
          name: item.name,
          editable: false,
          isNew: false
        })
      })
      return newData
    },
    newRow () {
      this.dataSource.push({
        id: Math.max(...this.dataSource.map(item => item.id)) + 1, // 取dataSource内id最大值+1
        name: '',
        editable: true,
        isNew: true
      })
    },
    remove (id) {
      this.loading = true
      this.$delete('canteen/' + id).then(() => {
        const newData = this.dataSource.filter(item => item.id !== id)
        this.dataSource = newData
        this.$message.success('删除成功')
        this.loading = false
      })
    },
    saveRow (id) {
      this.loading = true
      let target = this.dataSource.filter(item => item.id === id)[0]
      this.$post('canteen', {
        ...target
      }).then((r) => {
        this.loading = false
        target.id = r.data
        target.editable = false
        target.isNew = false
      })
    },
    edit (id) {
      let target = this.dataSource.filter(item => item.id === id)[0]
      target.editable = !target.editable
    },
    cancle (id) {
      let target = this.dataSource.filter(item => item.id === id)[0]
      target.editable = false
    }
  },
  watch: {
    canteenTypeManageVisiable () {
      if (this.canteenTypeManageVisiable) {
        this.tableLoading = true
        this.$get('canteen', {
        }).then((r) => {
          this.tableLoading = false
          this.dataSource = this.setTableValues(r.data)
        })
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

<template>
  <a-modal
    title="出入库物品明细信息"
    :centered="true"
    :width="1100"
    :visible="storeroomItemDetailsInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list>
        <detail-list-item term="物品名称">{{storeroomItemDetailsInfoData.name}}</detail-list-item>
        <detail-list-item term="型号">{{storeroomItemDetailsInfoData.unit}}</detail-list-item>
        <detail-list-item term="入库数量">{{storeroomItemDetailsInfoData.amount}}</detail-list-item>
        <detail-list-item term="单位">{{storeroomItemDetailsInfoData.unit}}</detail-list-item>
        <detail-list-item term="单价">{{$tools.addZero($tools.toNumFormant(storeroomItemDetailsInfoData.money))}}</detail-list-item>
        <detail-list-item term="物资类别">{{storeroomItemDetailsInfoData.typeApplicationToDict}}</detail-list-item>
        <detail-list-item term="供应商">{{storeroomItemDetailsInfoData.supplierToDict}}</detail-list-item>
        <detail-list-item term="入库日期">{{storeroomItemDetailsInfoData.date}}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="进付明细">
        <a-table ref="TableInfo" bordered
                :columns="columns"
                :dataSource="dataSource"
                :pagination="false"
                :loading="loading">
          <template slot="info" slot-scope="text">
            <span v-if="text.charAt(0) === '进'" >
              进 <a-tag color="cyan">{{text.substring(1) || text}}</a-tag>
            </span>
            <span v-else-if="text.charAt(0) === '付'">
              付 <a-tag color="purple">{{text.substring(1) || text}}</a-tag>
            </span>
            <span v-else>{{text}}</span>
          </template>
        </a-table>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'StoreroomItemDetailsInfo',
  props: {
    storeroomItemDetailsInfoVisiable: {
      require: true,
      default: false
    },
    storeroomItemDetailsInfoData: {
      require: true
    }
  },
  data () {
    return {
      dataSource: [],
      loading: false
    }
  },
  computed: {
    columns () {
      return [{
        title: '单号',
        dataIndex: 'num'
      }, {
        title: '日期',
        dataIndex: 'date'
      }, {
        title: '摘要',
        dataIndex: 'info',
        scopedSlots: { customRender: 'info' }
      }, {
        title: '收入',
        children: [
          {
            title: '数量',
            dataIndex: 'quantityPut'
          }, {
            title: '单价',
            dataIndex: 'unitPricePut'
          }, {
            title: '金额',
            dataIndex: 'amountPut'
          }
        ]
      }, {
        title: '发出',
        children: [
          {
            title: '数量',
            dataIndex: 'quantityOut'
          }, {
            title: '单价',
            dataIndex: 'unitPriceOut'
          }, {
            title: '金额',
            dataIndex: 'amountOut'
          }
        ]
      }, {
        title: '结存',
        children: [
          {
            title: '数量',
            dataIndex: 'quantity'
          }, {
            title: '单价',
            dataIndex: 'unitPrice'
          }, {
            title: '金额',
            dataIndex: 'amount'
          }
        ]
      }]
    }
  },
  methods: {
    handleCancleClick () {
      this.loading = false
      this.$emit('close')
    }
  },
  watch: {
    storeroomItemDetailsInfoVisiable () {
      if (this.storeroomItemDetailsInfoVisiable) {
        this.dataSource = []
        this.loading = true
        this.$get('storeroom/storeroomOutItem', {
          parentId: this.storeroomItemDetailsInfoData.parentId,
          id: this.storeroomItemDetailsInfoData.id
        }).then((r) => {
          this.loading = false
          this.dataSource.push({
            num: this.storeroomItemDetailsInfoData.putNum,
            date: this.storeroomItemDetailsInfoData.date,
            info: `进${this.storeroomItemDetailsInfoData.name}`,
            quantityPut: this.storeroomItemDetailsInfoData.amount,
            unitPricePut: this.storeroomItemDetailsInfoData.money,
            amountPut: this.$tools.accMultiply(this.storeroomItemDetailsInfoData.amount, this.storeroomItemDetailsInfoData.money),
            quantityOut: null,
            unitPriceOut: null,
            amountOut: null,
            quantity: null,
            unitPrice: null,
            amount: null
          })
          let quantity = this.dataSource[0].quantityPut
          let amount = this.dataSource[0].amountPut
          let quantityOut = 0
          let amountOut = 0
          r.data.forEach((element, index) => {
            // 被比较的月份
            let compareMonth = index === 0 ? this.dataSource[0].date.split('-')[1] : r.data[index - 1].date.split('-')[1]
            // 循环的月份
            let elementMonth = element.date.split('-')[1]
            // 判断月份，如果变化了，就加一条‘本月合计’行
            if (compareMonth !== elementMonth) {
              this.dataSource.push({
                num: null,
                date: null,
                info: '本月合计',
                quantityPut: this.storeroomItemDetailsInfoData.amount,
                unitPricePut: this.storeroomItemDetailsInfoData.money,
                amountPut: this.$tools.accMultiply(this.storeroomItemDetailsInfoData.amount, this.storeroomItemDetailsInfoData.money),
                quantityOut: quantityOut,
                unitPriceOut: this.storeroomItemDetailsInfoData.money,
                amountOut: amountOut,
                quantity: quantity,
                unitPrice: quantity === 0 ? '' : this.storeroomItemDetailsInfoData.money,
                amount: amount
              })
              // 重置
              quantityOut = 0
              amountOut = 0
            }
            // 计算结存的
            quantity = this.$tools.accSubtract(quantity, element.amount)
            amount = this.$tools.accSubtract(amount, this.$tools.accMultiply(element.amount, element.money))
            // 计算发出多少
            quantityOut = this.$tools.accAdd(quantityOut, element.amount)
            amountOut = this.$tools.accAdd(amountOut, this.$tools.accMultiply(element.amount, element.money))
            // 添加出库到某某部门信息
            this.dataSource.push({
              num: element.outNum,
              date: element.date,
              info: `付${element.toDeptName}`,
              quantityPut: null,
              unitPricePut: null,
              amountPut: null,
              quantityOut: element.amount,
              unitPriceOut: element.money,
              amountOut: this.$tools.accMultiply(element.amount, element.money),
              quantity: null,
              unitPrice: null,
              amount: null
            })
            // 判断如果循环完毕了，就加一条‘本月合计’行
            if (r.data.length === index + 1) {
              this.dataSource.push({
                num: null,
                date: null,
                info: '本月合计',
                quantityPut: 0,
                unitPricePut: 0,
                amountPut: 0,
                quantityOut: quantityOut,
                unitPriceOut: this.storeroomItemDetailsInfoData.money,
                amountOut: amountOut,
                quantity: quantity,
                unitPrice: quantity === 0 ? 0 : this.storeroomItemDetailsInfoData.money,
                amount: amount
              })
              // 重置
              quantityOut = 0
              amountOut = 0
            }
          })
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }
  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>

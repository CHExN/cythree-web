<template>
  <a-modal
    title="固定资产验收信息"
    :centered="true"
    :width="1000"
    :visible="fixedAssetsAcceptanceInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false" style="margin-bottom: 32px">
        <detail-list>
          <detail-list-item term="项目名称">{{fixedAssetsAcceptanceInfoData.name}}</detail-list-item>
          <detail-list-item term="合同编号">{{fixedAssetsAcceptanceInfoData.num}}</detail-list-item>
          <detail-list-item term="项目负责人">{{fixedAssetsAcceptanceInfoData.manager}}</detail-list-item>
          <detail-list-item term="合同金额">{{$tools.addZero($tools.toNumFormant(fixedAssetsAcceptanceInfoData.money))}}</detail-list-item>
          <detail-list-item term="实际金额">{{$tools.addZero($tools.toNumFormant(fixedAssetsAcceptanceInfoData.moneyTrue))}}</detail-list-item>
          <detail-list-item term="资产存放地点">{{fixedAssetsAcceptanceInfoData.location}}</detail-list-item>
          <detail-list-item term="是否有与合同不符的情况">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isMatch)}}</detail-list-item>
          <detail-list-item term="资产适用性能是否达到要求">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isApplicability)}}</detail-list-item>
          <detail-list-item term="资产技术指标是否与合同相符">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isIndicators)}}</detail-list-item>
          <detail-list-item term="资产配件是否与采购要求相符">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isAccessories)}}</detail-list-item>
          <detail-list-item term="资产是否全新完好">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isNew)}}</detail-list-item>
          <detail-list-item term="技术文档是否齐全">{{getTrueOrFalse(fixedAssetsAcceptanceInfoData.isComplete)}}</detail-list-item>
          <detail-list-item term="资产在安装调试、试用过程中的情况">{{fixedAssetsAcceptanceInfoData.remarkO}}</detail-list-item>
          <detail-list-item term="备注">{{fixedAssetsAcceptanceInfoData.remark}}</detail-list-item>
          <detail-list-item term="安装完成日期">{{fixedAssetsAcceptanceInfoData.installCompleteDate}}</detail-list-item>
          <detail-list-item term="验收日期">{{fixedAssetsAcceptanceInfoData.acceptanceDate}}</detail-list-item>
          <detail-list-item term="验收结果">{{fixedAssetsAcceptanceInfoData.acceptanceResult}}</detail-list-item>
        </detail-list>
        <a-divider style="margin-bottom: 32px"/>
        <detail-list>
          <a-table ref="TableInfo"
                   :columns="columns"
                   :dataSource="dataSource"
                   :pagination="false"
                   :loading="loading"
                   rowKey="id">
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
  name: 'FixedAssetsAcceptanceInfo',
  props: {
    fixedAssetsAcceptanceInfoVisiable: {
      require: true,
      default: false
    },
    fixedAssetsAcceptanceInfoData: {
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
        title: '物品名称',
        dataIndex: 'name'
      }, {
        title: '型号',
        dataIndex: 'type'
      }, {
        title: '出库数量',
        dataIndex: 'amount'
      }, {
        title: '单位',
        dataIndex: 'unit'
      }, {
        title: '备注',
        dataIndex: 'remark'
      }, {
        title: '单价',
        dataIndex: 'money'
      }, {
        title: '收据',
        dataIndex: 'receipt'
      }, {
        title: '出库部门',
        dataIndex: 'toDeptName'
      }, {
        title: '出库单号',
        dataIndex: 'outNum'
      }]
    }
  },
  methods: {
    handleCancleClick () {
      this.loading = false
      this.$emit('close')
    },
    getTrueOrFalse (value) {
      if (value === '0') {
        return '否'
      } else if (value === '1') {
        return '是'
      }
      return value
    }
  },
  watch: {
    fixedAssetsAcceptanceInfoVisiable () {
      if (this.fixedAssetsAcceptanceInfoVisiable) {
        if (this.fixedAssetsAcceptanceInfoData.storeroomOutId) {
          this.dataSource = []
          this.loading = true
          this.$get('storeroomOut/storeroomByOutId', {
            outId: this.fixedAssetsAcceptanceInfoData.storeroomOutId
          }).then((r) => {
            this.loading = false
            this.dataSource = r.data
          })
        }
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

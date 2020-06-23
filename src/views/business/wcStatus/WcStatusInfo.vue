<template>
  <a-modal
    title="公厕状态信息"
    :centered="true"
    :width="1000"
    :visible="wcStatusInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <detail-list title="状态信息">
        <detail-list-item term="是否重点位置">{{getIsFocus(wcStatusInfoData.isFocus)}}</detail-list-item>
        <detail-list-item term="粪井满冒/关门日期">{{wcStatusInfoData.startDate}}</detail-list-item>
        <detail-list-item term="是否关门">{{getIsOpen(wcStatusInfoData.isOpen)}}</detail-list-item>
        <detail-list-item term="关门原因">{{wcStatusInfoData.status}}</detail-list-item>
        <detail-list-item term="井满是否通知三场">{{getIsNotice(wcStatusInfoData.isNotice)}}</detail-list-item>
        <detail-list-item term="通知三场日期">{{wcStatusInfoData.noticeDate}}</detail-list-item>
        <detail-list-item term="三场抽运/开门日期">{{wcStatusInfoData.endDate}}</detail-list-item>
        <detail-list-item term="关门天数">{{wcStatusInfoData.day}} 天</detail-list-item>
        <detail-list-item term="备注">{{wcStatusInfoData.remark}}</detail-list-item>
      </detail-list>
    </a-card>
    <a-card :bordered="false" :loading='loading'>
      <detail-list title="公厕基础信息">
        <detail-list-item term="公厕名称">{{wcInfoData.wcName}}</detail-list-item>
        <detail-list-item term="公厕编号">{{wcInfoData.wcNum}}</detail-list-item>
        <detail-list-item term="所属分队">{{wcInfoData.wcOwn}}</detail-list-item>
        <detail-list-item term="管理单位">{{wcInfoData.manageUnitToDict}}</detail-list-item>
        <detail-list-item term="种类">{{wcInfoData.wcKindToDict}}</detail-list-item>
        <detail-list-item term="管理形式">{{wcInfoData.manageTypeToDict}}</detail-list-item>
        <detail-list-item term="类别">{{wcInfoData.wcSortToDict}}</detail-list-item>
        <detail-list-item term="公厕现在状态">{{wcInfoData.wcNowStatus}}</detail-list-item>
      </detail-list>
      <a-divider style="margin-bottom: 32px"/>
      <detail-list title="公厕详细信息">
        <detail-list-item term="经度">{{wcInfoData.longitude}}</detail-list-item>
        <detail-list-item term="纬度">{{wcInfoData.latitude}}</detail-list-item>
        <detail-list-item term="建筑类型">{{wcInfoData.buildingTypeToDict}}</detail-list-item>
        <detail-list-item term="初建投资">{{wcInfoData.initialMoney}} 万元</detail-list-item>
        <detail-list-item term="建筑面积">{{wcInfoData.wcArea}} 平方米</detail-list-item>
        <detail-list-item term="指标状况">{{wcInfoData.indicatorStatus}}</detail-list-item>
        <detail-list-item term="投入使用日期">{{wcInfoData.useDate}}</detail-list-item>
        <detail-list-item term="接管日期">{{wcInfoData.replaceDate}}</detail-list-item>
        <detail-list-item term="开放时间">{{wcInfoData.openHour}}</detail-list-item>
        <detail-list-item term="所在区县">{{wcInfoData.DictrictToDict}}</detail-list-item>
        <detail-list-item term="所属街乡">{{wcInfoData.streetTown}}</detail-list-item>
        <detail-list-item term="建设方式">{{wcInfoData.buildingMethodToDict}}</detail-list-item>
        <detail-list-item term="男坑位数">{{wcInfoData.pitMale}}</detail-list-item>
        <detail-list-item term="女坑位数">{{wcInfoData.pitFemale}}</detail-list-item>
        <detail-list-item term="无性别数">{{wcInfoData.pitSexless}}</detail-list-item>
        <detail-list-item term="小便器数量">{{wcInfoData.urinalsNum}}</detail-list-item>
        <detail-list-item term="小便器长度">{{wcInfoData.urinalsLen}}</detail-list-item>
        <detail-list-item term="小便器类型">{{wcInfoData.urinalsType}}</detail-list-item>
        <detail-list-item term="导向牌数量">{{wcInfoData.indicatorNum}}</detail-list-item>
        <detail-list-item term="洗手盆数量">{{wcInfoData.sink}}</detail-list-item>
        <detail-list-item term="保洁人数">{{wcInfoData.clranNum}}</detail-list-item>
        <detail-list-item term="粪便处理方式">{{wcInfoData.fecalMethod}}</detail-list-item>
        <detail-list-item term="作业方式">{{wcInfoData.assignmentStyle}}</detail-list-item>
        <detail-list-item term="冲洗方式">{{wcInfoData.flushingMethod}}</detail-list-item>
        <detail-list-item term="有无管理间">{{wcInfoData.isManageRoom}}</detail-list-item>
        <detail-list-item term="有无产权">{{wcInfoData.isPropertyRigth}}</detail-list-item>
        <detail-list-item term="有无标志牌">{{wcInfoData.siIndicator}}</detail-list-item>
        <detail-list-item term="五环内外">{{wcInfoData.is5thRing}}</detail-list-item>
        <detail-list-item term="有无无障碍设施">{{wcInfoData.isAccessibility}}</detail-list-item>
        <detail-list-item term="有无残疾间">{{wcInfoData.isDisabledRoom}}</detail-list-item>
        <detail-list-item term="公厕详细地址">{{wcInfoData.wcAddress}}</detail-list-item>
      </detail-list>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: { DetailListItem, DetailList },
  name: 'WcStatusInfo',
  props: {
    wcStatusInfoVisiable: {
      require: true,
      default: false
    },
    wcStatusInfoData: {
      require: true
    }
  },
  data () {
    return {
      loading: false,
      wcInfoData: {}
    }
  },
  methods: {
    handleCancleClick () {
      this.wcInfoData = {}
      this.$emit('close')
    },
    getIsFocus (isFocus) {
      if (isFocus === '1') {
        return '是'
      } else {
        return '否'
      }
    },
    getIsOpen (isOpen) {
      if (isOpen === '1') {
        return '开门'
      } else {
        return '关门'
      }
    },
    getIsNotice (isNotice) {
      if (isNotice === '1') {
        return '通知'
      } else {
        return '不通知'
      }
    }
  },
  watch: {
    wcStatusInfoVisiable () {
      if (!this.wcStatusInfoVisiable) return
      this.loading = true
      this.$get('wc/selectOne', {
        wcId: this.wcStatusInfoData.wcId
      }).then((r) => {
        if (r.data) {
          this.wcInfoData = r.data
          this.$get('dict/cy_wc', {
          }).then((r) => {
            this.loading = false
            let dictList = {}
            // 对象版
            r.data.forEach((item) => {
              let fieldName = this.$tools.toHump(item.fieldName.toLowerCase())
              if (dictList[fieldName]) {
                dictList[fieldName][item.keyy] = item.valuee
              } else {
                dictList[fieldName] = {[item.keyy]: item.valuee}
              }
            })
            Object.keys(dictList).forEach(key => {
              this.wcInfoData[key + 'ToDict'] = dictList[key][this.wcInfoData[key]]
            })
          })
        }
      })
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

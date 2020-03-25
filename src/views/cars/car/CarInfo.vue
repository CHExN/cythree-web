<template>
  <a-modal
    title="车辆信息"
    :centered="true"
    :width="850"
    :visible="carInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list>
          <detail-list-item term="车牌号">{{carInfoData.carNum}}</detail-list-item>
          <detail-list-item term="车辆年龄">{{$tools.getAge(carInfoData.date)}}</detail-list-item>
          <detail-list-item term="车牌颜色">{{getColor(carInfoData.color)}}</detail-list-item>
          <detail-list-item term="车辆品牌">{{carInfoData.carType}}</detail-list-item>
          <detail-list-item term="汽车排量">{{carInfoData.carDisplacement}}</detail-list-item>
          <detail-list-item term="车辆种类">{{carInfoData.carKind}}</detail-list-item>
          <detail-list-item term="车辆日期">{{carInfoData.date}}</detail-list-item>
          <detail-list-item term="车辆用途">{{carInfoData.carUse}}</detail-list-item>
          <detail-list-item term="车辆使用单位">{{carInfoData.carUseUnit}}</detail-list-item>
          <detail-list-item term="车辆所属单位">{{carInfoData.carUnit}}</detail-list-item>
          <detail-list-item term="原始牌照">{{carInfoData.carNumOld}}</detail-list-item>
          <detail-list-item term="备注">{{carInfoData.remark}}</detail-list-item>
          <detail-list-item term="车辆状态">{{getStatus(carInfoData.status)}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'CarInfo',
  props: {
    carInfoVisiable: {
      require: true,
      default: false
    },
    carInfoData: {
      require: true
    }
  },
  data () {
    return {}
  },
  methods: {
    getStatus (status) {
      if (status === '1') {
        return '行驶'
      } else if (status === '2') {
        return '停驶'
      }
    },
    getColor (color) {
      if (color === '1') {
        return '黄'
      } else if (color === '2') {
        return '蓝'
      }
    },
    handleCancleClick () {
      this.$emit('close')
    // },
    // getAge (birthday) {
    //   let age
    //   const birthdayArr = new Date(birthday)
    //   const birthdayYear = birthdayArr.getFullYear()
    //   const birthdayMonth = birthdayArr.getMonth() + 1
    //   const birthdayDay = birthdayArr.getDate()
    //   const today = new Date()
    //   const nowYear = today.getFullYear()
    //   const nowMonth = today.getMonth() + 1
    //   const nowDay = today.getDate()
    //   if (nowYear === birthdayYear) {
    //     age = 0 // 同年 则为0岁
    //   } else {
    //     const ageDiff = nowYear - birthdayYear // 年之差
    //     if (ageDiff > 0) {
    //       if (nowMonth === birthdayMonth) {
    //         const dayDiff = nowDay - birthdayDay // 日之差
    //         age = dayDiff < 0 ? ageDiff - 1 : ageDiff
    //       } else {
    //         const monthDiff = nowMonth - birthdayMonth // 月之差
    //         age = monthDiff < 0 ? ageDiff - 1 : ageDiff
    //       }
    //     } else {
    //       age = '未知' // 返回-1 表示出生日期输入错误 晚于今天
    //     }
    //   }
    //   return age // 返回周岁年龄
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

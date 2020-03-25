<template>
  <a-modal
    title="职工慰问管理单信息"
    :centered="true"
    :width="800"
    :visible="condolencesInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
      <a-card :bordered="false">
        <detail-list title="基础信息">
          <detail-list-item term="职工姓名">{{condolencesInfoData.name}}</detail-list-item>
          <detail-list-item term="性别">{{getSexx(condolencesInfoData.sexx)}}</detail-list-item>
          <detail-list-item term="年龄">{{condolencesInfoData.age}}</detail-list-item>
          <detail-list-item term="联系电话">{{condolencesInfoData.phone}}</detail-list-item>
          <detail-list-item term="地址">{{condolencesInfoData.address}}</detail-list-item>
          <detail-list-item term="情况说明">{{condolencesInfoData.text}}</detail-list-item>
        </detail-list>
      </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'

const DetailListItem = DetailList.Item
export default {
  components: {DetailListItem, DetailList},
  name: 'CondolencesInfo',
  props: {
    condolencesInfoVisiable: {
      require: true,
      default: false
    },
    condolencesInfoData: {
      require: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    getSexx (sexx) {
      if (sexx === '1') {
        return '男'
      } else if (sexx === '2') {
        return '女'
      }
      return sexx
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

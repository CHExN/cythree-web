<template>
  <a-modal
    title="介绍信信息"
    :centered="true"
    :width="800"
    :visible="letterInfoVisiable"
    :keyboard="false"
    :footer="null"
    @cancel="handleCancleClick">
    <a-card :bordered="false">
      <a-steps progressDot :current="current" :status='status'>
        <a-step title="创建">
          <a-step-item-group slot="description">
            <a-step-item :title="letterInfoData.createDate" style="cursor: default;"/>
          </a-step-item-group>
        </a-step>
        <template v-for="(username, index) in reviewList">
          <a-step :title="processEnglishToChinese(index)" :key="index">
            <a-step-item-group slot="description">
              <a-step-item
                v-if="current === index + 1 && letterInfoData.process === 0 && username !== user.username"
                title="催一下"
                icon="bell"
                v-on:click.native="bell(username)"
              />
              <a-step-item
                v-else-if="current > index + 1 || letterInfoData.process === 1"
                title="审核通过"
                icon="check-circle"
                style="cursor: default;"
              />
              <a-step-item
                v-else-if="current === index + 1 && letterInfoData.process === -1"
                title="审核未通过"
                icon="exclamation-circle"
                style="cursor: default;"
              />
            </a-step-item-group>
          </a-step>
        </template>
        <a-step title="完成"></a-step>
      </a-steps>
      <a-divider/>
      <detail-list>
        <detail-list-item term="部门">{{letterInfoData.deptName}}</detail-list-item>
        <detail-list-item term="备注">{{letterInfoData.remark}}</detail-list-item>
        <detail-list-item term="介绍信人">{{letterInfoData.letterUser}}</detail-list-item>
      </detail-list>
      <a-upload :multiple="true" :fileList="fileList"/>
    </a-card>
  </a-modal>
</template>
<script>
import DetailList from '@/components/tool/DetailList'
import AStepItem from '../../../components/tool/AStepItem'
import { mapState } from 'vuex'

const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

export default {
  components: { AStepItemGroup, AStepItem, DetailListItem, DetailList },
  name: 'LetterInfo',
  props: {
    letterInfoVisiable: {
      require: true,
      default: false
    },
    letterInfoData: {
      require: true
    }
  },
  data () {
    return {
      fileList: [],
      reviewList: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    current () {
      if (this.letterInfoData.process === -1) {
        return this.letterInfoData.step
      }
      return this.letterInfoData.step + this.letterInfoData.process
    },
    status () {
      if (this.letterInfoData.process === 1) { return 'finish' }
      if (this.letterInfoData.process === -1) { return 'error' }
      return 'process'
    }
  },
  methods: {
    handleCancleClick () {
      this.$emit('close')
    },
    processEnglishToChinese (index) {
      switch (index) {
        case 0:
          return '副职'
        case 1:
          return '正职'
        default:
          return index
      }
    },
    bell (username) {
      const message = `${this.user.username} 催了您一下介绍信人为 ${this.letterInfoData.letterUser} 的流程进度`
      this.$post('message', {
        'message': message,
        'sender': this.user.username,
        'senderDept': this.user.deptName,
        'addressee': username
      }).then((r) => {
        this.$message.success(`已向 ${username} 通知`)
      })
    }
  },
  watch: {
    letterInfoVisiable () {
      if (this.letterInfoVisiable) {
        this.reviewList = this.letterInfoData.review.split(',')
        this.$get('letter/letterFiles', {
          letterId: this.letterInfoData.letterId
        }).then((r) => {
          this.fileList = r.data.data
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

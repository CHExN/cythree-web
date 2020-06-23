<template>
  <div>
    <span @click="showDrawer" class="header-notice">
      <a-badge :count="readCount">
        <a-icon :class="['header-notice-icon', theme]" type="bell"/>
      </a-badge>
    </span>
    <a-drawer
      placement="right"
      width=380
      :closable="false"
      @close="onClose"
      :visible="noticeVisible"
    >
      <a-tabs :defaultActiveKey="tabKey" @change="callback">
        <a-tab-pane tab="未读" key="1">
          <a-list
            :loading="loading"
            itemLayout="horizontal"
            :dataSource="readNoticeData"
          >
            <div v-if="readCount-readIndex>0" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <a-spin v-if="loadingMore" />
              <a-button v-else @click="onLoadMore">loading more</a-button>
            </div>
            <a-list-item slot="renderItem" slot-scope="item" class="card">
              <a slot="actions" @click="shuttle(item)" title="已读" v-hasPermission="'message:update'">
                <a-icon type="eye"/>
              </a>
              <a-list-item-meta
                :description="timestampFormat(item.datetime) + (item.senderDept ? ' - ' + item.senderDept : '')"
              >
                <span slot="title">{{item.message}}</span>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-tab-pane>

        <a-tab-pane tab="已读" key="2" forceRender>
          <a-list
            :loading="loading"
            itemLayout="horizontal"
            :dataSource="unreadNoticeData"
          >
            <div v-if="unreadCount-unreadIndex>0" slot="loadMore" :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
              <a-spin v-if="loadingMore" />
              <a-button v-else @click="onLoadMore">loading more</a-button>
            </div>
            <a-list-item slot="renderItem" slot-scope="item" class="card">
              <a-list-item-meta
                :description="timestampFormat(item.datetime) + (item.senderDept ? ' - ' + item.senderDept : '')"
              >
                <span slot="title">{{item.message}}</span>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-tab-pane>
      </a-tabs>

    </a-drawer>
  </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import { mapState } from 'vuex'

export default {
  name: 'HeaderNotice',
  computed: {
    ...mapState({
      user: state => state.account.user
    }),
    theme () {
      return this.$store.state.setting.layout === 'side' ? 'light' : this.$store.state.setting.theme
    }
  },
  data () {
    return {
      loading: false,
      noticeVisible: false,
      readNoticeData: [],
      unreadNoticeData: [],
      loadingMore: false,
      showLoadingMore: true,
      tabKey: '1',
      readCount: 0,
      readIndex: 0,
      unreadCount: 0,
      unreadIndex: 0
    }
  },
  mounted () {
    this.connect()
    this.fetchCount(1, (count) => {
      this.readCount = count
    })
    this.fetchCount(2, (count) => {
      this.unreadCount = count
    })
  },
  methods: {
    fetch () {
      const noticeName = this.tabKey === '1' ? 'read' : 'unread'
      this.loading = true
      this.$get('message', {
        index: 0,
        status: this.tabKey
      }).then((res) => {
        this.loading = false
        this[noticeName + 'NoticeData'] = res.data.data
        this[noticeName + 'Index'] = this[noticeName + 'NoticeData'].length
      })
    },
    fetchCount (status, callback) {
      this.$get('message/readCount', {
        status
      }).then((r) => {
        callback(r.data)
      })
    },
    onLoadMore () {
      const noticeName = this.tabKey === '1' ? 'read' : 'unread'
      this.loadingMore = true
      this.$get('message', {
        index: this[noticeName + 'Index'],
        status: this.tabKey
      }).then((res) => {
        this.loadingMore = false
        this[noticeName + 'NoticeData'] = this[noticeName + 'NoticeData'].concat(res.data.data)
        this[noticeName + 'Index'] = this[noticeName + 'NoticeData'].length
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'))
        })
      })
    },
    showDrawer () {
      this.noticeVisible = true
    },
    onClose () {
      this.noticeVisible = false
    },
    connect () {
      // this.socket = new SockJS('http://localhost:9527/webSocketHandshake')
      this.socket = new SockJS('http://114.115.154.244:9527/webSocketHandshake')
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.debug = () => {} // 禁用调试功能，将调试更改为空函数
      this.stompClient.connect(
        {},
        frame => {
          this.stompClient.subscribe(`/user/${this.user.username}/oneToOne/greetings`, tick => {
            this.readCount++
            const newMessage = JSON.parse(tick.body)
            if (this.readNoticeData.length !== 0) {
              this.readNoticeData.unshift(newMessage)
            }
            const key = `open${Date.now()}`
            this.$notification.open({
              message: (newMessage.senderDept ? newMessage.senderDept + ' - ' : '') + newMessage.sender,
              description: newMessage.message,
              placement: 'topLeft',
              bottom: '50px',
              btn: (h) => {
                return h('a-button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$notification.close(key)
                      this.shuttle(newMessage)
                    }
                  }
                }, '已读')
              },
              key
            })
          })
        },
        error => {
          console.log(error)
          // this.$notification.error({
          //   message: '系统提醒',
          //   description: '检测到浏览器残余内存垃圾超过 500Mb, 建议按 Ctrl+R 自动清理并刷新页面'
          // })
        }
      )
    },
    shuttle (item) {
      this.$put('message', {
        id: item.id
      }).then((r) => {
        this.readNoticeData.splice(this.readNoticeData.indexOf(item), 1)
        this.unreadNoticeData.unshift(item)
        this.readCount--
        this.unreadCount++
      })
    },
    timestampFormat (parDate) {
      function zeroize (num) {
        return (String(num).length === 1 ? '0' : '') + num
      }

      let timestamp = parseInt(new Date(parDate).getTime() / 1000)
      let curTimestamp = parseInt(new Date().getTime() / 1000)
      let timestampDiff = curTimestamp - timestamp

      let curDate = new Date(curTimestamp * 1000) // 当前时间日期对象
      let tmDate = new Date(timestamp * 1000) // 参数时间戳转换成的日期对象

      let Y = tmDate.getFullYear()
      let m = tmDate.getMonth() + 1
      let d = tmDate.getDate()
      let H = tmDate.getHours()
      let i = tmDate.getMinutes()
      // let s = tmDate.getSeconds()

      if (timestampDiff < 60) { // 一分钟以内
        return '刚刚'
      } else if (timestampDiff < 3600) { // 一小时前之内
        return `${Math.floor(timestampDiff / 60)}分钟前`
      } else if (curDate.getFullYear() === Y && curDate.getMonth() + 1 === m && curDate.getDate() === d) {
        return `今天 ${zeroize(H)}:${zeroize(i)}`
      } else {
        const newDate = new Date((curTimestamp - 86400) * 1000) // 参数中的时间戳加一天转换成的日期对象
        if (newDate.getFullYear() === Y && newDate.getMonth() + 1 === m && newDate.getDate() === d) {
          return `昨天 ${zeroize(H)}:${zeroize(i)}`
        } else if (curDate.getFullYear() === Y) {
          return `${zeroize(m)}月${zeroize(d)}日 ${zeroize(H)}:${zeroize(i)}`
        } else {
          return `${Y}年${zeroize(m)}月${zeroize(d)}日 ${zeroize(H)}:${zeroize(i)}`
        }
      }
    },
    callback (key) {
      this.tabKey = key
      if (this.tabKey === '1' && this.readCount !== 0) {
        this.fetch()
      }
      if (this.tabKey === '2' && this.unreadCount !== 0) {
        this.fetch()
      }
    }
  },
  watch: {
    noticeVisible () {
      if (this.noticeVisible) {
        if (this.tabKey === '1' && this.readNoticeData.length === 0 && this.readCount !== 0) {
          this.fetch()
        }
        if (this.tabKey === '2' && this.unreadNoticeData.length === 0 && this.unreadCount !== 0) {
          this.fetch()
        }
      }
    }
  }
}
</script>

<style lang="less">
  .header-notice{
    display: inline-block;
    transition: all 0.3s;
    span {
      vertical-align: initial;
    }
    .header-notice-icon{
      font-size: 16px;
      padding: 4px;
      &.dark{
        color: #fff;
      }
      &.light{
        color: rgba(0,0,0,.65);
      }
    }
  }
  .ant-dropdown-menu-container{
    box-shadow: 0 2px 8px rgba(0,0,0,.15);
  }
  .ant-list-item:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    border-color: rgba(0, 0, 0, 0.09);
    transition: all .2s ease-in-out;
  }
  .ant-list-something-after-last-item {
    widows: 100%;
  }
  .ant-list-item-meta-description {
    font-size:13px;
  }
</style>

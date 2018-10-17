<template>
  <div class="container">
  <open-data type="userAvatarUrl"></open-data>
  <open-data type="userNickName"></open-data>
  <!-- 需要使用 button 来授权登录 -->
  <button v-if="showButton" open-type="getUserInfo" lang="zh_CN" @getuserinfo="bindGetUserInfo">授权登录</button>
    <a href="/pages/counter/main" class="counter">去往Vuex示例页面</a>
  </div>
</template>

<script>
import store from '@/store';
export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      showButton:true
    }
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      wx.navigateTo({ url })
    },
    bindGetUserInfo (e) {
            var that = this;
      store
        .dispatch('authorize', { e: e })
        .then(res => {
          wx.hideLoading();
          
        })
        .catch(res => {
          wx.showToast({ title: res.msg, icon: 'none' });
        });
    }
  },
  mounted() {
    wx.hideShareMenu();
    wx.showLoading({
      title: '加载中',
      mask: true
    });
   let SET_AUTH_KEY = wx.getStorageSync('SET_AUTH_KEY');
   if(!SET_AUTH_KEY) return wx.hideLoading();
   this.showButton = false;wx.hideLoading()
  },
  onLoad() {
    // 查看是否授权
    // wx.getSetting({
    //   success (res){
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function(res) {
    //           //console.log(res.userInfo)
    //         }
    //       })
    //     }
    //   }
    // })
  },
  created () {
    // 调用应用实例的方法获取全局数据
    //this.getUserInfo()
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>

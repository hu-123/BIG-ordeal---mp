import {getAuthKey,getToken} from '@/services/login';
import {WxToPromise} from '@/utils';
 let oldAuthkey = null;
 const getNewAuthKey=()=>{
     return WxToPromise('login').then(res=>{
         let{code} = res;
         return getAuthKey({code});
     });
 }
 export const action_login = async ({commit,dispatch,state},payload)=>{
     let auth = state.auth;
     let {token,authkey} = auth;
     console.log(auth);
     const _login = async()=>{
         let res;
         if(payload && payload.login){
             res = await getNewAuthKey();
        }else if(authkey){
            res = await WxToPromise('checkSession')
            .then(res=>'')
            .catch(res=>{
                //session过期
            return getNewAuthKey();
            })
        }else{
            res = await getNewAuthKey();
        }
         commit('SET_AUTH_KEY',{authKey:res.data});
         return res;
     };
     return _login()
        .then(()=>{
            console.log('state.auth.userInfo',state.auth.userInfo)
            if(state.auth.userInfo) return state.auth.userInfo;
            return dispatch('action_getuserInfo',{lang:'zh_CN'});
        })
        .then(res=>{
            console.log('login',res)
            let { encryptedData , iv,rawData,signature} = res;
            //拿到解密信息以及login之后的session交个后台
            return getToken({
                data:{
                    encryptedData,
                    iv,
                    rawData:rawData,
                    signature:signature
                }
            });
        })
        .then(res=>{
            //成功拿到session交个后台解密成功----2018.10.16预留返回值处理
            console.log('token',res)
        })
        .catch(res=>{
            if(authkey) oldAuthkey = authkey;
            throw res;
        })
 }
 export const action_getUserInfo = ({commit},payload)=>{   //--获取用户信息存到‘SET_USER_INFO’
     return WxToPromise('getUserInfo',payload)
     .then(res=>{
         console.log('getuser1',res)
         commit('SET_USER_INFO',{userInfo:res});
         return res;
     })
     .catch(res=>{
        console.log(res);
         throw res;
     })
 }
 export const authorize = ({ commit, dispatch,state }, { e }) => {   //处理整个登录流程1.login拿code换session2.userinfo交解密数据给后台
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    if (e.mp.detail.userInfo) {
        console.log('e.mp.detail',e.mp.detail)
      commit('SET_USER_INFO', {
        userInfo: e.mp.detail ? e.mp.detail : {}
      });
      return dispatch('action_login')
        .then(res => {
          console.log(res);
          return Promise.resolve(res);
        })
        .catch(res => {
          return Promise.reject(res);
        });
    } else {
        //拒绝授权情况返回promise的错误状态
      wx.hideLoading();
      return Promise.reject({ msg: '请允许系统获取您的个人资料' });
    }
  };
  
  export const action_checkUserInfo = async (
    { commit, dispatch, state },
    payload
  ) => {
    return dispatch('action_getUserInfo')
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(() => {
        return Promise.reject({
          msg: '请允许系统获取您的个人资料'
        });
      });
  };
  
  export const action_checkSetting = async (
    { commit, dispatch, state },
    payload
  ) => {};
  
//   export const action_clearStorage = ({ commit }) => {
//     clearStorage(commit);
//   };
  
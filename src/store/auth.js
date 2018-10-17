import {WxToPromise} from '@/utils';
import {getAuthKey} from '@/services/login'
const state = {
    token:wx.getStorageSync('TOKEN_KEY')||'',
    userInfo:{},
    authKey:wx.getStorageSync('SET_AUTH_KEY')||'',
};
const mutations={
    ['TOKEN_KEY']:(state,{token})=>{
        state.token = token;
        wx.setStorageSync('TOKEN_KEY', token);
    },
    ['SET_USER_INFO']:(state,{userInfo})=>{
        state.userInfo = userInfo
    },
    ['SET_AUTH_KEY']:(state,{authKey})=>{
        console.log(authKey)
        state.authKey = authKey;
        wx.setStorageSync('SET_AUTH_KEY', authKey);
    }
};
const actions = {
    GetAuthKey({state,commit},payload){
        let {authKey} = state;
        let pro = authKey? WxToPromise('checkSession') : Promise.reject();
        return pro.catch(res=>{
            commit('SET_AUTH_KEY',{authKey:''});
            return WxToPromise('login')
            .then(res=>{
                let {code} = res;
                return getAuthKey({code});
            })
            .then(res=>{
                console.log(res)
                commit('SET_AUTH_KEY',{authKey:res.data});
            })
        })
    }   
};
export default {
    state,
    mutations,
    actions
}
import {WxToPromise} from '@/utils';
import store from '@/store';
export default function request(option={},mock){
    let {url,method = 'post',data={},header={}} =option;
    if(!url) return Promise.reject({msg:'请求地址有误'});
    let prefix = 'http://192.168.1.149:8080';
    url = prefix+url;
    return WxToPromise('request',{
        url,
        method,
        data,
        header:{
            'content-type':'application/x-www-form-urlencoded',
            'wxa-sessionId': store.getters.authKey,
            ...header
        },
        dataType:'json',
    }).then(
        res=>{
            let {data,code} = res;
            if(code == 203){ //处理vuex状态以及本地缓存都存在session但是header中不存在 ---2018.10.16
                wx.clearStorageSync();
                return Promise.reject(data);
            }
            return data;
        },
        res=>{
            if(mock) return mock;
            wx.showToast({
                title: '您的网络好像出了点问题嗷',
                icon: 'none',
            });
            return Promise.reject({});
        }
    )
}
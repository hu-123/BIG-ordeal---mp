import request from '@/utils/request';
import api from './api';
const {authKey,login} = api;
export function getAuthKey(data,mock){
    return request({
        url:authKey,
        method:'post',
        data
    },
    mock);
};
export function getToken(params,mock){
    let {data,header} = params;
    return request({
        url:login,
        method:'post',
        data,
        header
    },mock);
}
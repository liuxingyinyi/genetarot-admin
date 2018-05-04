/**
 * Created by 叶子 on 2017/7/30.
 * http通用工具函数
 */
import * as axios from "axios";
import {message} from "antd";
import {store} from "@/index";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import {hashHistory} from "react-router";
import {ACCESS_TOKEN, getCookie, OLD_ACCESS_TOKEN, REFRESH_TOKEN, setCookie, setToken} from "@/utils/Common";

const RELEASE_URL = 'http://www.ibix.gz.cn/pet-server';
const DEBUG_URL = 'http://192.168.1.160:6080/SmallShop';
export const baseUrl = RELEASE_URL;
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


function progressStart() {
    NProgress.start();
}

function progressDone() {
    NProgress.done();
}

/*between 0..1.*/
function progressSet(progress) {
    NProgress.set(progress);
}

/*标志位，避免重复拉取token*/
let isFetchingToken = false;

/*获取token，没有的拉取新token*/
const getToken = () => {
    return new Promise((resolve, reject) => {
        const token = getCookie(ACCESS_TOKEN);
        if (token) {
            resolve(token);
        } else {
            if (!isFetchingToken) {
                const {auth} = store.getState().httpData;
                const userData = auth.data || {};
                let {phone} = userData;
                const oldToken = getCookie(OLD_ACCESS_TOKEN);
                const refreshToken = getCookie(REFRESH_TOKEN);
                if (userData && oldToken && refreshToken) {
                    isFetchingToken = true;
                    httpRequest({
                        url: '/user/token', method: 'get', params: {
                            phone: phone,
                            token: oldToken,
                            refreshToken: refreshToken
                        }
                    }).then(data => {
                        setToken(data);
                        const {token} = data;
                        resolve(token);
                        return data.token;
                    }).finally(() => {
                        isFetchingToken = false;
                    });
                } else {
                    resolve('');
                    isFetchingToken = false;
                }
            } else {
                setTimeout(() => {
                    return getToken();
                }, 1000);
            }
        }
    });
};

/*
 http请求统一实现
 get : params 是object对象
 post : FormData对象
 */
const httpRequest = (requestData, headers = {}) => {
    message.destroy();
    let isOk = false;
    let http;
    const {url: url = '', method: method = 'get'} = requestData;
    let {params, body} = requestData;
    if (method === 'put') {
        if (params) {
            headers = {'Content-Type': 'application/x-www-form-urlencoded'};
        }
        if (body) {
            headers = {'Content-Type': 'application/json'};
        }
    }
    if (method === 'post') {
        if (params) {
            const format = new FormData();
            for (let temp in params) {
                let val = params[temp];
                if (params.hasOwnProperty(temp)) {
                    if (val instanceof Array) {
                        val.forEach((item) => {
                            format.append(temp, item);
                        })
                    } else {
                        format.append(temp, val);
                    }
                }
            }
            headers = {'Content-Type': 'form-data'};
            params = null;
            body = format;
        }
    }
    http = axios.request({
        url,
        method,
        params,
        data: body,
        headers,
        // `onUploadProgress` 允许为上传处理进度事件
        onUploadProgress: function (progressEvent) {
            // 对原生进度事件的处理
            const {loaded, total} = progressEvent;
            progressSet(loaded / total);
        },

        // `onDownloadProgress` 允许为下载处理进度事件
        onDownloadProgress: function (progressEvent) {
            // 对原生进度事件的处理
        },
    });
    progressStart();
    return new Promise((resolve, reject) => {
        http.then(function (response) {
            if (response.status === 200) {
                isOk = true;
            }
            return response.data;
        }).then(data => {
            const status = data.status;
            if (isOk && status === 0) {
                if (method !== 'get') {
                    message.success(data.message);
                }
                resolve(data.data);
            } else if (status === 401) {
                message.warn("身份验证失败，需要重新登录");
            } else {
                message.warn(data.message);
                reject(data);
            }
        }).catch(function (error) {
            const {response: response = {}} = error;
            const status = response.status;
            if (status === 401) {
                message.error("身份验证失败，请重新登录");
                hashHistory.push('/');
            } else if (status === 403) {
                message.error("没有相关权限");
            }
            reject(error);
        }).finally(function () {
            progressDone();
        });
    });
};

/*请求带上token校验*/
export const requestWithToken = requestData => {
    const {auth} = store.getState().httpData;
    const userData = auth.data;
    if (userData) {
        let {phone} = userData;
        return getToken().then(token => {
            const headers = {User_name: phone, Access_token: token};
            return request(requestData, headers);
        });
    }
};

/*get请求*/
export const get = (url, params) => {
    return request({url, params});
};


const request = (requestData, headers = {}) => getToken().then(token => httpRequest(requestData, headers));

export default request;

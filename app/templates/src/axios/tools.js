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
import Qs  from 'qs';
import {ACCESS_TOKEN, getCookie, OLD_ACCESS_TOKEN, REFRESH_TOKEN, setCookie, setToken} from "@/utils/Common";

const RELEASE_URL = '';
const DEBUG_URL = '';
export const baseUrl = DEBUG_URL;
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

/*
 http请求统一实现
 get : params 是object对象
 post : FormData对象
 */
const request = (requestData, headers = {}) => {
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
        paramsSerializer: function (params) {
            return Qs.stringify(params, {arrayFormat: 'repeat'})
        },
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
            if (isOk && status === 'SUCCESS') {
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

/*get请求*/
export const get = (url, params) => {
    return request({url, params});
};


export default request;

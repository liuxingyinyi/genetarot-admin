/**
 * Created by huotaol on 2017/12/27.
 */
import {store} from "@/index.js";


export const setCookie = data => {
    const {name, value, sec} = data;
    let saveData = name + '=' + value;
    if (sec) {
        const d = new Date();
        d.setTime(d.getTime() + (sec * 1000));
        const expires = "expires=" + d.toUTCString();
        saveData += '; ' + expires;
    }
    document.cookie = saveData;
};


export const getCookie = cname => {
    const name = cname + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) !== -1) return c.substring(name.length, c.length);
    }
    return null;
};

export const ACCESS_TOKEN = 'Access_token';
export const OLD_ACCESS_TOKEN = 'ola_access_token';
export const REFRESH_TOKEN = 'refreshToken';

export const setToken = data => {
    const {token, refreshToken} = data;
    if (token) {
        //设置比正常token过期时间短一点
        setCookie({name: ACCESS_TOKEN, value: token, sec: 540});
        //设置较长的过期时间，保存以供拉取新token
        setCookie({name: OLD_ACCESS_TOKEN, value: token});
    }
    if (refreshToken) {
        setCookie({name: REFRESH_TOKEN, value: refreshToken, sec: 600});
    }
};


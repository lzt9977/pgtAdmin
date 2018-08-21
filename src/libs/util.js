import axios from 'axios';
import env from '../config/env';
import qs from 'qs';

let util = {

};
util.title = function(title) {
    title = title ? title : 'iView project';
    window.document.title = title;
};





const ajaxUrl = env === 'development' ?
    'http://127.0.0.1:8888' :
    env === 'production' ?
    'https://www.url.com' :
    'https://debug.url.com';

util.ajax = axios.create({
    baseURL: ajaxUrl,
    timeout: 30000,
    dataType: "json",
    headers: {
        'Content-Type': 'application/json'
    }

});

util.post = function (url, data) {
    return util.ajax({
        url: 'http://localhost:8888' + url,
        method: 'post',//请求类型
        data: data
    })
    .then(response => {//成功
        return response;
    })
    .catch(error => {//失败
        return error;
    });
}



util.formatDateTime = function (inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();  
    var m = date.getMonth() + 1;  
    m = m < 10 ? ('0' + m) : m;  
    var d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;  
    second = second < 10 ? ('0' + second) : second; 
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;  
}




export default util;
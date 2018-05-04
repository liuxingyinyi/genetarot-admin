/**
 * Created by hao.cheng on 2017/4/28.
 */
// 获取url的参数
export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};


// 获取图片文件
const regExp = {
    'imgType': /\.jpg$|\.png$|\.jpeg$|\.gif$/
}
export const splitFiles = (files) => {
    if (!files) {
        return {};
    }
    const getFiles= (notImageFile) => {
        return files.filter((file) => {
            let key = file.local ? 'local' : 'name';
            return notImageFile ? !regExp.imgType.test(file[key]) : regExp.imgType.test(file[key]);
        });
    }
    return {
        // 获取图片文件数组
        getImageFiles: () =>{
            return getFiles();
        },
        // 获取非图片文件
        getFiles: () => {
            return getFiles(true);
        }
    }
}
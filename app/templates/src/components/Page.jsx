/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchData, receiveData} from "@/action";
import {get} from "@/axios/tools";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import {LocaleProvider} from "antd";

/*String增加模板字符替换功能*/
function replaceString() {
    String.prototype.format = function () {
        if (arguments.length === 0) return this;
        const obj = arguments[0];
        let s = this;
        for (let key in obj) {
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), obj[key]);
        }
        return s;
    }
};
replaceString();


class Page extends React.Component {

    componentDidMount() {
    }

    render() {
        return (
            <LocaleProvider locale={zh_CN}>
                <div style={{height: '100%'}}>
                    {this.props.children}
                </div>
            </LocaleProvider>
        )
    }
}

const mapStateToPorps = state => {
    const {auth, basicConfig} = state.httpData;
    return {auth, basicConfig};
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Page);
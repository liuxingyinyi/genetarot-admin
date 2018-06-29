/**自动拼接config中图片前缀
 * Created by huotaol on 2018/6/25.
 */
import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import {fetchData, receiveData} from "@/action";

class PicImg extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    render() {
        let {src, width, height} = this.props;
        const config = (this.props.config || {}).data;
        const basePicPrefix = config ? (config.basePicPrefix || '') : '';
        src = basePicPrefix + src;
        if (width && height) {
            src += '_' + width + '_' + height;
        }
        return (
            <img {...this.props} src={src}/>
        );
    }
}


const mapStateToPorps = state => {
    const {config} = state.httpData;
    return {config};
};


export default connect(mapStateToPorps)(Form.create()(PicImg));
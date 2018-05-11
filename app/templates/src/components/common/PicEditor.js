/**
 * Created by huotaol on 2017/12/21.
 */
import React from "react";
import {Button, Form, Input, Modal} from "antd";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchData, receiveData} from "@/action";
import request, {get} from "@/axios/tools";

const FormItem = Form.Item;
const {TextArea} = Input;

class PicEditor extends React.Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this._postData(values);
            }
        });
    };

    _postData = body => {
        request({url: '/common/fileDescription', method: 'post', body}).then(data => {
            const temp = this.props.data;
            temp.name = body.name;
            temp.description = body.description;
            this._handleCancel();
        });
    };

    _handleCancel = () => {
        const {onCancel, form} = this.props;
        form.resetFields();
        onCancel();
    };

    render() {
        const {visible, form} = this.props;
        const {getFieldDecorator} = form;
        const data = this.props.data || {};
        return (
            <Modal
                visible={visible}
                title="图片编辑"
                footer={null}
                onCancel={this._handleCancel}
            >
                <img width={320} height={160} src={data.url}/>
                <Form onSubmit={this.handleSubmit}>
                    <FormItem >
                        {getFieldDecorator('id', {
                            rules: [{required: true, message: 'Please input the title of collection!'}],
                            initialValue: data.id
                        })(
                            <Input type='hidden'/>
                        )}
                    </FormItem>
                    <FormItem label={'名称'}>
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: '请输入名称'}],
                            initialValue: data.name
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label={'描述'}>
                        {getFieldDecorator('description', {
                            rules: [{required: false, message: '请输入描述'}],
                            initialValue: data.description
                        })(
                            <TextArea />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button"
                        >
                            提交
                        </Button>
                    </FormItem>
                </Form>
            </Modal>
        );
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


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(PicEditor));
/**
 * Created by hao.cheng on 2017/4/16.
 */
import React from "react";
import {Button, Form, Icon, Input} from "antd";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchData, receiveData} from "@/action";
import request from "@/axios/tools";
import {setCookie, setToken} from "@/utils/Common";

const FormItem = Form.Item;

class Login extends React.Component {
    componentWillMount() {
        // console.log(this.props)
        const {receiveData} = this.props;
        receiveData(null, 'auth');
    }

    componentWillReceiveProps(nextProps) {
        const {auth: nextAuth = {}} = nextProps;
        const {router} = this.props;
        if (nextAuth.data) {   // 判断是否登陆
            router.push('/app/index');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {receiveData} = this.props;
                request({url: '/user/adminLogin', body: values, method: 'post'}).then(data => {
                    localStorage.setItem('user', JSON.stringify(data));
                    setToken(data);
                    setCookie({name: 'phone', value: values.phone});
                    receiveData(data, 'auth');
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <span>登录</span>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '请输入电话号码!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder='请输入电话号码'/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: '请输入密码!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder='请输入密码'/>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button"
                                    style={{width: '100%'}}>
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>

        );
    }
}

const mapStateToPorps = state => {
    const {auth} = state.httpData;
    return {auth};
};
const mapDispatchToProps = dispatch => ({
    fetchData: bindActionCreators(fetchData, dispatch),
    receiveData: bindActionCreators(receiveData, dispatch)
});


export default connect(mapStateToPorps, mapDispatchToProps)(Form.create()(Login));
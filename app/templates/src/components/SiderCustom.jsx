/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, {Component} from "react";
import {Icon, Layout, Menu} from "antd";
import {Link} from "react-router";
import {connect} from "react-redux";
import {get, post} from "@/axios/tools";
const {Sider} = Layout;
const SubMenu = Menu.SubMenu;

class SiderCustom extends Component {
    state = {
        collapsed: false,
        mode: 'inline',
        openKey: '',
        selectedKey: '',
    };
    // 构造
    constructor(props) {
        super(props);
        this._requestMenu = this._requestMenu.bind(this);
    }

    componentDidMount() {
        this.setMenuOpen(this.props);
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
        this.setMenuOpen(nextProps)
    }

    setMenuOpen = props => {
        const {path} = props;
        this.setState({
            openKey: path.substr(0, path.lastIndexOf('/')),
            selectedKey: path
        });
    };
    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({
            collapsed,
            mode: collapsed ? 'vertical' : 'inline',
        });
    };
    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        console.log(this.state);
        const {popoverHide} = this.props;     // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
        popoverHide && popoverHide();
    };
    openMenu = v => {
        console.log(v);
        this.setState({
            openKey: v[v.length - 1]
        })
    };

    _requestMenu() {

    }

    render() {
        const {auth: auth = {data: {}}} = this.props;
        return (
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsed={this.props.collapsed}
                style={{overflowY: 'auto'}}
            >
                <div className="logo"/>
                <Menu
                    onClick={this.menuClick}
                    theme="dark"
                    mode={this.state.mode}
                    selectedKeys={[this.state.selectedKey]}
                    openKeys={[this.state.openKey]}
                    onOpenChange={this.openMenu}
                >
                    <Menu.Item key="/app/index">
                        <Link to={'/app/index'}><Icon type="home"/><span
                            className="nav-text">首页</span></Link>
                    </Menu.Item>
                    <SubMenu key="/app/food" title={<span><Icon type="switcher"/><span>用户管理</span></span>}>
                        <Menu.Item key="/app/user/check">
                            <Link to={'/app/user/check'}>
                                <span className="nav-text">用户审核</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>

                    <SubMenu key="/app/product" title={<span><Icon type="star-o"/><span>商品管理</span></span>}>
                        <Menu.Item key="/app/product/tagManager">
                            <Link
                                to={'/app/product/tagManager'}>
                                <span
                                    className="nav-text">标签管理</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/app/product/typeManager">
                            <Link
                                to={'/app/product/typeManager'}>
                                <span
                                    className="nav-text">类型管理</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/app/product/update">
                            <Link
                                to={'/app/product/update'}>
                                <span
                                    className="nav-text">添加/更新商品信息</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/app/product/list">
                            <Link
                                to={'/app/product/list'}>
                                <span
                                    className="nav-text">商品列表</span></Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="/app/order" title={<span><Icon type="idcard"/><span>订单</span></span>}>
                        <Menu.Item key="/app/order/manager">
                            <Link to={'/app/order/manager'}><span
                                className="nav-text">订单管理</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/app/order/detail">
                            <Link to={'/app/order/detail'}><span
                                className="nav-text">订单详情</span></Link>
                        </Menu.Item>
                        <Menu.Item key="/app/order/statistic">
                            <Link to={'/app/order/statistic'}><span
                                className="nav-text">订单统计</span></Link>
                        </Menu.Item>
                    </SubMenu>
                    {/*<SubMenu key="/app/util" title={<span><Icon type="idcard"/><span>常用工具</span></span>}>*/}
                    {/*/!*     <Menu.Item key="/app/util/courier">*/}
                    {/*<Link to={'/app/util/courier'}><span*/}
                    {/*className="nav-text">更新快递</span></Link>*/}
                    {/*</Menu.Item>*!/*/}
                    {/*</SubMenu>*/}
                </Menu>
                <style>
                    {`
                    #nprogress .spinner{
                        left: ${this.state.collapsed ? '70px' : '206px'};
                        right: 0 !important;
                    }
                    `}
                </style>
            </Sider>
        )
    }
}

const mapStateToPorps = state => {
    const {auth = {data: {}}} = state.httpData;
    return {auth};
};

export default connect(mapStateToPorps)(SiderCustom);
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
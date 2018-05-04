/**
 * Created by 叶子 on 2017/8/13.
 */
import React, {Component} from "react";
import {hashHistory, IndexRedirect, Route, Router} from "react-router";
import App from "../App";
import Page from "../components/Page";
import Login from "../components/pages/Login";
import NotFound from "../components/pages/NotFound";
import IndexPage from "@/components/pages/IndexPage";
import UserCheck from "@/components/pages/UserCheck";
import UpdateProduct from "@/components/pages/UpdateProduct";
import ProductTypeManager from "@/components/pages/ProductTypeManager";
import ProductList from "@/components/pages/ProductList";
import ProductTagManager from "@/components/pages/ProductTagManager";
import OrderManager from "@/components/pages/OrderManager";
import OrderDetail from "@/components/pages/OrderDetail";
import OrderStatistic from "@/components/pages/OrderStatistic";


export default class CRouter extends Component {
    requireAuth = (permission, component) => {
        const {store} = this.props;
        const {auth} = store.getState().httpData;
        if (!auth || !auth.data.permissions.includes(permission)) window.location.hash = '/404';
        return component;
    };
    requireLogin = (nextState, replace) => {
        const {store} = this.props;
        const {auth} = store.getState().httpData;
        if (!auth || !auth.data) {
            //只有登录后才能访问，避免用户直接访问app
            replace({pathname: '/'})
        }
    };

    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="login"/>
                    <Route path={'login'} components={Login}/>
                    <Route path={'app'} component={App}>
                        <Route path={'index'} component={IndexPage}/>
                        <Route path={"user"}>
                            <Route path={"check"} component={UserCheck}/>
                        </Route>
                        <Route path={'product'}>
                            <Route path={'tagManager'} component={ProductTagManager}/>
                            <Route path={'typeManager'} component={ProductTypeManager}/>
                            <Route path={'update'} component={UpdateProduct}/>
                            <Route path={'list'} component={ProductList}/>
                        </Route>
                        <Route path={'order'}>
                            <Route path={'manager'} component={OrderManager}/>
                            <Route path={'detail'} component={OrderDetail}/>
                            <Route path={'statistic'} component={OrderStatistic}/>
                        </Route>
                        <Route path={'util'}>
                        </Route>
                    </Route>
                </Route>
                <Route path={'*'} component={NotFound}/>
            </Router>
        )
    }
}
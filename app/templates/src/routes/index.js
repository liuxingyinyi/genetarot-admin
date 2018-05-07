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
                        {/*       <Route path={"user"}>
                            <Route path={"check"} component={UserCheck}/>
                         </Route>*/}
                    </Route>
                </Route>
                <Route path={'*'} component={NotFound}/>
            </Router>
        )
    }
}
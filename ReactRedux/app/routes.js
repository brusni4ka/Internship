/**
 * Created by kate on 26/12/16.
 */
import Home from './containers/Home';
import App from './containers/App';
import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router'
import StudentsLayout from './containers/StudentsLayout' ;
import NotFound from './components/NotFound' ;


export const Routes = (
    <Route path='/' component={App}>
        <IndexRoute component={Home}/>
        <Route path='students' component={StudentsLayout}/>
        <Route path='*' component={NotFound} />
    </Route>
);



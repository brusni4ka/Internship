/**
 * Created by kate on 19/12/16.
 */
import React, {Component} from 'react';
import Header from '../components/header';


const App = (props) => (

    <div>
        <Header className="main-nav"/>
        <main className="container">
            {props.children}
        </main>
    </div>

);

export default App;
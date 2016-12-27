/**
 * Created by kate on 26/12/16.
 */
import { Link } from 'react-router';
import React, {Component} from 'react';

const Header = ()=>(
    <nav className="navbar navbar-default">
        <div className="container-fluid">
            <ul className="nav navbar-nav pull-right">
                <li><Link to="/">Login</Link></li>
                <li><Link to="/students">Students</Link></li>
            </ul>
        </div>
    </nav>
);


export default Header;


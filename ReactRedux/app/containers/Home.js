/**
 * Created by kate on 26/12/16.
 */
import React, {Component, PropTypes} from 'react';
import Login from '../components/LoginForm';
import {connect} from 'react-redux';
import { loginUser,logoutUser } from '../action/actions';
import {bindActionCreators} from 'redux'

class Home extends Component {

    onClickHandler(e){
        e.preventDefault();
        this.props.logoutUser();
    }
    render() {
        const Greet = (
                <h1>Press to logout <a href="" onClick={(e)=>this.onClickHandler(e)}>Logout</a></h1>
        );

        const node = this.props.user.isAuthenticated ? Greet : <Login onUserLogin={ this.props.loginUser }/>;
        return (
            <div>
                {node}
            </div>
        )
    }
}


const mapStateToProps = ({user})=>({
    user
});

const mapDispatchToProps = (dispatch)=> (
    bindActionCreators( {loginUser, logoutUser},  dispatch)
);

Home.propTypes = {
    loginUser: PropTypes.func,
    logoutUser: PropTypes.func,
    user: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Home)


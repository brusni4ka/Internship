/**
 * Created by kate on 26/12/16.
 */
import React, {Component, PropTypes} from 'react';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            login: '',
            password: ''
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        const {login, password} = this.state;
        const creds = {username: login.trim(), password: password.trim()};
        this.props.loginUser(creds);
    }

    onChangeHandler(e, key) {
        this.setState({[key]: e.target.value});
    }

    render() {
        debugger;

        const {message = ''} = this.props;
        return (
            <div className='sign-in-page'>
                <h2>Login</h2>
                <form className='form-signin' onSubmit={(e)=>this.handleSubmit(e)}>
                    <div>
                        <label className="sr-only" htmlFor="login"> Login</label>
                        <input onChange={(e)=>this.onChangeHandler(e,'login')} name="login"
                               className="form-control" type='text'
                               placeholder='Login'/>
                    </div>
                    <div>
                        <label className="sr-only" htmlFor="password"> Password </label>
                        <input onChange={(e)=>this.onChangeHandler(e,'password')} name="password"
                               className="form-control" type='password' placeholder='Password'/>
                    </div>
                    <button className="btn btn-lg btn-primary btn-block" type='submit'>Sign in</button>
                    { message && <div className="alert alert-danger">{message}</div> }
                </form>
            </div>
        )
    }

}

Login.propTypes = {
    loginUser: PropTypes.func,
    message: PropTypes.string
};

export default Login;


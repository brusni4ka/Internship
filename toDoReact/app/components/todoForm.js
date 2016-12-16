/**
 * Created by kate on 15/12/16.
 */
import React, {Component} from 'react';
export class TodoForm extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''};
    }

    handleChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit() {
        this.setState({text: ''});
    }

    render() {
        const {handleSubmit} = this.props;
        return (
            <form className="main-todo-form" onSubmit={ (e)=>this.handleSubmit( handleSubmit( e, this.state.text))}>
                <input type="text" placeholder="Enter todo task..." onChange={ (e)=>this.handleChange(e) } value={ this.state.text}/>
                <button className="fa fa-plus add-btn" aria-hidden="true"></button>
            </form>
        );
    }
}

TodoForm.propTypes = {
    handleSubmit: React.PropTypes.func
};



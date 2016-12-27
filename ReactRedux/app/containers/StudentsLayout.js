/**
 * Created by kate on 26/12/16.
 */
import React, {Component, PropTypes} from 'react';
import Table from './Table';
import Form from './Form'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router'


class StudentsLayout extends Component {

    constructor() {
        super();
        this.state = {
            formIsOpen: false,
            editable: null
        }

    }

    onEdit(id) {
        this.setState({editable: id, formIsOpen: true});
    }

    onSaveChanges() {
        this.setState({editable: null, formIsOpen: false});
    }

    triggerModal() {
        this.setState({formIsOpen: !this.state.formIsOpen});
    }

    componentWillMount() {
        // Check that the user is logged in before the component mounts
        if (!this.props.user.isAuthenticated) {
            browserHistory.push('/');
        }
    };


    render() {
        return (
            <div>
                <Table onEdit={(id)=>this.onEdit(id)}/>
                <MuiThemeProvider muiTheme={getMuiTheme()}>
                    <Form onSaveChanges={()=>{this.onSaveChanges()}}
                          editable={this.state.editable}
                          formIsOpen={this.state.formIsOpen}
                          triggerModal={()=>this.triggerModal()}
                    />
                </MuiThemeProvider>
            </div>
        );
    }

}

const mapStateToProps = ({user})=>({
    user
});

StudentsLayout.propTypes = {
    user: PropTypes.object
};

export default connect(mapStateToProps)(StudentsLayout)




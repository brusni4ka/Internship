/**
 * Created by kate on 26/12/16.
 */
import React, {Component, PropTypes} from 'react';
import Table from '../components/table';
import Form from './Form'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {remove} from '../action/actions';
import {bindActionCreators} from 'redux'



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
                <Table
                    onEdit={(id)=>this.onEdit(id)}
                    onDelete={this.props.remove}
                    elements={this.props.elements}
                />
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

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({remove}, dispatch)
);


const mapStateToProps = ({user, students})=>({
    user,
    elements: students.elements
});


StudentsLayout.propTypes = {
    user: PropTypes.object,
    remove: PropTypes.func,
    onEdit: PropTypes.func,
    elements: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentsLayout)




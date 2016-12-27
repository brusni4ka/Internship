import React, {Component, PropTypes} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {connect} from 'react-redux';
import {save, edit} from '../action/studentsAction';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {bindActionCreators} from 'redux'
injectTapEventPlugin();

class Form extends Component {

    constructor() {
        super();
        this.state = {
            name: '',
            department: '',
            status: '',
            error: false
        };

        this.requiredFields = [
            'name',
            'department'
        ];
    }

    validate() {
        let error = false;
        this.requiredFields.forEach((el)=> {
            if (this.state.hasOwnProperty(el)) {
                if (this.state[el] === '') {
                    error = true;
                    return false;
                }
            }
        });
        this.setState({error});
        if (!error) {
            return true;
        }
    }

    stateToInit() {
        this.setState({
            name: '',
            department: '',
            status: '',
            errorFields: [],
            error: false
        });
    }

    handleSubmit(callback) {
        const {name, department, status} = this.state;
        const newStudent = {
            name,
            department,
            status
        };
        this.stateToInit();
        callback(newStudent);
    }

    handleSubmitClick(elem) {
        const {editable, saveChanges} = this.props;
        if (editable) {
            saveChanges();
            this.handleEdit(edit, elem);
        } else {
            if (!this.validate() || this.state.error) {
                return;
            }
            saveChanges();
            this.handleSubmit(save);
        }

    }

    handleEdit(callback, elem) {
        const {name, department, status} = this.state;
        const editStudent = {
            id: elem.id,
            name: name == '' ? elem.name : name,
            department: department == '' ? elem.department : department,
            status: status == '' ? elem.status : status
        };
        this.stateToInit();
        callback(editStudent);
    }

    render() {
        const {saveChanges, editable, triggerModal, formIsOpen, elements} = this.props;
        let elem = {};

        if (editable) {
            elem = elements.filter(el=>el.id === editable)[0];
        }

        const {name, department, status, id} = elem;

        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onClick={()=>{
                this.stateToInit();
                saveChanges();
                }
                }

            />,
            <FlatButton
                label="Submit"
                primary={true}
                type="submit"
                keyboardFocused={!this.state.error}
                onClick={(elem)=>this.handleSubmitClick(elem)}
            />
        ];
        
        return (
            <div>
                <RaisedButton label="add student" onClick={()=>triggerModal()}/>
                <Dialog
                    title="Dialog With Actions"
                    actions={actions}
                    modal={false}
                    open={formIsOpen}
                >
                    <form>
                        <div>
                            <TextField
                                errorText={ this.state.error && this.state.name.trim()===''?
                                'This field is required':''
                                }
                                hintText='Jack Ruffus'
                                floatingLabelText='Name'
                                floatingLabelFixed={true}
                                fullWidth={true}
                                defaultValue={this.state.name || name}
                                onChange={(e,name)=>{ this.setState( {name})}}

                            />
                        </div>
                        <div>
                            <TextField
                                errorText={this.state.error && this.state.department.trim()===''?
                                'This field is required':''
                                }
                                hintText='Economic department'
                                floatingLabelText='Department'
                                floatingLabelFixed={true}
                                fullWidth={true}
                                defaultValue={this.state.department || department}
                                onChange={(e,department)=>{ this.setState( {department })}}
                            />
                        </div>
                        <div>
                            <SelectField
                                floatingLabelText="Student's status"
                                value={this.state.status || status}
                                fullWidth={true}
                                onChange={(event,index,status)=> this.setState({status})}
                            >
                                <MenuItem value={'approved'} primaryText="Approved"/>
                                <MenuItem value={'uncertain'} primaryText="Uncertain"/>
                                <MenuItem value={'rejected'} primaryText="Rejected"/>
                            </SelectField>
                        </div>
                    </form>
                </Dialog>
            </div>
        );
    }
}

const mapStateToProps = ({students})=>({
    elements: students.elements
});

const mapDispatchToProps = (dispatch)=> (
    bindActionCreators({save, edit}, dispatch)
);


Form.propTypes = {
    save: PropTypes.func,
    edit: PropTypes.func,
    saveChanges: PropTypes.func,
    triggerModal: PropTypes.func,
    editable: PropTypes.number,
    formIsOpen: PropTypes.bool,
    elements: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Form)

 
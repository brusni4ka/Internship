import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import {connect} from 'react-redux';
import {save, edit} from '../action/actions';
import injectTapEventPlugin from 'react-tap-event-plugin';


class Form extends Component {

    constructor(props) {
        super(props);
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
        injectTapEventPlugin();
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
        let newStudent = {
            name: this.state.name,
            department: this.state.department,
            status: this.state.status
        };
        this.stateToInit();
        callback(newStudent);
    }

    handleEdit(callback, elem) {
        let editStudent = {
            id: elem.id,
            name: this.state.name == '' ? elem.name : this.state.name,
            department: this.state.department == '' ? elem.department : this.state.department,
            status: this.state.status == '' ? elem.status : this.state.status
        };
        this.stateToInit();
        callback(editStudent);
    }


    render() {
        const {onSubmit, onEdit, onSaveChanges, editable, triggerModal, formIsOpen, elements} = this.props;
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
                onSaveChanges();
                }
                }

            />,
            <FlatButton
                label="Submit"
                primary={true}
                type="submit"
                keyboardFocused={true}
                onClick={()=>{
                if(editable){
                     onSaveChanges();
                     this.handleEdit(onEdit, elem);
                }else{
                     if (!this.validate() || this.state.error)return;
                     onSaveChanges();
                     this.handleSubmit(onSubmit);
                 }
                }}
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
                                errorText={this.state.error && this.state.name.trim()===''?
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
                                errorText={this.state.department && this.state.department.trim()===''?
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

const mapStateToProps = (state)=>({
    elements: state.students.elements
});

const mapDispatchToProps = (dispatch)=>({
    onSubmit: (value)=> {
        dispatch(save(value))
    },

    onEdit: (data)=> {
        dispatch(edit(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Form)

 
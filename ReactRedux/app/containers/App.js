/**
 * Created by kate on 19/12/16.
 */
import React, { Component } from 'react';
import Table from './Table';
import Form from './Form'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class App extends Component{
    constructor(props){
        super(props);
        this.state={
            formIsOpen: false,
            editable: null
        }
    }
    
    onEdit(id){
        this.setState({editable: id, formIsOpen:true});
    }

    onSaveChanges(){
        this.setState({editable: null, formIsOpen:false } );
    }
    
    triggerModal(){
        this.setState({formIsOpen: !this.state.formIsOpen});
    }

    render(){
        return (
            <div className='studentsTable'>
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

export default App;
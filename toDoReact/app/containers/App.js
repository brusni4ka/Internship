/**
 * Created by kate on 14/12/16.
 */
import React, {Component} from 'react';
import {TodoForm} from '../components/todoForm';
import {TodoList} from '../components/todoList';
import {TodoShowMode} from '../components/todoShowMode';


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {items: [], editing: null, show_mode: 'ALL'};
    }

    render() {
        return (
            <div className="todoApp">
                <TodoForm handleSubmit={ (e)=>this._handleSubmit(e) } />

                <TodoList items={this.state.items}
                          editing={this.state.editing}
                          handleDelete={(e)=>this._handleDelete(e)}
                          handleEdit={(e)=>this._handleEdit(e)}
                          handleChange={(e)=>this._handleChange(e)}
                          markCompleted={(e)=>this._markCompleted(e)}
                          saveEdit={(e)=>this._saveEdit(e)}
                          showMode={this.state.show_mode}
                />
                <TodoShowMode handleSetMode={(e)=>this._handleSetMode(e)} mode={this.state.show_mode}/>
            </div>
        );
    }

    _handleChange(e) {
        this.setState({text: e.target.value});
    }

    _handleSubmit({e,value}) {
        e.preventDefault();
        let text = value.trim();
        if (!text)return;
        let newItem = {
            text: text,
            id: Date.now(),
            done: false
        };
        this.setState(prevState => ({
            items: prevState.items.concat(newItem)
        }));
    }

    _handleDelete(todo) {
        const taskList = this.state.items.filter((task) => {
            return task.id !== todo.id;
        });

        this.setState({
            items: taskList
        });
    }

    _handleEdit(todo) {
        this.setState({editing: todo.id});
    }

    _saveEdit({e, id, todo}) {
        e.preventDefault();
        this.state.items.map((task) => {
            if (task.id == id)  task.text = todo;
        });

        this.setState({
            items: this.state.items,
            editing: null
        });
    }

    _markCompleted(todo) {
        this.state.items.map((task) => {
            if (task.id == todo.id)  task.done = !task.done;
        });

        this.setState({
            items: this.state.items
        });
    }

    _handleSetMode(e) {
        this.setState({show_mode: e.target.value});
    }

}


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
        this._handleChange = this._handleChange.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);
        this._handleDelete = this._handleDelete.bind(this);
        this._handleEdit = this._handleEdit.bind(this);
        this._markCompleted = this._markCompleted.bind(this);
        this._saveEdit = this._saveEdit.bind(this);
        this._handleSetMode = this._handleSetMode.bind(this);

        this.state = {items: [], editing: null, show_mode: 'ALL'};
    }

    render() {
        return (
            <div className="todoApp">
                <TodoForm handleSubmit={this._handleSubmit} />

                <TodoList items={this.state.items}
                          editing={this.state.editing}
                          handleDelete={this._handleDelete}
                          handleEdit={this._handleEdit}
                          handleChange={this._handleChange}
                          markCompleted={this._markCompleted}
                          saveEdit={this._saveEdit}
                          showMode={this.state.show_mode}
                />
                <TodoShowMode handleSetMode={this._handleSetMode} mode={this.state.show_mode}/>
            </div>
        );
    }

    _handleChange(e) {
        this.setState({text: e.target.value});
    }

    _handleSubmit(e,value) {
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
            if (task.id !== todo.id) return task;
        });

        this.setState({
            items: taskList
        });
    }

    _handleEdit(todo) {
        this.setState({editing: todo.id});
    }

    _saveEdit(e, id, todo) {

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


/**
 * Created by kate on 15/12/16.
 */
import React, {Component} from 'react';
export class TodoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {editText: props.todo};
    }

    handleChange(e) {
        this.setState({editText: e.target.value});
    }

    render() {
        const {
            todo,
            id,
            isDone,
            handleEdit,
            handleDelete,
            markCompleted,
            editing,
            saveEdit,
        } = this.props;

        let className = isDone ? 'todo-item done ' : 'todo-item undone';
        let node = '';

        if (id == editing) {
            node =
                <form onSubmit={(e)=>saveEdit({e:e, id:editing, todo: this.state.editText})}>
                    <input type="text" className="item_input"
                           value={ this.state.editText}
                           onChange={ (e)=>this.handleChange(e) }
                    />
                </form>
        } else {
            node = todo
        }
        return (
            <li className={ className } onDoubleClick={ handleEdit }>
                {node}
                <input type="checkbox" checked={isDone} onChange={ markCompleted }/>
                <button className="delete-btn delete_btn fa fa-trash" onClick={ handleDelete }/>
            </li>)
    }
}

TodoItem.propTypes = {
    todo: React.PropTypes.string,
    id: React.PropTypes.number,
    isDone:React.PropTypes.bool,
    handleDelete: React.PropTypes.func,
    handleEdit: React.PropTypes.func,
    markCompleted: React.PropTypes.func,
    saveEdit: React.PropTypes.func,
    editing: React.PropTypes.number
};



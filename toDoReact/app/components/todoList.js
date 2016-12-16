/**
 * Created by kate on 15/12/16.
 */
import React, {Component} from 'react';
import {TodoItem} from './todoItem';

export const TodoList = (props)=> {
    const {
        items,
        handleDelete,
        handleEdit,
        handleChange,
        markCompleted,
        saveEdit,
        editing,
        showMode
    } = props;

    const Items = items.map(item => {
        if (!item.text.trim())return;
        let toDo = <TodoItem key={item.id}
                             todo={item.text}
                             id={item.id}
                             isDone={item.done}
                             handleEdit={ (e)=>handleEdit(item) }
                             handleDelete={ (e)=>handleDelete(item) }
                             markCompleted={ (e)=>markCompleted(item)}
                             editing={ editing }
                             handleChange={ handleChange }
                             saveEdit={saveEdit}

        />;
        switch (showMode) {
            case 'ACTIVE':
                if (!item.done) {
                    return toDo;
                }
                break;
            case 'COMPLETED':
                if (item.done) {
                    return toDo;
                }
                break;
            default:
                return toDo;
        }

    });

    return (
        <div>
            <ul className="todo-list">
                {Items}
            </ul>
        </div>
    )
};


TodoList.propTypes = {
    items: React.PropTypes.array,
    handleDelete: React.PropTypes.func,
    handleEdit: React.PropTypes.func,
    handleChange: React.PropTypes.func,
    markCompleted: React.PropTypes.func,
    saveEdit: React.PropTypes.func,
    editing: React.PropTypes.number,
    showMode: React.PropTypes.string
};



 
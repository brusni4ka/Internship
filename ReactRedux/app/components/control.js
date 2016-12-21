/**
 * Created by kate on 19/12/16.
 */
import React, {Component} from 'react';

const Control = ({onEdit, onDelete}) => {
    return (
        <div>
            <span className="edit fa fa-pencil" onClick={onEdit} aria-hidden="true"/>
            <span className="delete fa fa-trash" onClick={onDelete} aria-hidden="true"/>
        </div>
    );
};

export default Control;
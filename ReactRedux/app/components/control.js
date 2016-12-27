/**
 * Created by kate on 19/12/16.
 */
import React, {Component,PropTypes} from 'react';

const Control = ({onEdit, onDelete}) => {
    return (
        <div>
            <span className="edit fa fa-pencil" onClick={onEdit} aria-hidden="true"/>
            <span className="delete fa fa-trash" onClick={onDelete} aria-hidden="true"/>
        </div>
    );
};

Control.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default Control;
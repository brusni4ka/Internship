/**
 * Created by kate on 19/12/16.
 */
import React, {Component, PropTypes} from 'react';
import TextField from 'material-ui/TextField';


const TableCell = ({type, children, isEdit}) => {
    let node = children;
    if (isEdit) {
        node = <TextField
            id="text-field-default"
            defaultValue="Default Value"
        />
    }
    let base = 'table-cell';
    let className = type ? type === 'status' ?
        `${base} ${base}-${type} ${children}`
        : `${base} ${base}-${type}`
        : base;

    return (
        <td className={className}>{node}</td>
    );
};

TableCell.propTypes = {
    type: PropTypes.string,
    children: PropTypes.node,
    isEdit: PropTypes.bool
};

export default TableCell;
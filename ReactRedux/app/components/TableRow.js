/**
 * Created by kate on 19/12/16.
 */
import React, {Component, PropTypes} from 'react';

import TableCell from './TableCell';
import Control from './Control';

const TableRow = ({element, onDelete, onEdit}) => {
    const className = `Table-row`;

    return (
        <tr className={className}>
            <TableCell type='id'>{element.id}</TableCell>
            <TableCell type='name'>{element.name}</TableCell>
            <TableCell type='department'>{element.department}</TableCell>
            <TableCell type='status'>{element.status}</TableCell>
            <TableCell><Control onEdit={onEdit} onDelete={onDelete}/></TableCell>
        </tr>
    );
};

TableRow.propTypes = {
    element: PropTypes.object,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
};

export default TableRow ;
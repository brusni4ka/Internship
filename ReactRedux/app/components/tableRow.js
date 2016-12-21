/**
 * Created by kate on 19/12/16.
 */
import React, {Component} from 'react';

import TableCell from './tableCell';
import Control from './control';

const TableRow = ({element, onDelete, onEdit}) => {
    let className = `Table-row`;

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


export default TableRow ;
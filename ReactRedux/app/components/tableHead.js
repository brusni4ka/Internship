/**
 * Created by kate on 19/12/16.
 */
import React, { Component } from 'react';
import HeadCell from './headCell';


const TableHead = () => {

    let className = 'Table-headCell';
    return (
        <thead>
        <tr>
            <th className={className}><h2>id</h2></th>
            <th className={className}><h2>name</h2></th>
            <th className={className}><h2>department</h2></th>
            <th className={className}><h2>status</h2></th>
        </tr>
        </thead>
    );
}

export default TableHead;
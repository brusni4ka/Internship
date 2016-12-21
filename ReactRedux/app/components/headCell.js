/**
 * Created by kate on 19/12/16.
 */
import React, { Component } from 'react';

const HeadCell = ({ name}) => {
    let className = 'Table-headCell';

    return (
        <th className={className}>{name}</th>
    );
}

export default HeadCell;
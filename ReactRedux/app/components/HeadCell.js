/**
 * Created by kate on 19/12/16.
 */
import React, { Component, PropTypes } from 'react';

const HeadCell = ({name}) => {
    let className = 'Table-headCell';

    return (
        <th className={className}>{name}</th>
    );
};

HeadCell.propTypes = {
    name: PropTypes.string
};
export default HeadCell;
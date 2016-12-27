/**
 * Created by kate on 19/12/16.
 */
import React, {Component, PropTypes} from 'react';
import TableHead from '../components/TableHead';
import TableRow from '../components/TableRow';


const Table = ({elements, onDelete, onEdit}) => {
    
    return (
        <div className='table-wrapper'>
            <h1 className='table-container-head'>Students List</h1>
            <table className='table-container'>
                <TableHead/>
                <tbody>
                {elements.map((el) => {
                    return <TableRow element={el}
                                     key={el.id}
                                     onDelete={() => {onDelete(el.id) }}
                                     onEdit={()=>{ onEdit(el.id) }}
                    />
                })}
                </tbody>
            </table>
        </div>
    );
};



Table.propTypes = {
    onDelete: PropTypes.func,
    onEdit: PropTypes.func,
    elements: PropTypes.array
};


export default Table;

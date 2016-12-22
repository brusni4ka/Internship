/**
 * Created by kate on 19/12/16.
 */
import React, {Component} from 'react';
import TableHead from '../components/tableHead';
import TableRow from '../components/tableRow';
import {connect} from 'react-redux';
import {remove} from '../action/actions';
import {bindActionCreators} from 'redux'


const Table = ({elements, remove, onEdit}) => {

    let table = (
        <table className='table-container'>
            <TableHead/>
            <tbody>
            {elements.map((el) => {
                return <TableRow element={el}
                                 key={el.id}
                                 onDelete={() => { remove(el.id) }}
                                 onEdit={()=>{ onEdit(el.id) }}
                />
            })}
            </tbody>
        </table>
    );
    let emptyDiv = (
        <div className='Restore'><span className='Restore-text'>Nothing to show!</span></div>
    );

    return (
        <div className='TableContainer'>
            <h1 className='TableContainer-head'>Students List</h1>
            {table }
        </div>
    );
};


const mapStateToProps = ({students}) => ({
    elements: students.elements,
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({remove}, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(Table)

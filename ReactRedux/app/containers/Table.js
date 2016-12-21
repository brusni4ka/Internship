/**
 * Created by kate on 19/12/16.
 */
import React, {Component} from 'react';
import TableHead from '../components/tableHead';
import TableRow from '../components/tableRow';
import {connect} from 'react-redux';
import {add,remove} from '../action/actions';

const Table = ({elements, isVisible, onDelete, onEdit}) => {

    let table = (
        <table className='table-container'>
            <TableHead/>
            <tbody>
            {elements.map((el) => {
                return <TableRow element={el}
                                 key={el.id}
                                 onDelete={() => { onDelete(el.id) }}
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
            {isVisible ? table : emptyDiv}
        </div>
    );
};


const mapStateToProps = (state) => ({
    elements: state.students.elements,
    isVisible: state.students.isVisible
});

const mapDispatchToProps = (dispatch) => ({
    onDelete: (id) => {
        dispatch(remove(id));
    },
    onAdd: (data) => {
        dispatch(add(data));
    }
});


export default connect(mapStateToProps, mapDispatchToProps)(Table)

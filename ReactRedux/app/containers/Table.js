/**
 * Created by kate on 19/12/16.
 */
import React, {Component, PropTypes} from 'react';
import TableHead from '../components/tableHead';
import TableRow from '../components/tableRow';
import {connect} from 'react-redux';
import {remove} from '../action/actions';
import {bindActionCreators} from 'redux'


const Table = ({elements, remove, onEdit}) => {
    
    return (
        <div className='table-wrapper'>
            <h1 className='table-container-head'>Students List</h1>
            <table className='table-container'>
                <TableHead/>
                <tbody>
                {elements.map((el) => {
                    return <TableRow element={el}
                                     key={el.id}
                                     onDelete={() => {remove(el.id) }}
                                     onEdit={()=>{ onEdit(el.id) }}
                    />
                })}
                </tbody>
            </table>
        </div>
    );
};

const mapStateToProps = ({students}) => ({
    elements: students.elements
});

const mapDispatchToProps = (dispatch) => (
    bindActionCreators({remove}, dispatch)
);

Table.propTypes = {
    remove: PropTypes.func,
    onEdit: PropTypes.func,
    elements: PropTypes.array
};


export default connect(mapStateToProps, mapDispatchToProps)(Table)

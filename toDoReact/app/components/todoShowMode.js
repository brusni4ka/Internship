/**
 * Created by kate on 16/12/16.
 */
import React, { Component } from 'react';
export const TodoShowMode = ({ handleSetMode, mode})=>{
    return (
       <div className="show-mode-bar">
           <button onClick={(e)=>handleSetMode(e)} className={mode=='ALL'?'showMode active':''} value="ALL">All</button>
           <button onClick={(e)=>handleSetMode(e)} className={mode=='ACTIVE'?'showMode active':''}value="ACTIVE">Active</button>
           <button onClick={(e)=>handleSetMode(e)} className={mode=='COMPLETED'?'showMode active':''}value="COMPLETED">Completed</button>
       </div>

    );
};

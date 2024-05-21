import React from 'react'
import { ACTIONS } from '../App'

export default function OperationButton({ dispatch, operation }) {//
  return (
    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATIONS, payload: {operation}})}> {operation} </button>     
    
  )
}



/******Note******
 * dispatch: 
 * A function provided by the useReducer hook in the parent component. It is used to send actions to the reducer to update the state.
 * 
 * 
 * 
 */


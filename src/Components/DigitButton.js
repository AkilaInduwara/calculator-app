import React from 'react'
import { ACTIONS } from '../App'

export default function DigitButton({ dispatch, digit }) {//
  return (
    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGITS, payload: {digit}})}> {digit} </button>     
    
  )
}



/******Note******
 * dispatch: 
 * A function provided by the useReducer hook in the parent component. It is used to send actions to the reducer to update the state.
 * 
 * 
 * 
 */


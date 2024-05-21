import { useReducer } from "react";
import "../src/CSS/style.css";
import "./CSS/technor.css";
import { type } from "@testing-library/user-event/dist/type";
import DigitButton from "./Components/DigitButton";


//define all the types
export const ACTIONS = {
  ADD_DIGITS: "add-digits",
  CHOOSE_OPERATIONS: "choose-operations",
  CLEAR: "clear",
  DELETE_DIGITS: "delete-digits",
  EVALUATE: "evaluate",
};


//function reducer(state,action) 
//=================or===================================================
// export const reducerName = (state = , action) => {
//   switch (action.type) {
//     case 'ACTION_TYPE':
//       return 
//     default:
//       return state
//   }
// }
function reducer(state, { type, payload }){
  switch (type){
    case ACTIONS.ADD_DIGITS:
      if (payload.digit === "0" && state.currentOperand === "0" ){ //// input digit == 0 and current digit == 0
        return state;
      };
      if (payload.digit === "." && state.currentOperand.include(".")){  //input digit == "." and current digit already include "."
        return state;
      };
      return{
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`,//takin cuurentoperand and adding on new digit on it(currentoperend + payload.digit)
      };
  }
};

function App() {

  // const [state, dispatch] = useReducer(reducer, initialValue);
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

  
  // dispatch({ type: ACTIONS.ADD_DIGITS, payload: {digit}})
/***
 * dispatch:
 * This is a function provided by the useReducer hook.
 * It is used to send actions to the reducer function to update the state based on the action type and payload.
 * 
 * payload:
 * contains additional data needed for the action.
 */


  return (
   <div className="calculator-grid">
      <div className="output">
        <div className="previous-display">{previousOperand} {operation}</div>
        <div className="current-display">{currentOperand}</div>
      </div>
      <button className="span-two">AC</button>
      <button>DEL</button>

      <button>÷</button>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <button>+</button>
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <button>x</button>
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <button>-</button>
      <button>.</button>
      <DigitButton digit="0" dispatch={dispatch} />

      <button className="span-two">=</button>
   </div>

   /*****Note****
    * dispatch={dispatch}:
    *  This prop passes the dispatch function to the DigitButton component.
    */
  );
}

export default App;

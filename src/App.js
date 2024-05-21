import { useReducer } from "react";
import "../src/CSS/style.css";
import "./CSS/technor.css";
import DigitButton from "./Components/DigitButton";
import OperationButton from "./Components/OperationButton";


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
      if(state.overwite){ // if overwrite is true (until press the evaluate overwrite is always false.)
        return{
          ...state,
          currentOperand : payload.digit,//
          overwite : false, //turns overwite back to false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0" ){ //// input digit == 0 and current digit == 0
        return state;
      };
      if (payload.digit === "." && state.currentOperand.includes(".")) {  //input digit == "." and current digit already include "."
        return state;
      };
      // if (payload.digit === "." && state.currentOperand === "") {
      //   return{
      //     ...state,
      //     currentOperand : `0.${payload.digit}`,
      //   };
      // }
      return{
        ...state,
        currentOperand : `${state.currentOperand || ""}${payload.digit}`,//takin cuurentoperand and adding on new digit on it(currentoperend + payload.digit)
      };     


    case ACTIONS.CHOOSE_OPERATIONS:  
      if (state.currentOperand == null && state.previousOperand == null) {
        // current operand and previous operand both == null
        return state;
      }
      if (state.previousOperand == null) {
        // if there is nothing in previous operand
        return {
          ...state, //take current state
          operation: payload.operation, //set payload.operation(button action) on previous-display operation
          previousOperand: state.currentOperand, //move currentOperand on to the previousOperand
          currentOperand: null,
        };
      } 
      if (state.currentOperand == null) {
        return {
          //The user has just chosen an operation but has not entered a subsequent digit yet.
          ...state,
          operation: payload.operation,
        };
      } 
      return {
        ...state, //spread the state
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
        //The evaluate() function takes the currentOperand, previousOperand, and operation from the state, performs the caculation, and returns the result.
      };    
    
    
    case ACTIONS.CLEAR:
      return {};  
      /***
       * return {};
       * This line returns an empty object {}.
       * Returning an empty object effectively resets the state to its initial form, meaning all properties of the state are cleared.
       */



    case ACTIONS.DELETE_DIGITS:
      if(state.overwite){ // if overwrite is true, means after the press the evaluate
        return{
          ...state,
          overwite : false,
          currentOperand : null, //after the evaluate if someone press the delete button it would clear the all the things.
        }
      }

      if (state.currentOperand == null) return state;  //if we dont have values in current operand, we cant delete them. stay in the current state.

      if (state.currentOperand.length === 1){
        return{ //if only one value left in the currentOperand
          ...state,
          currentOperand : null,
        }
      }

      return{
        ...state,
        currentOperand : state.currentOperand.slice(0, -1)  //remove last digit from the current operand.
        
        /* ***NOTE***
         *      ++ .slice(0, -1) is a string method that returns a new string with the last character removed. Here’s how it works:
                        - The first argument 0 is the starting index (inclusive).
                        - The second argument -1 specifies the end index (exclusive), counting backwards from the end of the string. It effectively removes the last character.
         */
      }


    case ACTIONS.EVALUATE:
      if(state.currentOperand == null ){
        return{
          ...state,
          currentOperand : state.previousOperand,
          previousOperand : null,
          operation : null
        }
      }
      if (//ensures that the calculator has all the necessary components to perform a calculation:
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      
      return {
        ...state,
        previousOperand : null,
        operation : null,
        currentOperand : evaluate(state),
        overwite : true, //set overwrite to true any time do an EVALUATION.
      }
      
    default:  
  }
};



function evaluate ({ currentOperand, previousOperand, operation}) {
  //convert to actual numbers
  const prev = parseFloat(previousOperand); //converts a string to a floating-point number.
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  /*** NOTE:
   *    + This can happen if the input string could not be converted to a valid number.
   *    + If either prev or current is NaN, the function returns an empty string "".
   *    + This is a safeguard to prevent the function from attempting to perform a calculation with invalid numbers.
   */

  let computation = "";

  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "x":
      computation = prev * current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "÷":
      if (current === 0) return "Error";
      computation = prev / current;
      break;
    default:
      return "";
  }

  return computation.toString(); // converts the numeric result stored in computation into a string.
}


const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits : 0,
})
/**   ******NOTE******
 *    Intl.NumberFormat: --------> This is a built-in JavaScript object that allows you to format numbers according to a specific locale.
 *    "en-US": ---->   Specifies the locale for the formatting (in this case, U.S. English).
 *    maximumFractionDigits:0:  ------->  This option ensures that no decimal places are included in the formatted number. It formats the number to have commas separating thousands but no fractional digits.
 * 
 */
function formatOperand(operand){ // for both formatOperand(previousOperand), formatOperand(currentOperand)
  
  if (operand == null) return ;

  const [integer, decimal] = operand.split(".") //number devide in to two part as integer part and decimal part.
  if(decimal == null){
    return INTEGER_FORMATTER.format(integer); //change format in integer part by using FORMATTER 
  }
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`; // add decimal part, after the formated integer part
}



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
        <div className="previous-display">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-display">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>  {/* only one button. no need of payload. */}
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGITS})}>DEL</button>

      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="x" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />

      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE})}>=</button>
      
   </div>
  

   /*****Note****
    * dispatch={dispatch}:
    *  This prop passes the dispatch function to the DigitButton component.
    */
  );
}

export default App;

import React, { useReducer, useEffect } from "react";
import "./input.scss";
import { validate } from "../Validators/Validators";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.value,
        isValid: validate(action.value, action.validaters),
      };
    case "TOUCH":
      return { ...state, isTouched: true };
    default:
      return state;
  }
};

function Input(props) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue || "",
    isValid: props.initialvalid || false,
    isTouched: false,
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, isValid, value, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      value: event.target.value,
      validaters: props.validaters,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      ></input>
    ) : (
      <textarea
        rows={props.rows || 3}
        placeholder={props.placeholder}
        id={props.id}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      ></textarea>
    );

  return (
    <div
      className={`form_control ${props.className} ${
        !inputState.isValid && inputState.isTouched && "form_control_invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
}

export default Input;

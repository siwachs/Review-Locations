import React, { useState, useContext } from "react";
import "./auth.scss";
import Card from "../utils/Card/Card";
import Input from "../utils/Input/Input";
import Button from "../utils/Button/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../utils/Validators/Validators";
import { useForm } from "../../hooks/form_hook";
import { AuthContext } from "../utils/Context/Auth_Context";
import ErrorModal from "../model/ErrorModal";
import LoadingSpinner from "../utils/Spinner/LoadingSpinner";
import { useHttpClient } from "../../hooks/http_hook";
import ImagePicker from "../utils/ImagePicker/ImagePicker";
import { useNavigate } from "react-router-dom";

function Auth() {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [isLogIn, setIsLogIn] = useState(true);

  const navigate = useNavigate();

  const [inputHandler, formState, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchToSignUp = () => {
    if (!isLogIn) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogIn((prevState) => !prevState);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (isLogIn) {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.uid, responseData.token);
        navigate("/");
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.uid, responseData.token);
        navigate("/");
      } catch (error) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      <Card className="auth">
        {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <h2>Login</h2>
        <hr></hr>
        <form onSubmit={onSubmitHandler}>
          {!isLogIn && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Full Name"
              onInput={inputHandler}
              placeholder="Full Name"
              validaters={[VALIDATOR_REQUIRE()]}
              errorText="Name can't be empty"
            ></Input>
          )}
          {!isLogIn && (
            <ImagePicker
              errorText="Must Provide a image"
              onInput={inputHandler}
              center
              id="image"
            ></ImagePicker>
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            validaters={[VALIDATOR_EMAIL()]}
            placeholder="E-mail"
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          ></Input>
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validaters={[VALIDATOR_MINLENGTH(8)]}
            placeholder="Password"
            errorText="Password length must be minimum 8 char"
            onInput={inputHandler}
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            {isLogIn ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <Button onClick={switchToSignUp} inverse>
          SWITCH TO {isLogIn ? "SIGN UP" : "SIGN IN"}
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Auth;

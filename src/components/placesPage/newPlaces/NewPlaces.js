import React from "react";
import Input from "../../utils/Input/Input";
import "./newPlaces.scss";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/Validators/Validators";
import Button from "../../utils/Button/Button";
import { useForm } from "../../../hooks/form_hook";
import { useHttpClient } from "../../../hooks/http_hook";
import { useContext } from "react";
import { AuthContext } from "../../utils/Context/Auth_Context";
import ErrorModal from "../../model/ErrorModal";
import LoadingSpinner from "../../utils/Spinner/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import ImagePicker from "../../utils/ImagePicker/ImagePicker";

function NewPlaces() {
  const [inputHandler, formState] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      desc: {
        value: "",
        isValid: false,
      },
      address: {
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

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const addNewPlace = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("desc", formState.inputs.desc.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/places",
        "POST",
        formData,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      navigate("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
      <form className="place_form" onSubmit={addNewPlace}>
        <Input
          id="title"
          placeholder="Title"
          element="input"
          type="text"
          label="Title"
          errorText="Please Enter a Valid Title"
          validaters={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        ></Input>
        <Input
          id="desc"
          placeholder="Desc"
          label="Desc"
          errorText="Please Enter a Valid Desc (Min 5 Char must)"
          validaters={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        ></Input>
        <Input
          id="address"
          element="input"
          placeholder="Address"
          type="text"
          label="Address"
          errorText="Please Enter a address"
          validaters={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        ></Input>
        <ImagePicker
          id="image"
          onInput={inputHandler}
          errorText="Provide a image"
        ></ImagePicker>
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
}

export default NewPlaces;

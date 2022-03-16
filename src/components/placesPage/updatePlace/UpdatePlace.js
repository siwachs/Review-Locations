import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../utils/Context/Auth_Context";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Input from "../../utils/Input/Input";
import Button from "../../utils/Button/Button";
import Card from "../../utils/Card/Card";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../utils/Validators/Validators";
import { useForm } from "../../../hooks/form_hook";
import { useHttpClient } from "../../../hooks/http_hook";
import LoadingSpinner from "../../utils/Spinner/LoadingSpinner";
import ErrorModal from "../../model/ErrorModal";

function UpdatePlace() {
  const pid = useParams().placeid;
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [loadedPlace, setLoadedPlace] = useState(null);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [inputHandler, formState, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: true,
      },
      desc: {
        value: "",
        isValid: true,
      },
    },
    true
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${pid}`
        );
        console.log("x=", data);
        console.log("y=", data.place);
        setLoadedPlace(data.place);
        setFormData(
          {
            title: {
              value: data.place.title,
              isValid: true,
            },
            desc: {
              value: data.place.desc,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchData();
  }, [sendRequest, pid, setFormData]);

  const placeUpdateHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${pid}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          desc: formState.inputs.desc.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        }
      );
      navigate("/" + auth.uid + "/places");
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }

  if (!loadedPlace && !error)
    return (
      <div className="center">
        <Card>
          <h2>Could Not Find Place!</h2>
        </Card>
      </div>
    );

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {!isLoading && loadedPlace && (
        <form className="place_form" onSubmit={placeUpdateHandler}>
          <Input
            id="title"
            element="input"
            placeholder="Title"
            type="text"
            label="Title"
            validaters={[VALIDATOR_REQUIRE()]}
            errorText="Please Enter a Valid Title"
            onInput={inputHandler}
            initialvalue={loadedPlace.title}
            initialvalid={true}
          ></Input>
          <Input
            id="desc"
            placeholder="Desc"
            label="Desc"
            errorText="Please Enter a Valid Desc (Min 5 Char must)"
            validaters={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
            initialvalue={loadedPlace.title}
            initialvalid={true}
          ></Input>
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdatePlace;

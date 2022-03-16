import React, { useRef, useState, useEffect } from "react";
import "./imagePicker.scss";
import Button from "../Button/Button";

function ImagePicker(props) {
  const filePicker = useRef();
  const [file, setFile] = useState();
  const [prevURL, setPrevURL] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPrevURL(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const clickHandle = () => {
    filePicker.current.click();
  };

  const uploadHandle = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files || event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form_control">
      <input
        ref={filePicker}
        style={{ display: "none" }}
        id={props.id}
        accept=".jpg,.png,.jpeg"
        type="file"
        onChange={uploadHandle}
      ></input>
      <div className={`image_upload ${props.center && "center"}`}>
        <div className="image_upload_preview">
          {prevURL && <img src={prevURL} alt="prev"></img>}
          {!prevURL && <p>Upload an Image</p>}
        </div>
        <Button type="button" onClick={clickHandle}>
          UPLOAD IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}

export default ImagePicker;

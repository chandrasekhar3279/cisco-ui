import { Toast } from "primereact/toast";
import React, { useRef } from "react";

const UploadFile = ({
  setFieldValue,
}: {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}) => {
  const gcpUpload = useRef(null);
  const toast = useRef(null);
  let fileReader: FileReader;

  function validateJSON(body: any) {
    try {
      var data = JSON.parse(body);
      // if came to here, then valid
      return data;
    } catch (e) {
      // failed to parse
      return null;
    }
  }

  const handleFileRead = async () => {
    const content = fileReader.result;

    if (validateJSON(content)) {
      setFieldValue(`credentials.0.secret`, content);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Invalid json files",
        life: 3000,
      });
    }
  };

  const handleFileChosen = (file: any) => {
    if (!file || file.name.split(".")[1] !== "json") {
      toast.current.show({
        severity: "error",
        summary: "Invalid file format. Only json files are allowed",
        life: 3000,
      });
      return;
    }

    fileReader = new FileReader();
    fileReader.onloadend = handleFileRead;
    fileReader.readAsText(file);
  };

  const fileUpload = () => {
    gcpUpload.current.click();
  };

  return (
    <>
      <Toast ref={toast} />
      <div
        className="d-flex flex-column pointer"
        style={{ cursor: "pointer", width: "max-content" }}
      >
        <i
          className="pi pi-upload"
          onClick={fileUpload}
          style={{ fontSize: "1.5rem", color: "grey", padding: "1rem 2rem" }}
        ></i>
        <div onClick={fileUpload}>Upload Json File</div>
      </div>
      <input
        type="file"
        id="file"
        ref={gcpUpload}
        className="input-file invisible"
        hidden
        onClick={(event: any) => {
          event.target.value = null;
        }}
        accept=".json"
        onChange={(e) => handleFileChosen(e.target.files[0])}
      />
    </>
  );
};

export default UploadFile;

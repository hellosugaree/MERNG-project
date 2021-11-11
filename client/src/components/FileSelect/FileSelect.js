import React from "react";
import { Button } from "semantic-ui-react";
import "../../App.css";

const FileSelect = (props) => {
  const { handleFileSelect, handleAccept, handleCancel, data } = props;

  return !data ? (
    <label className="file-input-label">
      New Profile Photo
      <input
        onChange={e => handleFileSelect(e.target.files[0])}
        type="file"
        name="images"
        accept="image/*"
        style={{ display: "none" }}
      />
    </label>
  ) : (
    <div>
      <Button
        onClick={handleAccept}
        color="teal"
        type="button"
        style={{ fontSize: 20, padding: 10 }}
      >
        Accept
      </Button>
      <Button
        onClick={handleCancel}
        color="red"
        type="button"
        style={{ fontSize: 20, padding: 10 }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default FileSelect;
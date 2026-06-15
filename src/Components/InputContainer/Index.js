import React, { useState } from "react";
import { Collapse } from "@material-ui/core";

import InputTile from "../InputTile/index";

import "./styles.scss";

export default function InputContainer({ listId, type }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="input-container">
      <Collapse in={open}>
        <InputTile setOpen={setOpen} listId={listId} type={type} />
      </Collapse>
      <Collapse in={!open}>
        <div className="input-content">
          <button onClick={() => setOpen(!open)}>
            {type === "card" ? "+ Add Card" : "+ Add List"}
          </button>
        </div>
      </Collapse>
    </div>
  );
}
import React, { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import { IOrder, IOrderItem } from "types/gameDataInterfaces";
import { doesOrderItemExistOnOrder } from "services/gameDataHelper";

import "./Input.scss";

interface IInputProps {
  order: IOrder;
  createdItems: IOrderItem[];
  hideInput: () => void;
  createOrderItem: (order: IOrder, name: string) => void;
}

const Input: React.FC<IInputProps> = ({
  order,
  createdItems,
  hideInput,
  createOrderItem,
}): JSX.Element => {
  const [value, setValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [inputRef]);

  const handleInputEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!doesOrderItemExistOnOrder(createdItems, value, order)) {
        createOrderItem(order, value);
        setValue("");
        hideInput();
      }
    }
  };

  return (
    <div className="item-input">
      <input
        style={{
          color: `${
            !doesOrderItemExistOnOrder(createdItems, value, order)
              ? "white"
              : "red"
          }`,
        }}
        ref={inputRef}
        type="text"
        placeholder="Ex: burger #1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => handleInputEvent(e)}
      />
      <CloseIcon onClick={() => hideInput()} />
    </div>
  );
};

export default Input;

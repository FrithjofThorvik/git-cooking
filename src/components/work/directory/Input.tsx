import React, { useEffect, useRef, useState } from "react";

import { IOrder } from "types/gameDataInterfaces";
import { doesOrderItemExist } from "services/gameDataHelper";

import "./Input.scss";

interface IInputProps {
  order: IOrder;
  hideInput: () => void;
  createOrderItem: (order: IOrder, name: string) => void;
}

const Input: React.FC<IInputProps> = ({
  order,
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
      if (!doesOrderItemExist(order, value)) {
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
          color: `${!doesOrderItemExist(order, value) ? "white" : "red"}`,
        }}
        ref={inputRef}
        type="text"
        placeholder="item name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => handleInputEvent(e)}
      />
    </div>
  );
};

export default Input;

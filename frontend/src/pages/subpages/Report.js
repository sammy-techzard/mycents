import React, { useState } from "react";
import IconPicker from "../../components/IconPicker";


const IconPickerDemo = () => {
  const [selectedIcon, setSelectedIcon] = useState("FaUsers");

  return (
    <div>
      <h3>Choose an Icon</h3>
      <IconPicker value={selectedIcon} onChange={setSelectedIcon} />
      <p>Selected Icon: {selectedIcon}</p>
    </div>
  );
};

export default IconPickerDemo;

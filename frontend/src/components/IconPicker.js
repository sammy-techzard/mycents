import React, { useState } from "react";
// import * as AiIcons from "react-icons/ai";
// import * as BiIcons from "react-icons/bi";
// import * as BsIcons from "react-icons/bs";
// import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io5";
// import * as MdIcons from "react-icons/md";
// import * as RiIcons from "react-icons/ri";

const allIconSets = {
  IoIcons,
};

// Flatten all icons into a single array with their names and components
const icons = Object.entries(allIconSets).flatMap(([prefix, iconSet]) =>
  Object.keys(iconSet).map((iconName) => ({
    name: `${prefix}.${iconName}`,
    component: iconSet[iconName],
  }))
);

const IconPicker = ({ value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredIcons = icons.filter(({ name }) =>
    name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleIconSelect = (name) => {
    onChange(name);
    setShowPicker(false); // Close the picker after selection
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Circular Button */}
      <span
        onClick={() => setShowPicker((prev) => !prev)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1px solid #ccc",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {value ? (
          React.createElement(
            icons.find((icon) => icon.name === value)?.component || (() => "?"),
            { size: 20 }
          )
        ) : (
          "?"
        )}
      </span>

      {/* Icon Picker Dropdown */}
      {showPicker && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "0",
            width: "300px",
            maxHeight: "300px",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            overflow: "hidden",
          }}
        >
          {/* Search Input */}
          <div style={{ padding: "8px" }}>
            <input
              type="text"
              placeholder="Search icons..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Scrollable Icon List */}
          <div
            style={{
              maxHeight: "240px",
              overflowY: "scroll",
              padding: "8px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
              gap: "10px",
            }}
          >
            {filteredIcons.map(({ name, component: Icon }) => (
              <span
                
                key={name}
                onClick={() => handleIconSelect(name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderRadius: "4px",
                  padding: "4px",
                  transition: "background-color 0.2s",
                  ...(value === name
                    ? { background: "#e0e0e0" }
                    : { background: "transparent" }),
                }}
              >
                <Icon size={24} />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;

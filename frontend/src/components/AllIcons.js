// Import all available icon packs from react-icons
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as AiIcons from "react-icons/ai";
import * as BsIcons from "react-icons/bs";
import * as IoIcons from "react-icons/io";
import * as GiIcons from "react-icons/gi";
import * as HiIcons from "react-icons/hi";
import * as TiIcons from "react-icons/ti";
import * as FiIcons from "react-icons/fi";

// Combine all icons into one object
const allIcons = {
  ...FaIcons,
  ...MdIcons,
  ...AiIcons,
  ...BsIcons,
  ...IoIcons,
  ...GiIcons,
  ...HiIcons,
  ...TiIcons,
  ...FiIcons,
};

export default allIcons;

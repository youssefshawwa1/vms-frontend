import { MdCancel } from "react-icons/md";
import { MdReadMore } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
// import { MdAssignmentAdd } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";
// import { FaClipboardCheck } from "react-icons/fa";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { MdOutlineAssignmentReturned } from "react-icons/md";
const style =
  "text-main-500 text-4xl cursor-pointer hover:text-yellow-500 transition-colors";
const View = () => {
  return <MdReadMore className={`${style}`} />;
};
const Edit = () => {
  return <MdEdit className={`${style}`} />;
};

const Cancel = () => {
  return <MdCancel className={`${style}`} />;
};
const AddNormal = () => {
  return <></>;
};
const AddPerson = () => {
  return <BsPersonFillAdd className={`${style}`} />;
};
const AddDocument = () => {
  return <MdOutlineAssignmentReturned className={`${style}`} />;
};
const AddGroup = () => {
  return <MdGroupAdd className={`${style}`} />;
};
const CompleteDocument = () => {
  return <MdOutlineAssignmentTurnedIn className={`${style}`} />;
};

export {
  View,
  AddDocument,
  Cancel,
  Edit,
  AddGroup,
  AddPerson,
  AddNormal,
  CompleteDocument,
};

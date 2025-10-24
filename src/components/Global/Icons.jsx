import {
  MdCancel,
  MdReadMore,
  MdEdit,
  MdGroupAdd,
  MdOutlineAssignmentTurnedIn,
  MdOutlineAssignmentReturned,
  MdCloudDownload,
} from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
const style =
  "text-main-500 text-4xl cursor-pointer hover:text-yellow-500 transition-colors";
const View = () => {
  return <MdReadMore className={`${style}`} />;
};
const Edit = () => {
  return <MdEdit className={`${style}`} />;
};
const Download = () => {
  return <MdCloudDownload className={`${style}`} />;
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
  Download,
};

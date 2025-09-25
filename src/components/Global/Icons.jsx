import { MdCancel } from "react-icons/md";
import { MdReadMore } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { BsPersonFillAdd } from "react-icons/bs";
import { MdAssignmentAdd } from "react-icons/md";
import { MdGroupAdd } from "react-icons/md";

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
  return <MdAssignmentAdd className={`${style}`} />;
};
const AddGroup = () => {
  return <MdGroupAdd className={`${style}`} />;
};

export { View, AddDocument, Cancel, Edit, AddGroup, AddPerson, AddNormal };

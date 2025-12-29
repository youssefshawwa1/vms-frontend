import { useEffect, useMemo } from "react";
import useFetching from "../../Hooks/useFetching";
import { FormSubmitBtn, FormSectionGroup, FormSection } from "../Global/Form";
import { useValidateForm, validators } from "../../Hooks/useValidateForm";
const CertificateForm = ({
  certificateDetails,
  volunteerrDetails,
  callBack,
}) => {
  const { sendData } = useFetching();
  const validationRules = {
    certificateTitle: validators.required(),
    certificateDescription: validators.requiredAndLengthRange(30, 1000),
    customMessage: validators.requiredAndLengthRange(30, 1000),
    certificateType: validators.required(),
    certificateKind: validators.required(),
  };
  const initialData = {
    certificateTitle: certificateDetails?.certificateTitle || "",
    volunteerId: volunteerrDetails?.id || "",
    certificateDescription: certificateDetails?.certificateDescription || "",
    volunteeringHours: certificateDetails?.volunteeringHours || 0,
    customMessage: certificateDetails?.customMessage || "",
    certificateType: certificateDetails?.certificateType || "",
    certificateKind: certificateDetails?.certificateKind || "",
    certificateId: certificateDetails?.id || "",
  };
  const types = [
    { text: "Select Type", value: "" },
    { text: "Appreciation", value: "appreciation" },
    { text: "Achievement", value: "achievement" },
    { text: "Recognition", value: "recognition" },
  ];
  const kinds = [
    { text: "Select Type", value: "" },
    { text: "Hour Based", value: "withHours" },
    { text: "Normal", value: "withoutHours" },
  ];
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    validateForm,
    clearFieldError,
    updateField,
    resetForm,
  } = useValidateForm(initialData, validationRules);

  const structure = useMemo(
    () => [
      {
        label: "Certificate Title",
        error: errors.certificateTitle,
        onChange: handleChange,
        value: formData.certificateTitle,
        name: "certificateTitle",
        holder: "....",
        onBlur: handleBlur,
        show: true,
      },
      {
        label: "Description",
        error: errors.certificateDescription,
        onChange: handleChange,
        value: formData.certificateDescription,
        name: "certificateDescription",
        holder: "Some Description...",
        onBlur: handleBlur,
        show: true,
        type: "textarea",
      },
      {
        label: "Appearing Description On Certificate",
        error: errors.customMessage,
        onChange: handleChange,
        value: formData.customMessage,
        name: "customMessage",
        holder: "Some Description...",
        onBlur: handleBlur,
        show: true,
        type: "textarea",
      },
      {
        label: "Certificate Kind",
        error: errors.certificateKind,
        onChange: handleChange,
        value: formData.certificateKind,
        name: "certificateKind",
        onBlur: handleBlur,
        options: kinds,
        show: true,
        type: "selection",
      },
      {
        label: "Volunteering Hours",
        error: errors.volunteeringHours,
        onChange: handleChange,
        value: formData.volunteeringHours,
        name: "volunteeringHours",
        onBlur: handleBlur,
        show: formData.certificateKind == "withHours",
        type: "number",
      },
      {
        label: "Certificate Type",
        error: errors.certificateType,
        onChange: handleChange,
        value: formData.certificateType,
        name: "certificateType",
        onBlur: handleBlur,
        options: types,
        show: true,
        type: "selection",
      },
    ],
    [errors, formData, handleChange, handleBlur, clearFieldError, updateField]
  );
  useEffect(() => {
    if (formData.certificateKind != "withHours")
      errors.volunteeringHours ?? delete errors.volunteeringHours;
  }, [formData.certificateKind]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.certificateKind == "withHours"
      ? (validationRules.volunteeringHours = validators.nbBetween(
          1,
          volunteerrDetails?.currentHours
        ))
      : validationRules.volunteeringHours ??
        delete validationRules.volunteeringHours;

    if (validateForm()) {
      const data = {
        action: certificateDetails ? "updateCertificate" : "issueCertificate",
        data: {
          volunteerId: formData.volunteerId,
          certificateTitle: formData.certificateTitle,
          certificateDescription: formData.certificateDescription,
          certificateType: formData.certificateType,
          certificateKind: formData.certificateKind,
          volunteeringHours: formData.volunteeringHours,
          customMessage: formData.customMessage,
          updatedBy: 1001,
          certificateId: formData.certificateId,
        },
      };
      await sendData("volunteers.php", data, () => {
        if (callBack) callBack();
        resetForm();
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <FormSectionGroup>
        <FormSection title="Certificate Details" data={structure} />
      </FormSectionGroup>
      <FormSubmitBtn
        text={certificateDetails ? "Update Certificate" : "Issue Certificate"}
      />
    </form>
  );
};
export default CertificateForm;

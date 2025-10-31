const Input = ({
  label,
  value,
  onChange,
  error,
  type,
  holder,
  name,
  onBlur,
  show,
  index,
  classes,
}) => {
  //   const uniqe = label.replaceAll(" ", "").toLowerCase();
  return (
    <>
      {show && (
        <div
          className={`${
            !classes ? "grid grid-cols-1 sm:grid-cols-[30%_1fr] gap-2" : classes
          }`}
          key={index || ""}
        >
          <div>
            <label className="font-semibold text-gray-700" htmlFor={name}>
              {label}:
            </label>
          </div>
          <div className="w-full mx-auto">
            {type == "textarea" ? (
              <textarea
                autoComplete="off"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                        ${error ? "border-red-500" : "border-gray-300"}`}
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={holder}
                onBlur={onBlur}
              ></textarea>
            ) : (
              <input
                autoComplete="off"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                        ${error ? "border-red-500" : "border-gray-300"}`}
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={holder}
                onBlur={onBlur}
              />
            )}
            {error && <InputError error={error} />}
            {/* <p className="mt-1 text-sm text-red-600">error</p> */}
          </div>
        </div>
      )}
    </>
  );
};
const SelectInput = ({
  label,
  value,
  onChange,
  error,
  options,
  name,
  onBlur,
  index,
}) => {
  //   const uniqe = label.replaceAll(" ", "").toLowerCase();

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-[30%_1fr] grid gap-2 "
      key={index || ""}
    >
      <div>
        <label htmlFor={name}>{label}</label>
      </div>
      <div className="w-full mx-auto sm:w-full">
        <select
          autoComplete="off"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-1 focus:ring-yellow-200 focus:border-yellow-200 outline-none transition 
                    ${error ? "border-red-500" : "border-gray-300"}`}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
        {error && <InputError error={error} />}
      </div>
    </div>
  );
};
const InputError = ({ error }) => {
  return <p className="mt-1 text-sm text-red-600">{error}</p>;
};
const SectionHeader = ({ label }) => {
  return (
    <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b text- ">
      {label}
    </h2>
  );
};

const FormSection = ({ children, title, data }) => {
  return (
    <div className="section">
      <SectionHeader label={title} />
      <div className=" grid sm:grid-cols-1 gap-6 md:grid-cols-1 ">
        {data &&
          data.map((item, index) => {
            switch (item.type) {
              case "checkbox":
                return (
                  <CheckBox
                    checked={item.checked}
                    onBlur={item.onBlur}
                    onChange={item.onChange}
                    setChecked={item.setChecked}
                    label={item.label}
                    show={item.show}
                    index={index}
                  />
                );
              case "selection":
                return (
                  <SelectInput
                    label={item.label}
                    value={item.value}
                    onChange={item.onChange}
                    error={item.error}
                    options={item.options}
                    name={item.name}
                    show={item.show}
                    index={index}
                  />
                );
              default:
                return (
                  <Input
                    label={item.label}
                    error={item.error}
                    onChange={item.onChange}
                    value={item.value}
                    name={item.name}
                    type={item.type || "text"}
                    onBlur={item.onBlur}
                    holder={item.holder}
                    show={item.show}
                    index={index}
                    classes={item?.classes || false}
                  />
                );
            }
          })}
        {children}
      </div>
    </div>
  );
};
const FormSectionGroup = ({ children, data }) => {
  return (
    <div className="sections-container grid sm:grid-cols-1  gap-11 justify">
      {data &&
        data.map((section) => (
          <FormSection data={section.items} title={section.title} />
        ))}
      {children}
    </div>
  );
};

const FormSubmitBtn = ({ text, error }) => {
  return (
    <div className="text-center p-4">
      <button
        className="bg-main min-w-50  h-full p-4 text-white rounded-lg hover:bg-main-500 focus:bg-yellow-400 transition-color duration-200 ease-linear font-bold shadow-xl cursor-pointer"
        type="submit"
      >
        {text}
      </button>
      {error && <InputError error={error} />}
    </div>
  );
};
const CheckBox = ({
  checked,
  setChecked,
  ifChecked,
  onBlur,
  label,
  show,
  index,
}) => {
  return (
    <>
      {show && (
        <label
          className="flex items-center space-x-3 cursor-pointer justify-center"
          key={index || ""}
        >
          <span className="text-gray-700   ">{label}</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={checked}
              onBlur={onBlur}
              onChange={(e) => {
                setChecked(e.target.checked);
                if (checked) {
                  ifChecked();
                }
              }}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 border-2 rounded transition-all duration-200 ${
                checked
                  ? "bg-amber-500 border-amber-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {checked && (
                <svg
                  className="w-3 h-3 text-white absolute top-1 left-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
        </label>
      )}
    </>
  );
};

export {
  SelectInput,
  Input,
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
  CheckBox,
};

const Dropdown = ({ options, onChange, placeholder }) => {
  console.log(options, onChange, placeholder);

  return (
    <select
      style={{ display: "block", zIndex: 1000 }}
      onChange={onChange}
      defaultValue="placeholder"
    >
      <option value="placeholder" disabled hidden>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

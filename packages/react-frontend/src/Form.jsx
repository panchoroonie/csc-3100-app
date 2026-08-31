import { useState } from "react";

function Form({ handleSubmit }) {
  const [person, setPerson] = useState({
    name: "",
    job: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setPerson((currentPerson) => ({
      ...currentPerson,
      [name]: value,
    }));
  }

  function submitForm(event) {
    event.preventDefault();
    handleSubmit(person);
    setPerson({ name: "", job: "" });
  }

  return (
    <form onSubmit={submitForm}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={person.name}
        onChange={handleChange}
      />
      <label htmlFor="job">Job</label>
      <input
        type="text"
        name="job"
        id="job"
        value={person.job}
        onChange={handleChange}
      />
      <input type="submit" value="Submit" />
    </form>
  );
}

export default Form;

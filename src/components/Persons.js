import React from "react";
import Person from "./Person";

const Persons = ({ persons, deleteHandler }) => {
  return (
    <>
      {persons.map((person) => (
        <div key={person.name}>
          <Person name={person.name} number={person.number} />{" "}
          <button onClick={() => deleteHandler(person)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default Persons;

import React from "react";
import Person from "./Person";

const People = ({ people, deleteHandler }) => {
  return (
    <>
      {people.map((person) => (
        <div key={person.name}>
          <Person name={person.name} number={person.number} />{" "}
          <button onClick={() => deleteHandler(person)}>Delete</button>
        </div>
      ))}
    </>
  );
};

export default People;

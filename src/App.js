import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/PersonService";
import Notification from "./components/Notification";

const TIMEOUT = 3500;

const App = () => {
  // State
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Effect Hook
  useEffect(
    () => personService.getAll().then((persons) => setPersons(persons)),
    []
  );

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`) === true) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== person.id));
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, TIMEOUT);
          setPersons(persons.filter((p) => p.id !== person.id));
        });
    }
  };

  const personsToShow =
    newFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toUpperCase().includes(newFilter.toUpperCase())
        );

  const addName = (e) => {
    e.preventDefault();

    const personFound = persons.find((p) => p.name === newName);

    if (typeof personFound !== "undefined") {
      updateName(personFound);
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService.create(newPerson).then((person) => {
        setPersons(persons.concat(person));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`Added ${newName}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, TIMEOUT);
      });
    }
  };

  const updateName = (person) => {
    if (
      window.confirm(
        `${person.name} is already added to the phonebook, replace the old number with a new one?`
      ) === true
    ) {
      const updatedPerson = { name: person.name, number: newNumber };

      personService.update(person.id, updatedPerson).then((returnedPerson) => {
        setPersons(
          persons.map((p) => (p.id !== person.id ? p : returnedPerson))
        );
        setSuccessMessage(`Updated ${newName}'s number`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, TIMEOUT);
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilterChange = (e) => {
    setNewFilter(e.target.value);
  };

  return (
    <div>
      <h1>Phonebook</h1>

      {/*if else doesn't work in JSX... testing immediately invoked function*/}
      {(() => {
        if (successMessage !== null) {
          return <Notification message={successMessage} type="success" />;
        }
        if (errorMessage !== null) {
          return <Notification message={errorMessage} type="error" />;
        }
      })()}

      <Filter state={newFilter} onChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm
        onSubmit={addName}
        nameState={newName}
        onNameChange={handleNameChange}
        numberState={newNumber}
        onNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} deleteHandler={handleDelete} />
    </div>
  );
};

export default App;

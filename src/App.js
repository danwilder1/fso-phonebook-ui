import React, { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import People from "./components/People";
import PeopleService from "./services/PeopleService";
import Notification from "./components/Notification";

const TIMEOUT = 3500;

const App = () => {
  // State
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Effect Hook
  useEffect(
    () => PeopleService.getAll().then((people) => setPeople(people)),
    []
  );

  const handleDelete = (person) => {
    if (window.confirm(`Delete ${person.name}?`) === true) {
      PeopleService.remove(person.id)
        .then(() => {
          setPeople(people.filter((p) => p.id !== person.id));
        })
        .catch(() => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, TIMEOUT);
          setPeople(people.filter((p) => p.id !== person.id));
        });
    }
  };

  const peopleToShow =
    newFilter === ""
      ? people
      : people.filter((person) =>
          person.name.toUpperCase().includes(newFilter.toUpperCase())
        );

  const addName = (e) => {
    e.preventDefault();

    const personFound = people.find((p) => p.name === newName);

    if (typeof personFound !== "undefined") {
      updateName(personFound);
    } else {
      const newPerson = { name: newName, number: newNumber };
      PeopleService.create(newPerson).then((person) => {
        setPeople(people.concat(person));
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

      PeopleService.update(person.id, updatedPerson).then((returnedPerson) => {
        setPeople(people.map((p) => (p.id !== person.id ? p : returnedPerson)));
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
      <People people={peopleToShow} deleteHandler={handleDelete} />
    </div>
  );
};

export default App;

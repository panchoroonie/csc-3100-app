import { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const characterToDelete = characters[index];

    fetch(`http://localhost:8000/users/${characterToDelete.id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.status === 204) {
          setCharacters((currentCharacters) =>
            currentCharacters.filter(
              (character) => character.id !== characterToDelete.id,
            ),
          );
        } else {
          console.error(`Unsuccessful deletion: ${response.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((newPerson) => {
        if (newPerson) {
          setCharacters((currentCharacters) => [
            ...currentCharacters,
            newPerson,
          ]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    return fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((response) => {
      if (response.status === 201) {
        return response.json();
      }

      console.error(`Unsuccessful insertion: ${response.status}`);
      return null;
    });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;

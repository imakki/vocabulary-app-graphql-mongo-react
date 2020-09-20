import React, { useState, useEffect } from 'react';
import '../App.css';
import { gql } from 'graphql-request';
import { client } from '../graphqlClient';
import { Link } from 'react-router-dom';

const SEARCH_WORDS = gql`
  query getWords($word: String!) {
    searchWords(word: $word) {
      _id
      word
    }
  }
`;

const ADD_WORD = gql`
  mutation AddWord($word: String!) {
    createWord(word: $word) {
      _id
      word
    }
  }
`;

const Home = () => {
  const [wordList, setwordList] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [addWord, setaddWord] = useState('');

  const handleSearchInputChange = (e) => {
    //console.log(e.target.value);
    setSearchWord(e.target.value);
    const variables = {
      word: searchWord,
    };

    client
      .request(SEARCH_WORDS, variables)
      .then((res) => {
        setwordList(res.searchWords);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleForm = (e) => {
    e.preventDefault();
    console.log(addWord);

    const variables = {
      word: addWord,
    };

    client
      .request(ADD_WORD, variables)
      .then((res) => {
        setaddWord(res.createWord);
      })
      .catch((err) => {
        console.log(err);
      });
    setaddWord('');
  };
  useEffect(() => {
    const GET_WORDS = gql`
      {
        words {
          _id
          word
          definitions {
            etymologies
            definitions
            examples
            lexicalCategory
          }
        }
      }
    `;

    client
      .request(GET_WORDS)
      .then((res) => setwordList(res.words))
      .catch((err) => {
        console.log(err);
      });
  }, [addWord]);

  return wordList && wordList.length ? (
    <div>
      <h1>Vocabulary App</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchWord}
        onChange={handleSearchInputChange}
      />
      <ul>
        {wordList.map((d) => {
          return (
            <li key={d._id}>
              <Link to={`/card/${d._id}`}>{d.word}</Link>
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleForm}>
        <input
          type="text"
          placeholder="Add Word"
          value={addWord}
          onChange={(e) => setaddWord(e.target.value)}
        />
        <button type="submit">Add Word</button>
      </form>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Home;

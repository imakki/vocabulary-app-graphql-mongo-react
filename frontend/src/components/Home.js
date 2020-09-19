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

const Home = () => {
  const [wordList, setwordList] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState(false);

  const handleSearchInputChange = (e) => {
    //console.log(e.target.value);
    setSearchWord(e.target.value);
    const variables = {
      word: e.target.value,
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
  }, []);

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
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default Home;

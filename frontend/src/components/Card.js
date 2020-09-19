import React, { useState, useEffect } from 'react';
import { gql } from 'graphql-request';
import { client } from '../graphqlClient';
import { Link, useParams } from 'react-router-dom';

const SEARCH_WORD_BY_ID = gql`
  query getWordById($id: ID!) {
    searchWordById(_id: $id) {
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

const Card = () => {
  const [word, setword] = useState([]);
  let { id } = useParams();

  useEffect(() => {
    const variables = {
      id: id,
    };
    client
      .request(SEARCH_WORD_BY_ID, variables)
      .then((res) => setword(res.searchWordById))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  console.log(word);
  return (
    <div>
      <h1>Card</h1>
      <h3>{word.word}</h3>
      <Link to="/">Home</Link>
    </div>
  );
};

export default Card;

import React, { useState, useEffect } from 'react';
import {
  useQuery,
  useQueryCache,
  QueryCache,
  ReactQueryCacheProvider,
} from 'react-query';

import axios from 'axios';
import '../App.css';
import { request, gql } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

const queryCache = new QueryCache();

const Home = () => {
  const [wordList, setwordList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState(false);

  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <p>hey</p>
      {}
    </ReactQueryCacheProvider>
  );

  function usePosts() {
    return useQuery('posts', async () => {
      const {
        words: { data },
      } = await request(
        endpoint,
        gql`
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
        `
      );
      return data;
    });
  }
};

export default Home;

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { graphqlHTTP } = require('express-graphql'); //middleware for handling graphql related api's
const { buildSchema } = require('graphql'); //build schema using string literals

const mongoose = require('mongoose');

require('./models/WordSchema');
const Word = mongoose.model('Word');

require('dotenv').config();

const app = express(); //express server instance

app.use(bodyParser.json());

//graphql API
app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
        type Definition {
            etymologies: String
            definitions: String
            examples: String
            lexicalCategory: String
        }

        type Word {
            _id: ID!
            word: String!
            definitions: [Definition]
        }

        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String
        }

        type RootQuery{
            events: [Event!]! 
            words: [Word!]!                 
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createWord(word: String!): Word
        }

        schema{
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      words: () => {
        return Word.find()
          .then((item) => {
            return item;
          })
          .catch((err) => {
            throw err;
          });
      },
      createWord: async (args) => {
        const existingWord = await Word.findOne({ word: args.word });
        if (existingWord) {
          throw new Error('Word exists already.');
        }
        const word = new Word({ word: args.word });
        const result = await word.save();
        return { ...result._doc };
      },
    },
    graphiql: true,
  })
);

//Mongodb connection
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => handleError(error));

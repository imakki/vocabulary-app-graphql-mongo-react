const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Definition {
    etymologies: [String!],
    definitions: [String!]
    examples: [String!]
    lexicalCategory: String
}

type Word {
    _id: ID!
    word: String!
    definitions: [Definition]!
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
`);

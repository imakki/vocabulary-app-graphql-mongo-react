const mongoose = require('mongoose');
const { Schema } = mongoose;
const axios = require('axios');
const config = require('../axiosConfig');
require('dotenv').config();

const DefinitionSchema = new Schema({
  etymologies: [String],
  definitions: [String],
  examples: [String],
  lexicalCategory: [String],
});

mongoose.model('Definition', DefinitionSchema);
const Definition = mongoose.model('Definition');

const WordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
  definitions: [DefinitionSchema],
});

function createDefinition(entry, wordDefinitions, examples) {
  let def = new Definition({
    etymologies: entry.etymologies,
    definitions: wordDefinitions,
    examples: examples,
    lexicalCategory: entry.lexicalCategory,
  });
  def.save();
  return def;
}

function getEntryData(entry) {
  let wordDefinitions = [];
  let examples = [];

  entry.senses.forEach((def) => {
    wordDefinitions = wordDefinitions.concat(def.definitions);
    if (def.examples) {
      def.examples.forEach((example) => {
        examples.push(example.text);
      });
    }
  });

  return createDefinition(entry, wordDefinitions, examples);
}
WordSchema.pre('save', function (next) {
  axios
    .get(
      `${process.env.BASE_URI}/entries/${process.env.language}/${this.word}?strictMatch=false`,
      config
    )
    .then((response) => {
      let results = response.data.results[0].lexicalEntries[0];
      const enteries = results.entries[0];
      const senses = enteries.senses;
      let wordDefinition = [];
      const examples = [];
      //console.log(enteries);
      senses.forEach((sense) => {
        wordDefinition = wordDefinition.concat(sense.definitions);
        if (sense.examples) {
          //definitions.concat(sense.definitions[0]);
          sense.examples.forEach((example) => {
            examples.push(example.text);
          });
        }
      });

      console.log();

      let def = new Definition({
        etymologies: enteries.etymologies,
        definitions: wordDefinition,
        examples: examples,
        lexicalCategory: enteries.lexicalCategory,
      });
      def
        .save()
        .then((response) => {
          console.log(response + 'here');
        })
        .catch((err) => {
          console.log(err);
        });
      return def;
    })
    .catch((error) => {
      console.log(error);
    });
  console.log('Saving doc', this);
  next();
});

const Word = mongoose.model('Word', WordSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;
const axios = require('axios');
const config = require('../axiosConfig');
require('dotenv').config();

const DefinitionSchema = new Schema({
  etymologies: [String],
  definitions: [String],
  examples: [String],
  lexicalCategory: String,
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
  def
    .save()
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return def;
}

function getEntryData(entry) {
  //console.log(entry + 'here');
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
  //console.log(wordDefinitions);
  //console.log(examples);
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
      this.definitions = results.entries.map(getEntryData);
      //console.log('Saving doc', JSON.stringify(this));
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

const Word = mongoose.model('Word', WordSchema);

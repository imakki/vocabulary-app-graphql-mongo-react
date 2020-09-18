const mongoose = require('mongoose');

require('../../models/WordSchema');

const Word = mongoose.model('Word');

module.exports = {
  words: () => {
    return Word.find()
      .then((words) => {
        return words.map((word) => {
          //console.log(JSON.stringify(word));
          return word;
        });
      })
      .catch((err) => {
        console.log(err);
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
  searchWords: async (args) => {
    var w = args.word;
    return Word.find({ word: { $regex: '.*' + w + '.*' } })
      .then((result) => {
        return result.map((word) => {
          return word;
        });
      })
      .catch((err) => {
        throw new Error('No word found!');
      });
  },
};

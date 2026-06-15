const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const Game = require('../Models/Game');

const router = express.Router();

// GraphQL Schema
const schema = buildSchema(`
  type Game {
    id: ID
    title: String
    genre: String
    platform: String
    rating: Float
    description: String
    releaseDate: String
  }

  type Query {
    games: [Game]
    game(id: ID!): Game
    gamesByGenre(genre: String!): [Game]
  }

  type Mutation {
    addGame(title: String!, genre: String!, platform: String!, rating: Float!, description: String!, releaseDate: String!): Game
  }
`);

const root = {
  games: async () => await Game.find(),
  game: async ({ id }) => await Game.findById(id),
  gamesByGenre: async ({ genre }) => await Game.find({ genre }),
  addGame: async ({ title, genre, platform, rating, description, releaseDate }) => {
    const newGame = new Game({ title, genre, platform, rating, description, releaseDate });
    await newGame.save();
    return newGame;
  }
};

router.use('/games', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

module.exports = router;

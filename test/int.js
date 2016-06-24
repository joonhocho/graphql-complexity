import {
  graphql,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {GraphQLInputInt} from '../lib';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: GraphQLInt,
      expense: 1,
    },
    name: {
      type: GraphQLString,
      expense: 2,
    },
    friends: {
      type: UserType,
      expense: 10,
      args: {
        limit: {
          type: GraphQLInt,
        },
      },
    },
  }),
});


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: UserType,
        args: {
          id: {
            type: GraphQLInt,
          },
        },
        resolve: (_, {id}, context, info) => {
          console.log(JSON.stringify(info.operation.selectionSet, null, '  '));
          console.log(
            JSON.stringify(info.fieldASTs) ===
            JSON.stringify(info.operation.selectionSet.selections)
          );
          // info.fieldASTs
          // === info.operation.selectionSet.selections
          return id;
        },
      },
    },
  }),
});


const runQuery = (query) =>
  graphql(schema, query)
    .then((res) => res.data.input);


describe('GraphQLProtection', () => {
  it('default', (done) => {
    runQuery(`{ user(id: 7) { id name friends(limit: 10) { id name friends { id name } } } }`).then(done, done);
  });
});

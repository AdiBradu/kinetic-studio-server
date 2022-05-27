const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");

exports.MType = new GraphQLObjectType({
  name: "MType",
  fields: () => ({
    mt_id: { type: GraphQLID },
    mt_name: { type: GraphQLString },   
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});
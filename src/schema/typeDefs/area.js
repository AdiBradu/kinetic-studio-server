const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");

exports.AreaType = new GraphQLObjectType({
  name: "Area",
  fields: () => ({
    a_id: { type: GraphQLID },
    a_name: { type: GraphQLString },
    a_extra_charge: { type: GraphQLFloat },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});
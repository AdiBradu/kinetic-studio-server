const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require("graphql");

exports.MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    successful: { type: GraphQLBoolean },
    message: { type: GraphQLString },
  }),
});
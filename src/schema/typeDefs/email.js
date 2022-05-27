const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");

exports.EmailType = new GraphQLObjectType({
  name: "Email",
  fields: () => ({
    e_id: { type: GraphQLID },
    email_subject: { type: GraphQLString },
    email_body: { type: GraphQLString },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});
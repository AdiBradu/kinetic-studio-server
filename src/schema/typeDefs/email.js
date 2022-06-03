const { GraphQLObjectType, GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLFloat } = require("graphql");

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

exports.EmailInputType = new GraphQLInputObjectType({
  name: "EmailInput",
  fields: () => ({
    id: { type: GraphQLFloat },
    email_subject: { type: GraphQLString },
    email_body: { type: GraphQLString },  
  }),
});
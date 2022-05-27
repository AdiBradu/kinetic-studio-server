const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList } = require("graphql");

exports.PartnerType = new GraphQLObjectType({
  name: "Partner",
  fields: () => ({
    p_id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    phone: { type: GraphQLString },
    email: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },
    description: { type: GraphQLString },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },    
  }),
});
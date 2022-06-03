const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");

exports.UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    u_id: { type: GraphQLFloat },
    u_type: { type: GraphQLInt},
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },   
    password: { type: GraphQLString },
    created: { type: GraphQLInt },
    updated: { type: GraphQLInt },
  }),
});

exports.UserWithoutPassType = new GraphQLObjectType({
  name: "UserWithoutPass",
  fields: () => ({
    u_id: { type: GraphQLFloat },
    u_type: { type: GraphQLInt},
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },   
    created: { type: GraphQLInt },
    updated: { type: GraphQLInt },
  }),
});
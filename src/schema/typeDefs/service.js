const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLInt } = require("graphql");

exports.ServiceType = new GraphQLObjectType({
  name: "Service",
  fields: () => ({
    s_id: { type: GraphQLID },
    service_name: { type: GraphQLString },
    m_type_id: { type: GraphQLFloat },
    appointments_number: { type: GraphQLInt},
    appointment_duration: { type: GraphQLInt},
    service_cost: { type: GraphQLFloat},
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});
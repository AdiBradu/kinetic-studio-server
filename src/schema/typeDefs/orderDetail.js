const { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLInt } = require("graphql");

exports.OrderDetailType = new GraphQLObjectType({
  name: "OrderDetail",
  fields: () => ({
    od_id: { type: GraphQLID },
    order_id: { type: GraphQLFloat },
    partner_id: { type: GraphQLFloat },
    appointment_start: { type: GraphQLFloat },
    appointment_end: { type: GraphQLFloat }, 
    appointment_order: { type: GraphQLInt },   
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});
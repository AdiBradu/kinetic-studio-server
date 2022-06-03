const { GraphQLObjectType, GraphQLID, GraphQLFloat, GraphQLInt, GraphQLInputObjectType, GraphQLString } = require("graphql");

exports.OrderDetailType = new GraphQLObjectType({
  name: "OrderDetail",
  fields: () => ({
    od_id: { type: GraphQLFloat },
    order_id: { type: GraphQLFloat },
    partner_id: { type: GraphQLFloat },
    partnerName: { type: GraphQLString },
    appointment_start: { type: GraphQLFloat },
    appointment_end: { type: GraphQLFloat }, 
    appointment_order: { type: GraphQLInt },   
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});

exports.OrderDetailInput = new GraphQLInputObjectType({
  name: 'OderDetailIn',
  fields: () => ({
    partner_id: { type: GraphQLFloat },
    appointment_start: { type: GraphQLFloat },
    appointment_end: { type: GraphQLFloat }, 
    appointment_order: { type: GraphQLInt },
  }),
});
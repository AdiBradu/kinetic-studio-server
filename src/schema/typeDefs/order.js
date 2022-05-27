const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLList } = require("graphql");
const { OrderDetailType } = require("./orderDetail");

exports.OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    o_id: { type: GraphQLID },
    customer_first_name: { type: GraphQLString },
    customer_last_name: { type: GraphQLString },
    customer_phone: { type: GraphQLString },
    customer_email: { type: GraphQLString },
    customer_region: { type: GraphQLString },
    customer_city: { type: GraphQLString },
    customer_street: { type: GraphQLString },
    customer_street_number: { type: GraphQLString },
    service_id: { type: GraphQLFloat },
    order_subtotal: { type: GraphQLFloat },
    order_total: { type: GraphQLFloat },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
    details: { 
      type: new GraphQLList(OrderDetailType),
      async resolve(parent, args, context) { 
        const { loaders } = context;
        const { orderDetailsLoader } = loaders;
        return orderDetailsLoader.load(parent.o_id);
      }
    },
  }),
});
const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { OrderDetailType } = require("../typeDefs/orderDetail");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_ORDER_DETAILS = {
  type: new GraphQLList(OrderDetailType),
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;    
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM order_details WHERE order_id = ? ORDER BY appointment_order`;
    const odets = await conn.promise().query(sql, [args.id]);    
    return odets[0];
  },
};
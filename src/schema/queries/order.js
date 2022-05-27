const { GraphQLList, GraphQLID } = require("graphql");
const { OrderType } = require("../typeDefs/order");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_ORDERS = {
  type: new GraphQLList(OrderType),
  async resolve(parent, args, context) {    
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM orders`;
    const orders = await conn.promise().query(sql);    
    return orders[0];
  },
};

exports.GET_ORDER = {
  type: OrderType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM orders WHERE o_id = ?`;
    let order = await conn.promise().query(sql, [args.id]);
    return order[0][0]; 
  },
};
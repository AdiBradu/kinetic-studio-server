const { GraphQLList, GraphQLID, GraphQLFloat, GraphQLInt } = require("graphql");
const { OrderType, OrderAdminType } = require("../typeDefs/order");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_ORDERS = {
  type: new GraphQLList(OrderAdminType),
  args: {
    offset: { type: GraphQLInt },
    limit: { type: GraphQLInt },
  },
  async resolve(parent, args, context) {    
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT orders.*, services.service_name, (SELECT COUNT(o_id) FROM orders WHERE 1) AS totalCount
               FROM orders 
               LEFT JOIN services ON orders.service_id = services.s_id 
               ORDER BY orders.created DESC
               LIMIT ? , ?
              `;                     
    const orders = await conn.promise().query(sql,[args.offset, args.limit]);    
    return orders[0];
  },
};

exports.GET_ORDER = {
  type: OrderType,
  args: {
    id: { type: GraphQLFloat },
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
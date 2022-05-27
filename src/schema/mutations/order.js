const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");
const { OrderType } = require("../typeDefs/order");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_ORDER = {
  type: MessageType,
  args: {
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    region: { type: GraphQLString }, 
    city: { type: GraphQLString }, 
    street: { type: GraphQLString }, 
    streetNumber: { type: GraphQLString }, 
    serviceId: { type: GraphQLFloat }, 
    subtotal: { type: GraphQLFloat }, 
    total: { type: GraphQLFloat }, 
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    const sql = `INSERT INTO orders
    (customer_first_name, customer_last_name, customer_phone, customer_email, customer_region, customer_city, customer_street, customer_street_number, service_id, order_subtotal, order_total, created, updated) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [args.firstName, args.lastName, args.phone, args.email, args.region, args.city, args.street, args.streetNumber, args.serviceId, args.subtotal, args.total, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};


exports.UPDATE_ORDER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    region: { type: GraphQLString }, 
    city: { type: GraphQLString }, 
    street: { type: GraphQLString }, 
    streetNumber: { type: GraphQLString }, 
    serviceId: { type: GraphQLFloat }, 
    subtotal: { type: GraphQLFloat }, 
    total: { type: GraphQLFloat },   
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT order_total FROM orders WHERE o_id = ?`;
    const order = await conn.promise().query(sql, [args.id]);    
    if (!order[0].length) {
      throw new Error("Order not found");
    }
    let sqlUpd = `UPDATE orders 
                  SET customer_first_name = ?, customer_last_name = ?, customer_phone = ?, customer_email = ?, customer_region = ?, customer_city = ?, customer_street = ?, customer_street_number = ?, service_id = ?, order_subtotal = ?, order_total = ?, updated = ? 
                  WHERE o_id = ? `;
    let params = [args.firstName, args.lastName, args.phone, args.email, args.region, args.city, args.street, args.streetNumber, args.serviceId, args.subtotal, args.total, Date.now(), args.id];
    await conn.promise().query(sqlUpd, params);
    return { successful: true, message: "Order updated!" };
  },
};

exports.DELETE_ORDER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM orders WHERE o_id = ?`, [args.id]);
    return { successful: true, message: "Order successfully deleted" };
  },
};
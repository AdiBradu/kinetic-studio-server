const { GraphQLID, GraphQLInt, GraphQLFloat } = require("graphql");
const { OrderDetailType } = require("../typeDefs/orderDetail");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_ORDER_DETAIL = {
  type: MessageType,
  args: {
    orderId: { type: GraphQLFloat }, 
    partnerId: { type: GraphQLFloat },   
    startTime: { type: GraphQLFloat },
    endTime: { type: GraphQLFloat }, 
    scheduleOrder: { type: GraphQLInt },   
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const sql = `INSERT INTO order_details
    (order_id, partner_id, appointment_start, appointment_end, appointment_order, created, updated) VALUES (?,?,?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [args.orderId, args.partnerId, args.startTime, args.endTime, args.scheduleOrder, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};


exports.UPDATE_ORDER_DETAIL = {
  type: MessageType,
  args: {   
    orderId: { type: GraphQLFloat }, 
    partnerId: { type: GraphQLFloat },   
    startTime: { type: GraphQLFloat },
    endTime: { type: GraphQLFloat }, 
    scheduleOrder: { type: GraphQLInt },       
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }   
    let sql = `SELECT service_id FROM orders WHERE o_id = ?`;
    const odets = await conn.promise().query(sql, [args.orderId]);    
    if (!odets[0].length) {
      throw new Error("Not found");
    }
    await conn.promise().query(`UPDATE order_details SET partner_id = ? , appointment_start = ? , appointment_end = ? ,  updated = ? WHERE (order_id = ? AND appointment_order = ?)  `, [args.partnerId, args.startTime, args.endTime, Date.now(), args.orderId, args.scheduleOrder]);
    return { successful: true, message: "Order detail updated!" };
  },
};

exports.DELETE_ORDER_DETAIL = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM order_details WHERE od_id = ?`, [args.id]);
    return { successful: true, message: "Order detail successfully deleted" };
  },
};
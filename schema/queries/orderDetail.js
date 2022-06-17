const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { OrderDetailType } = require("../typeDefs/orderDetail");
const conn = require('../../db/db_connection.js');
const { PartnerScheduledType } = require("../typeDefs/partnerSchedule");

exports.GET_ALL_ORDER_DETAILS = {
  type: new GraphQLList(OrderDetailType),
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;    
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT order_details.*, CONCAT(partners.first_name, " ", partners.last_name) AS partnerName 
               FROM order_details 
               LEFT JOIN partners ON order_details.partner_id = partners.p_id 
               WHERE order_details.order_id = ? ORDER BY order_details.appointment_order`;
         
    const odets = await conn.promise().query(sql, [args.id]);    
    return odets[0];
  },
};

exports.GET_PARTNER_FILLED_TIME_SLOTS = {
  type: new GraphQLList(PartnerScheduledType),
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const retArr = [];
    if(args.id) {
      let now = new Date();
      let startTime = now.setHours(0,0,0,0);
      let endTime = startTime + 92*24*3600*1000;
      let sql = `SELECT appointment_start, appointment_end FROM order_details WHERE partner_id = ? AND ( appointment_start >= ? AND appointment_end <= ?)`;
      let schedule = await conn.promise().query(sql, [args.id, startTime, endTime]);
      if(schedule[0] && schedule[0].length) {
        schedule[0].forEach((el) => {
          const objPartnerSched = {
            schedule_start: el.appointment_start,
            schedule_end: el.appointment_end,
          
          };
          retArr.push(objPartnerSched);
        });
      }
    }
    return retArr; 
  },
}
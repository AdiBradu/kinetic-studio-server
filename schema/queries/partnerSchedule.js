const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { PartnerScheduleType, PartnerScheduledType } = require("../typeDefs/partnerSchedule");
const conn = require('../../db/db_connection.js');

exports.GET_ENTIRE_PARTNER_SCHEDULE = {
  type: new GraphQLList(PartnerScheduleType),
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;    
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM partner_schedule WHERE partner_id = ?`;
    const schedule = await conn.promise().query(sql, [args.id]);    
    return schedule[0];
  },
};

exports.GET_PARTNER_SCHEDULE_RANGE = {
  type: new GraphQLList(PartnerScheduleType),
  args: {
    id: { type: GraphQLID },
    startTime: { type: GraphQLFloat },
    endTime: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM partner_schedule WHERE partner_id = ? AND ( schedule_start >= ? AND schedule_end <= ?)`;
    let schedule = await conn.promise().query(sql, [args.id, args.startTime, args.endTime]);
    return schedule[0]; 
  },
};


exports.GET_PARTNER_CURRENT_SCHEDULE = {
  type: new GraphQLList(PartnerScheduledType),
  args: {
    id: { type: GraphQLFloat },    
  },
  async resolve(parent, args, context) {
    if(args.id) {
      let now = new Date();
      let startTime = now.setHours(0,0,0,0);
      let endTime = startTime + 92*24*3600*1000;
      let sql = `SELECT * FROM partner_schedule WHERE partner_id = ? AND ( schedule_start >= ? AND schedule_end <= ?)`;
      let schedule = await conn.promise().query(sql, [args.id, startTime, endTime]);    
      return schedule[0]; 
    } else {
      return [];
    }
  },
};
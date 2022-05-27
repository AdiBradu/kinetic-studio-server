const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");
const { PartnerScheduleType } = require("../typeDefs/partnerSchedule");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_PARTNER_SCHEDULE = {
  type: MessageType,
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
    const { id, startTime, endTime } = args;      
    const sql = `INSERT INTO partner_schedule
    (partner_id, schedule_start, schedule_end, created, updated) VALUES (?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [id, startTime, endTime, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};


exports.UPDATE_PARTNER_SCHEDULE = {
  type: MessageType,
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
    const { id, startTime, endTime } = args;      
    let sql = `SELECT partner_id FROM partner_schedule WHERE ps_id = ?`;
    const pschedule = await conn.promise().query(sql, [id]);    
    if (!pschedule[0].length) {
      throw new Error("Not found");
    }
    await conn.promise().query(`UPDATE partner_schedule SET schedule_start = ? , schedule_end = ? , updated = ? WHERE ps_id = ? `, [startTime, endTime, Date.now(), id]);
    return { successful: true, message: "Partner schedule updated!" };
  },
};

exports.DELETE_PARTNER_SCHEDULE = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM partner_schedule WHERE ps_id = ?`, [args.id]);
    return { successful: true, message: "Partner schedule successfully deleted" };
  },
};
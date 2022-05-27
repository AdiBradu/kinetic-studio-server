const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");
const { AreaType } = require("../typeDefs/area");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_AREA = {
  type: MessageType,
  args: {
    name: { type: GraphQLString }, 
    extra_charge: { type: GraphQLFloat },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const { name, extra_charge } = args;      
    const sql = `INSERT INTO areas
    (a_name, a_extra_charge, created, updated) VALUES (?,?,?,?)`;
    const result = await conn.promise().query(sql, [name, extra_charge, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Area created!" };
  },
};


exports.UPDATE_AREA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    name: { type: GraphQLString }, 
    extra_charge: { type: GraphQLFloat },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const a_id = args.id;     
    const a_name = args.name;     
    const a_extra_charge = args.extra_charge;   

    let sql = `SELECT a_name FROM areas WHERE a_id = ?`;
    const area = await conn.promise().query(sql, [a_id]);    
    if (!area[0].length) {
      throw new Error("Area not found");
    }

    await conn.promise().query(`UPDATE areas SET a_name = ? , a_extra_charge = ? , updated = ? WHERE a_id = ? `, [a_name, a_extra_charge, Date.now(), a_id]);
    return { successful: true, message: "Area updated!" };
  },
};

exports.DELETE_AREA = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM areas WHERE a_id = ?`, [args.id]);
    return { successful: true, message: "Area successfully deleted" };
  },
};
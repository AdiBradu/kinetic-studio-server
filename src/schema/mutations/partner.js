const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");
const { PartnerType } = require("../typeDefs/partner");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_PARTNER = {
  type: MessageType,
  args: {
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    profilePictureUrl: { type: GraphQLString }, 
    description: { type: GraphQLString }, 
    mTypes: { type: GraphQLString },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
      
    const sql = `INSERT INTO partners
    (first_name, last_name, phone, email, profile_picture_url, m_types, description, created, updated) VALUES (?,?,?,?,?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [args.firstName, args.lastName, args.phone, args.email, args.profilePictureUrl, args.mTypes, args.description, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};


exports.UPDATE_PARTNER = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    profilePictureUrl: { type: GraphQLString }, 
    description: { type: GraphQLString },        
    mTypes: { type: GraphQLString },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT email, phone FROM partners WHERE p_id = ?`;
    const partner = await conn.promise().query(sql, [a_id]);    
    if (!partner[0].length) {
      throw new Error("Partner not found");
    }
    await conn.promise().query(`UPDATE partners SET first_name = ? , last_name = ? , phone = ? , email = ? , profile_picture_url = ? , m_types = ? , description = ? , updated = ? WHERE p_id = ? `, [args.firstName, args.lastName, args.phone, args.email, args.profilePictureUrl, args.mTypes, args.description, Date.now(), args.id]);
    return { successful: true, message: "Partner updated!" };
  },
};

exports.DELETE_PARTNER = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM partners WHERE p_id = ?`, [args.id]);
    return { successful: true, message: "Partner successfully deleted" };
  },
};
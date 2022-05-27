const { GraphQLList, GraphQLID } = require("graphql");
const { PartnerType } = require("../typeDefs/partner");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_PARTNERS = {
  type: new GraphQLList(PartnerType),
  async resolve(parent, args, context) {
    const { req } = context;    
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM partners`;
    const partners = await conn.promise().query(sql);    
    return partners[0];
  },
};

exports.GET_PARTNER = {
  type: PartnerType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;    
    let sql = `SELECT * FROM partners WHERE p_id = ?`;
    let partner = await conn.promise().query(sql, [args.id]);
    return partner[0][0]; 
  },
};
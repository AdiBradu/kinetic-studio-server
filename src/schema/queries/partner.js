const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { PartnerType } = require("../typeDefs/partner");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_PARTNERS = {
  type: new GraphQLList(PartnerType),
  async resolve(parent, args, context) {    
    let sql = `SELECT * FROM partners WHERE is_deleted < 1`;
    const partners = await conn.promise().query(sql);    
    return partners[0];
  },
};

exports.GET_PARTNER = {
  type: PartnerType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;    
    let sql = `SELECT * FROM partners WHERE p_id = ? AND is_deleted < 1`;
    let partner = await conn.promise().query(sql, [args.id]);
    return partner[0][0]; 
  },
};
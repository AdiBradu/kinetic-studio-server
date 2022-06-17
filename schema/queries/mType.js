const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { MType } = require("../typeDefs/mType");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_M_TYPES = {
  type: new GraphQLList(MType),
  async resolve(parent, args, context) {      
    let sql = `SELECT * FROM m_types`;
    const mTypes = await conn.promise().query(sql);    
    return mTypes[0];
  },
};

exports.GET_M_TYPE = {
  type: MType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {   
    let sql = `SELECT * FROM m_types WHERE mt_id = ?`;
    let mType = await conn.promise().query(sql, [args.id]);
    return mType[0][0]; 
  },
};


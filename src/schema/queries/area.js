const { GraphQLList, GraphQLID } = require("graphql");
const { AreaType } = require("../typeDefs/area");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_AREAS = {
  type: new GraphQLList(AreaType),
  async resolve(parent, args, context) {    
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM areas`;
    const areas = await conn.promise().query(sql);    
    return areas[0];
  },
};

exports.GET_AREA = {
  type: AreaType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM areas WHERE a_id = ?`;
    let area = await conn.promise().query(sql, [args.id]);
    return area[0][0]; 
  },
};
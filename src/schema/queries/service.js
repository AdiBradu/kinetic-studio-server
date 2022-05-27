const { GraphQLList, GraphQLID } = require("graphql");
const { ServiceType } = require("../typeDefs/service");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_SERVICES = {
  type: new GraphQLList(ServiceType),
  async resolve(parent, args, context) {        
    let sql = `SELECT * FROM services`;
    const services = await conn.promise().query(sql);    
    return services[0];
  },
};

exports.GET_SERVICE = {
  type: ServiceType,
  args: {
    id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM services WHERE s_id = ?`;
    let service = await conn.promise().query(sql, [args.id]);
    return service[0][0]; 
  },
};
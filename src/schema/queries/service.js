const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { ServiceType } = require("../typeDefs/service");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_SERVICES = {
  type: new GraphQLList(ServiceType),
  async resolve(parent, args, context) {        
    let sql = `SELECT services.* , m_types.mt_name 
              FROM services 
              LEFT JOIN m_types ON services.m_type_id = m_types.mt_id 
              `;
    const services = await conn.promise().query(sql);        
    return services[0];
  },
};

exports.GET_SERVICE = {
  type: ServiceType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT services.* , m_types.mt_name 
               FROM services 
               LEFT JOIN m_types ON services.m_type_id = m_types.mt_id 
               WHERE services.s_id = ?`;
    let service = await conn.promise().query(sql, [args.id]);
    return service[0][0]; 
  },
};
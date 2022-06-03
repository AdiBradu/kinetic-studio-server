const { GraphQLList, GraphQLID, GraphQLFloat } = require("graphql");
const { EmailType } = require("../typeDefs/email");
const conn = require('../../db/db_connection.js');

exports.GET_ALL_EMAILS = {
  type: new GraphQLList(EmailType),
  async resolve(parent, args, context) {
    const { req } = context;    
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM emails`;
    const emails = await conn.promise().query(sql);    
    return emails[0];
  },
};

exports.GET_EMAIL = {
  type: EmailType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM emails WHERE e_id = ?`;
    let email = await conn.promise().query(sql, [args.id]);
    return email[0][0]; 
  },
};
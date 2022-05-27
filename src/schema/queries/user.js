const { GraphQLList } = require("graphql");
const { UserType } = require("../typeDefs/user");
const conn = require('../../db/db_connection.js');

exports.ME = {
  type: UserType,
  resolve(parent, args, context) {
    const { req } = context;
    const currentU =(req?.session?.currentUser ? req.session.currentUser : null);
    return currentU;
  },
};

exports.GET_ALL_USERS = {
  type: new GraphQLList(UserType),
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT * FROM users`;
    let users = await conn.promise().query(sql);
    return users[0];
  },
};
const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");
const { MType } = require("../typeDefs/mType");
const { MessageType } = require("../typeDefs/messages");
const conn = require("../../db/db_connection.js");

exports.CREATE_M_TYPE = {
  type: MessageType,
  args: {
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const { name } = args;
    const sql = `INSERT INTO m_types
    (mt_name, created, updated) VALUES (?,?,?)`;
    const result = await conn
      .promise()
      .query(sql, [name.toLowerCase(), Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;
    let successful = false;
    if (result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};

exports.UPDATE_M_TYPE = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
    name: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT mt_name FROM m_types WHERE mt_id = ?`;
    const mType = await conn.promise().query(sql, [args.id]);
    if (!mType[0].length) {
      throw new Error("M type not found");
    }
    await conn
      .promise()
      .query(`UPDATE m_types SET mt_name = ? , updated = ? WHERE mt_id = ? `, [
        args.name,
        Date.now(),
        args.id,
      ]);
    return { successful: true, message: "Updated!" };
  },
};

exports.DELETE_M_TYPE = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let successful = false;
    let message = `Eroare! Specializare este inclusa in unul sau mai multe servicii`;
    let sqlHasS = `SELECT s_id FROM services WHERE m_type_id = ?`;
    let resHasS = await conn.promise().query(sqlHasS, [args.id]);
    if (!resHasS[0].length) {
      await conn
        .promise()
        .query(`DELETE FROM m_types WHERE mt_id = ?`, [args.id]);
      successful = true;
      message = `Specializare deleted`;
    }
    return { successful: successful, message: message };
  },
};

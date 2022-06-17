const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList } = require("graphql");
const { EmailType, EmailInputType } = require("../typeDefs/email");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');

exports.CREATE_EMAIL = {
  type: MessageType,
  args: {
    email_subject: { type: GraphQLString }, 
    email_body: { type: GraphQLString },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const { email_subject, email_body } = args;      
    const sql = `INSERT INTO emails
    (email_subject, email_body, created, updated) VALUES (?,?,?,?)`;
    const result = await conn.promise().query(sql, [email_subject.toLowerCase(), email_body.toLowerCase(), Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};


exports.UPDATE_EMAIL = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
    email_subject: { type: GraphQLString }, 
    email_body: { type: GraphQLFloat },    
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT email_subject FROM emails WHERE e_id = ?`;
    const email = await conn.promise().query(sql, [args.id]);    
    if (!email[0].length) {
      throw new Error("Email not found");
    }

    await conn.promise().query(`UPDATE emails SET email_subject = ? , email_body = ? , updated = ? WHERE e_id = ? `, [email_subject, email_body, Date.now(), args.id]);
    return { successful: true, message: "Email updated!" };
  },
};


exports.HANDLE_EMAILS = {
  type: MessageType,
  args: {
    emails: { type: new GraphQLList(EmailInputType) }
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    for (let el of args.emails.slice()) {
      if(el.id > 0) {
        await conn.promise().query(`UPDATE emails SET email_subject = ? , email_body = ? , updated = ? WHERE e_id = ? `, [el.email_subject, el.email_body, Date.now(), el.id]);
      } else {
        let sql = `INSERT INTO emails
        (email_subject, email_body, created, updated) VALUES (?,?,?,?)`;
        let result = await conn.promise().query(sql, [el.email_subject, el.email_body, Date.now(), Date.now()]);
      }
    }
    return { successful: true, message: "Success!" };
  },
}

exports.DELETE_EMAIL = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM emails WHERE e_id = ?`, [args.id]);
    return { successful: true, message: "Email successfully deleted" };
  },
};
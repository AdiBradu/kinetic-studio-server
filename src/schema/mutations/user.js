const { GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const { UserType, UserWithoutPassType } = require("../typeDefs/user");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');
const bcrypt = require('bcryptjs');

exports.CREATE_USER = {
  type: GraphQLInt,
  args: {
    email: { type: GraphQLString }, 
    password: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const { email, password } = args;    
    let pass = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users
    (email, password, created, updated) VALUES (?,?,?,?)`;
    const result = await conn.promise().query(sql, [email, pass, Date.now(), Date.now()]);
    const lastInsId = result ? result.insertId : 0;    
    return result[0].insertId;
  },
};

exports.UPDATE_PASSWORD = {
  type: MessageType,
  args: {
    email: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const { email, oldPassword, newPassword } = args;
    let sql = `SELECT password FROM users WHERE email = ?`;
    const user = await conn.promise().query(sql, [email]);

    if (!user[0].length) {
      throw new Error("User not found");
    }
    const userPassword = user[0][0]?.password;
    const oldUPass = await bcrypt.hash(oldPassword, 10);
    if (oldUPass === userPassword) {
      let newUPass = await bcrypt.hash(newPassword, 10);
      await conn.promise().query(`UPDATE users SET password = ? WHERE email = ?`, [newUPass, email]);
      return { successful: true, message: "PASSWORD UPDATED" };
    } else {
      throw new Error("Wrong password!");
    }
  },
};


exports.UPDATE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    oldPassword: { type: GraphQLString },
    newPassword: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    let sql = `SELECT password FROM users WHERE u_id = ?`;
    const user = await conn.promise().query(sql, [id]);

    if (!user[0].length) {
      throw new Error("User not found");
    }
    const userPassword = user[0][0]?.password;
    const oldUPass = await bcrypt.hash(oldPassword, 10);
    if (oldUPass === userPassword) {
      let newUPass = await bcrypt.hash(newPassword, 10);
      await conn.promise().query(`UPDATE users SET password = ? , email = ? , first_name = ? , last_name = ? , phone = ? WHERE u_id = ?`, [newUPass, args.email, args.fistName, args.lastName, args.phone, id]);
      return { successful: true, message: "USER UPDATED" };
    } else {
      throw new Error("User update error!");
    }
  },
};


exports.LOGIN_USER = {
  type: UserWithoutPassType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },  
  },
  async resolve(parent, args, context) {
    const { req } = context;
    let sql = `SELECT * FROM users WHERE email = ?`;
    const user = await conn.promise().query(sql, [args.email]);

    if (!user[0].length) {
      throw new Error("Login error!");
    }  
    const userPassword = user[0][0]?.password;   
    const isMatch = await bcrypt.compare(args.password, userPassword);
    if (isMatch) {
      const { password, ...userWithoutPassword } = user[0][0];  
      req.session.currentUser = userWithoutPassword;
      req.session.userId = userWithoutPassword.u_id;      
     
      return userWithoutPassword;
    } else {
      throw new Error("Login error!");
    }
  },
};

exports.LOGOUT_USER = {
  type: MessageType,
  async resolve(parent, args, req) {
    await req.session.destroy();   
    return { successful: true, message: "Logged out!" };
  },
};
const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat } = require("graphql");
const { UserType, UserWithoutPassType } = require("../typeDefs/user");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');
const bcrypt = require('bcryptjs');

exports.CREATE_USER = {
  type: MessageType,
  args: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString }, 
    phone: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString }, 
    newPassword: { type: GraphQLString },
    confirmPassword: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
       
    if(args.email.length < 3 || args.newPassword !== args.confirmPassword) {
      throw new Error("Error!");  
    }


    let sql = `INSERT INTO users `;
    let pass = await bcrypt.hash(args.newPassword, 10);
    let insParams = [args.email.toLowerCase(), pass];
    let insFieldsString = ` (email, password `;
    let insValuesString = ` VALUES (?,? `;

    if(args.phone && args.phone.length) {
      insFieldsString += `,phone `;
      insValuesString += `,?`;      
      insParams.push(args.phone);  
    }

    if(args.profile_picture_url && args.profile_picture_url.length) {
      insFieldsString += `,profile_picture_url `;
      insValuesString += `,?`;  
      insParams.push(args.profile_picture_url);  
    }

    if(args.firstName && args.firstName.length) {
      insFieldsString += `,first_name `;
      insValuesString += `,?`;      
      insParams.push(args.firstName.toLowerCase());  
    }

    if(args.lastName && args.lastName.length) {
      insFieldsString += `,last_name `;
      insValuesString += `,?`;      
      insParams.push(args.lastName.toLowerCase());   
    }
    insFieldsString += `,created,updated) `;
    insValuesString += `,?,?);`;      
    insParams.push(Date.now());
    insParams.push(Date.now());
    sql += insFieldsString;
    sql += insValuesString;

    const result = await conn.promise().query(sql, insParams);
    let successful = false;
    if(result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "User created!" };
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
    id: { type: GraphQLFloat },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    profile_picture_url: { type: GraphQLString },
    newPassword: { type: GraphQLString },
    confirmPassword: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    let sql = `SELECT password FROM users WHERE u_id = ?`;
    const user = await conn.promise().query(sql, [args.id]);

    if (!user[0].length) {
      throw new Error("User not found");
    }
    let updParams = [args.email];
    let updString = ` UPDATE users SET email = ? `;
    if(args.phone && args.phone.length) {
      updString += ` , phone = ?`;
      updParams.push(args.phone);  
    }

     if(args.profile_picture_url && args.profile_picture_url.length) {
      updString += ` , profile_picture_url = ?`;
      updParams.push(args.profile_picture_url);  
    }
    
    if(args.firstName && args.firstName.length) {
      updString += ` , first_name = ?`;
      updParams.push(args.firstName);  
    }

    if(args.lastName && args.lastName.length) {
      updString += ` , last_name = ?`;
      updParams.push(args.lastName);  
    }
 
    if (args.newPassword.length > 3 && args.newPassword === args.confirmPassword) {
      let newUPass = await bcrypt.hash(args.newPassword, 10);
      updString += ` , password = ?`;
      updParams.push(newUPass);  
    } 
    updString += ` WHERE u_id = ?`;
    updParams.push(args.id);

    await conn.promise().query(updString, updParams);
    return { successful: true, message: "USER UPDATED" };

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
  async resolve(parent, args, context) {
    const { req } = context;
    await req.session.destroy();   
    return { successful: true, message: "Logged out!" };
  },
};

exports.DELETE_USER = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }   
    let successful = false; 
    let retMsg = 'Can not delete your own user';
    if(args.id !== parseFloat(req.session.userId)){
      await conn.promise().query(`DELETE FROM users WHERE u_id = ?`, [args.id]);
      successful = true;
      retMsg = 'User successfully deleted';
    }
    return { successful: successful, message: retMsg };
  },
};
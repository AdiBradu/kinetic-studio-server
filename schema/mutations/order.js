const { GraphQLID, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList } = require("graphql");
const { OrderType } = require("../typeDefs/order");
const { MessageType } = require("../typeDefs/messages");
const conn = require('../../db/db_connection.js');
const { OrderDetailInput } = require("../typeDefs/orderDetail");
const transporter = require('../../email/mail.js');
const dotenv = require('dotenv');
dotenv.config();

exports.CREATE_ORDER = {
  type: MessageType,
  args: {
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    region: { type: GraphQLString }, 
    city: { type: GraphQLString }, 
    street: { type: GraphQLString }, 
    streetNumber: { type: GraphQLString }, 
    serviceId: { type: GraphQLFloat },
    details: { type: new GraphQLList(OrderDetailInput) }
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }      
    let sqlSPrice = `SELECT service_cost, appointments_number FROM services WHERE s_id = ? `;
    let resSPrice = await conn.promise().query(sqlSPrice, [args.serviceId]);
    if(!resSPrice[0].length) {
      throw new Error("Error creating new order");
    }
    let orderSubTotal = parseFloat(resSPrice[0][0].service_cost);
    let orderTotal = orderSubTotal;

    let sqlAddtionalCost = `SELECT a_extra_charge FROM areas WHERE LOWER(a_name) = ? `;
    let resAdditionalCost = await conn.promise().query(sqlAddtionalCost, [args.region.toLowerCase()]);
    let extraCharge = 0;
    if(resAdditionalCost[0].length) {
      extraCharge = parseFloat(resAdditionalCost[0][0].a_extra_charge);  
    }
    orderTotal = orderTotal + extraCharge; 
    const sql = `INSERT INTO orders
    (customer_first_name, customer_last_name, customer_phone, customer_email, customer_region, customer_city, customer_street, customer_street_number, service_id, order_subtotal, order_total, created, updated) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [args.firstName.toLowerCase(), args.lastName.toLowerCase(), args.phone, args.email.toLowerCase(), args.region.toLowerCase(), args.city.toLowerCase(), args.street.toLowerCase(), args.streetNumber.toLowerCase(), args.serviceId, orderSubTotal, orderTotal, Date.now(), Date.now()]);
    const lastInsId = result ? result[0].insertId : 0;    
    let successful = false;
    if(!result[0].insertId) {
      throw new Error("Error creating new order");  
    }
    
    if(args.details.length > 0) {
      for (let el of args.details.slice()) {
        let sqlODets = `INSERT INTO order_details (order_id, partner_id, appointment_start, appointment_end, appointment_order, created, updated)
                        VALUES(?,?,?,?,?,?,?) `;
        let resQDets = await conn.promise().query(sqlODets, [lastInsId, el.partner_id, el.appointment_start, el.appointment_end, el.appointment_order, Date.now(), Date.now()]);                
        let lastODetsInsId = resQDets ? resQDets.insertId : 0;
        if(lastODetsInsId > 0) {
          successful = true;
        } else {
          successful = false;
        }
      }
      if(parseInt(resSPrice[0][0].appointments_number) > 1) {
        for (let i = 2; i <= parseInt(resSPrice[0][0].appointments_number); i++) {
          let sqlOExtraDets = `INSERT INTO order_details (order_id, partner_id, appointment_order, created, updated)
                        VALUES(?,?,?,?,?) `;
          await conn.promise().query(sqlOExtraDets, [lastInsId, args.details[0].partner_id, i, Date.now(), Date.now()]);                
        }
      }

    }
    
    return { successful: successful, message: "Created!" };
  },
};

exports.CREATE_CUSTOMER_ORDER = {
  type: MessageType,
  args: {
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    region: { type: GraphQLString }, 
    city: { type: GraphQLString }, 
    street: { type: GraphQLString }, 
    streetNumber: { type: GraphQLString }, 
    serviceId: { type: GraphQLFloat },
    details: { type: new GraphQLList(OrderDetailInput) }
  },
  async resolve(parent, args, context) {        
    let sqlSPrice = `SELECT service_cost, appointments_number FROM services WHERE s_id = ? `;
    let resSPrice = await conn.promise().query(sqlSPrice, [args.serviceId]);
    if(!resSPrice[0].length) {
      throw new Error("Error creating new order");
    }
    let orderSubTotal = parseFloat(resSPrice[0][0].service_cost);
    let orderTotal = orderSubTotal;

    let sqlAddtionalCost = `SELECT a_extra_charge FROM areas WHERE LOWER(a_name) = ? `;
    let resAdditionalCost = await conn.promise().query(sqlAddtionalCost, [args.region.toLowerCase()]);
    let extraCharge = 0;
    if(resAdditionalCost[0].length) {
      extraCharge = parseFloat(resAdditionalCost[0][0].a_extra_charge);  
    }
    orderTotal = orderTotal + extraCharge; 
    const sql = `INSERT INTO orders
    (customer_first_name, customer_last_name, customer_phone, customer_email, customer_region, customer_city, customer_street, customer_street_number, service_id, order_subtotal, order_total, created, updated) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    const result = await conn.promise().query(sql, [args.firstName, args.lastName, args.phone, args.email, args.region, args.city, args.street, args.streetNumber, args.serviceId, orderSubTotal, orderTotal, Date.now(), Date.now()]);
    const lastInsId = result ? result[0].insertId : 0;    
    let successful = false;
    if(!result[0].insertId) {
      throw new Error("Error creating new order");  
    }
    
    if(args.details.length > 0) {
      for (let el of args.details.slice()) {
        let sqlODets = `INSERT INTO order_details (order_id, partner_id, appointment_start, appointment_end, appointment_order, created, updated)
                        VALUES(?,?,?,?,?,?,?) `;
        let resQDets = await conn.promise().query(sqlODets, [lastInsId, el.partner_id, el.appointment_start, el.appointment_end, el.appointment_order, Date.now(), Date.now()]);                
        let lastODetsInsId = resQDets ? resQDets.insertId : 0;
        if(lastODetsInsId > 0) {
          successful = true;
        } else {
          successful = false;
        }
      }
      if(parseInt(resSPrice[0][0].appointments_number) > 1) {
        for (let i = 2; i <= parseInt(resSPrice[0][0].appointments_number); i++) {
          let sqlOExtraDets = `INSERT INTO order_details (order_id, partner_id, appointment_order, created, updated)
                        VALUES(?,?,?,?,?) `;
          await conn.promise().query(sqlOExtraDets, [lastInsId, args.details[0].partner_id, i, Date.now(), Date.now()]);                
        }
      }
      if(process.env.NODE_ENV === 'PRODUCTION') {
        let sqlMail = `SELECT email_subject, email_body FROM emails WHERE e_id = 1`;
        let mRes = await conn.promise().query(sqlMail);

        const mailData = {
          from: 'comenzi@kineticstudio.ro',  
          to: args.email,   
          subject: mRes[0][0].email_subject,
          html: mRes[0][0].email_body,
        };

        transporter.sendMail(mailData, function (err, info) {
          if(err)
            console.log(err)
        });
      }

    }
    
    return { successful: successful, message: "Created!" };
  },
};

exports.UPDATE_ORDER = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
    firstName: { type: GraphQLString }, 
    lastName: { type: GraphQLString }, 
    phone: { type: GraphQLString }, 
    email: { type: GraphQLString }, 
    region: { type: GraphQLString }, 
    city: { type: GraphQLString }, 
    street: { type: GraphQLString }, 
    streetNumber: { type: GraphQLString }, 
    serviceId: { type: GraphQLFloat }, 
    subtotal: { type: GraphQLFloat }, 
    total: { type: GraphQLFloat },   
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT order_total FROM orders WHERE o_id = ?`;
    const order = await conn.promise().query(sql, [args.id]);    
    if (!order[0].length) {
      throw new Error("Order not found");
    }
    let sqlUpd = `UPDATE orders 
                  SET customer_first_name = ?, customer_last_name = ?, customer_phone = ?, customer_email = ?, customer_region = ?, customer_city = ?, customer_street = ?, customer_street_number = ?, service_id = ?, order_subtotal = ?, order_total = ?, updated = ? 
                  WHERE o_id = ? `;
    let params = [args.firstName, args.lastName, args.phone, args.email, args.region, args.city, args.street, args.streetNumber, args.serviceId, args.subtotal, args.total, Date.now(), args.id];
    await conn.promise().query(sqlUpd, params);
    return { successful: true, message: "Order updated!" };
  },
};

exports.DELETE_ORDER = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if(!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }    
    await conn.promise().query(`DELETE FROM order_details WHERE order_id = ?`, [args.id]);
    await conn.promise().query(`DELETE FROM orders WHERE o_id = ?`, [args.id]);
    return { successful: true, message: "Order successfully deleted" };
  },
};
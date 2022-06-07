const {
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");
const { ServiceType } = require("../typeDefs/service");
const { MessageType } = require("../typeDefs/messages");
const conn = require("../../db/db_connection.js");

exports.CREATE_SERVICE = {
  type: MessageType,
  args: {
    service_name: { type: GraphQLString },
    type: { type: GraphQLFloat },
    appointments_number: { type: GraphQLInt },
    appointment_duration: { type: GraphQLInt },
    service_cost: { type: GraphQLFloat },
    profile_picture_url: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    const {
      service_name,
      type,
      appointments_number,
      appointment_duration,
      service_cost,
      profile_picture_url,
    } = args;
    const sql = `INSERT INTO services
    (service_name, m_type_id, appointments_number, appointment_duration, service_cost, profile_picture_url, created, updated) VALUES (?,?,?,?,?,?,?,?)`;
    const result = await conn
      .promise()
      .query(sql, [
        service_name,
        type,
        appointments_number,
        appointment_duration,
        service_cost,
        profile_picture_url,
        Date.now(),
        Date.now(),
      ]);
    const lastInsId = result ? result.insertId : 0;
    let successful = false;
    if (result[0].insertId && result[0].insertId > 0) {
      successful = true;
    }
    return { successful: successful, message: "Created!" };
  },
};

exports.UPDATE_SERVICE = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
    service_name: { type: GraphQLString },
    type: { type: GraphQLFloat },
    appointments_number: { type: GraphQLInt },
    appointment_duration: { type: GraphQLInt },
    service_cost: { type: GraphQLFloat },
    profile_picture_url: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    let sql = `SELECT service_name FROM services WHERE s_id = ?`;
    const area = await conn.promise().query(sql, [args.id]);
    if (!area[0].length) {
      throw new Error("Service not found");
    }

    await conn
      .promise()
      .query(
        `UPDATE services SET service_name = ? , m_type_id = ? , appointments_number = ? , appointment_duration = ? , service_cost = ? , profile_picture_url = ? , updated = ? WHERE s_id = ? `,
        [
          args.service_name,
          args.type,
          args.appointments_number,
          args.appointment_duration,
          args.service_cost,
          args.profile_picture_url,
          Date.now(),
          args.id,
        ]
      );
    return { successful: true, message: "Service updated!" };
  },
};

exports.DELETE_SERVICE = {
  type: MessageType,
  args: {
    id: { type: GraphQLFloat },
  },
  async resolve(parent, args, context) {
    const { req } = context;
    if (!req.session || !req.session.userId) {
      throw new Error("Access denied!");
    }
    await conn
      .promise()
      .query(`DELETE FROM services WHERE s_id = ?`, [args.id]);
    return { successful: true, message: "Service successfully deleted" };
  },
};

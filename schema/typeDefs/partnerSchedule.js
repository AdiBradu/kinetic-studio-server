const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
} = require("graphql");

exports.PartnerScheduleType = new GraphQLObjectType({
  name: "PartnerSchedule",
  fields: () => ({
    ps_id: { type: GraphQLID },
    partner_id: { type: GraphQLFloat },
    schedule_start: { type: GraphQLFloat },
    schedule_end: { type: GraphQLFloat },
    created: { type: GraphQLFloat },
    updated: { type: GraphQLFloat },
  }),
});

exports.PartnerScheduledType = new GraphQLObjectType({
  name: "PartnerScheduled",
  fields: () => ({
    ps_id: { type: GraphQLID },
    schedule_start: { type: GraphQLFloat },
    schedule_end: { type: GraphQLFloat },
  }),
});

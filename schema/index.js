const { GraphQLObjectType, GraphQLSchema } = require("graphql");
const { GET_ALL_USERS, ME, GET_USER } = require("./queries/user");
const { CREATE_USER, UPDATE_PASSWORD, UPDATE_USER, DELETE_USER, LOGOUT_USER, LOGIN_USER } = require("./mutations/user");
const { GET_ALL_AREAS, GET_AREA} = require("./queries/area");
const { CREATE_AREA, UPDATE_AREA, DELETE_AREA } = require("./mutations/area");
const { GET_ALL_M_TYPES, GET_M_TYPE } = require("./queries/mType");
const { CREATE_M_TYPE, UPDATE_M_TYPE, DELETE_M_TYPE } = require("./mutations/mType");
const { GET_ALL_SERVICES, GET_SERVICE } = require("./queries/service");
const { CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } = require("./mutations/service");
const { GET_ALL_EMAILS, GET_EMAIL } = require("./queries/email");
const { CREATE_EMAIL, UPDATE_EMAIL, DELETE_EMAIL, HANDLE_EMAILS } = require("./mutations/email");
const { GET_ENTIRE_PARTNER_SCHEDULE, GET_PARTNER_SCHEDULE_RANGE, GET_PARTNER_CURRENT_SCHEDULE } = require("./queries/partnerSchedule");
const { CREATE_PARTNER_SCHEDULE, UPDATE_PARTNER_SCHEDULE, DELETE_PARTNER_SCHEDULE } = require("./mutations/partnerSchedule");
const { GET_ALL_PARTNERS, GET_PARTNER } = require("./queries/partner");
const { CREATE_PARTNER, UPDATE_PARTNER, DELETE_PARTNER } = require("./mutations/partner");
const { GET_ALL_ORDER_DETAILS, GET_PARTNER_FILLED_TIME_SLOTS } = require("./queries/orderDetail");
const { CREATE_ORDER_DETAIL, UPDATE_ORDER_DETAIL, DELETE_ORDER_DETAIL } = require("./mutations/orderDetails");
const { GET_ALL_ORDERS, GET_ORDER } = require("./queries/order");
const { CREATE_ORDER, UPDATE_ORDER, DELETE_ORDER, CREATE_CUSTOMER_ORDER } = require("./mutations/order");

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getAllUsers: GET_ALL_USERS,
    me: ME,
    getUser: GET_USER,
    getAllAreas: GET_ALL_AREAS,
    getArea: GET_AREA, 
    getAllMTypes: GET_ALL_M_TYPES,
    getMType: GET_M_TYPE,  
    getAllServices: GET_ALL_SERVICES,
    getService: GET_SERVICE,
    getAllEmails: GET_ALL_EMAILS,
    getEmail: GET_EMAIL,
    getEntirePartnerSchedule: GET_ENTIRE_PARTNER_SCHEDULE,
    getPartnerScheduleRange: GET_PARTNER_SCHEDULE_RANGE,
    getPartnerCurrentSchedule: GET_PARTNER_CURRENT_SCHEDULE,
    getAllPartners: GET_ALL_PARTNERS,
    getPartner: GET_PARTNER,
    getAllOrderDetails: GET_ALL_ORDER_DETAILS,
    getPartnerFilledTimeSlots: GET_PARTNER_FILLED_TIME_SLOTS,
    getAllOrders: GET_ALL_ORDERS,
    getOrder: GET_ORDER,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: CREATE_USER,   
    updatePassword: UPDATE_PASSWORD,
    updateUser: UPDATE_USER,
    deleteUser: DELETE_USER,
    logout: LOGOUT_USER,
    login: LOGIN_USER,
    createArea: CREATE_AREA,
    updateArea: UPDATE_AREA,
    deleteArea: DELETE_AREA,
    createMType: CREATE_M_TYPE,
    updateMType: UPDATE_M_TYPE,
    deleteMType: DELETE_M_TYPE,
    createService: CREATE_SERVICE,
    updateService: UPDATE_SERVICE,
    deleteService: DELETE_SERVICE,
    createEmail: CREATE_EMAIL,
    updateEmail: UPDATE_EMAIL,
    handleEmails: HANDLE_EMAILS,
    deleteEmail: DELETE_EMAIL,
    createPartnerSchedule: CREATE_PARTNER_SCHEDULE,
    updatePartnerSchedule: UPDATE_PARTNER_SCHEDULE,
    deletePartnerSchedule: DELETE_PARTNER_SCHEDULE,
    createPartner: CREATE_PARTNER,
    updatePartner: UPDATE_PARTNER,
    deletePartner: DELETE_PARTNER,
    createOrderDetail: CREATE_ORDER_DETAIL,
    updateOrderDetail: UPDATE_ORDER_DETAIL,
    deleteOrderDetail: DELETE_ORDER_DETAIL,
    createOrder: CREATE_ORDER,
    createCustomerOrder: CREATE_CUSTOMER_ORDER,
    updateOrder: UPDATE_ORDER,
    deleteOrder: DELETE_ORDER,
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

module.exports = schema;
const DataLoader = require('dataloader');
const conn = require('../db/db_connection.js');
const { _ } = require('lodash');

exports.orderDetailsDataLoader = () => {
  return new DataLoader(orderDetailsByOrderIds);
}

async function orderDetailsByOrderIds(orderIds) {
  const sql = `
  SELECT order_details.*, CONCAT(partners.first_name, " ", partners.last_name) AS partnerName 
  FROM order_details 
  LEFT JOIN partners ON order_details.partner_id = partners.p_id 
  WHERE order_details.order_id IN ( ? );
  `;
  const params = [orderIds];
  const result = await conn.promise().query(sql, params);
  const ordersDetails = result[0];
  const groupedById = _.groupBy(ordersDetails, 'order_id');
  return orderIds.map(k => groupedById[k] || []);
}
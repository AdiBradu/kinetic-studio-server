const DataLoader = require('dataloader');
const conn = require('../db/db_connection.js');
const { _ } = require('lodash');

exports.orderDetailsDataLoader = () => {
  return new DataLoader(orderDetailsByOrderIds);
}

async function orderDetailsByOrderIds(orderIds) {
  const sql = `
  select * 
  from 
  order_details
  where order_id IN ( ? );
  `;
  const params = [orderIds];
  const result = await conn.promise().query(sql, params);
  const ordersDetails = result[0];
  const groupedById = _.groupBy(ordersDetails, 'order_id');
  return orderIds.map(k => groupedById[k] || []);
}
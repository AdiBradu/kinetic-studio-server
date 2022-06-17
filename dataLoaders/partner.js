const DataLoader = require('dataloader');
const conn = require('../db/db_connection.js');
const { _ } = require('lodash');

exports.partnerDataLoader = () => {
  return new DataLoader(partnerByIds);
}

async function partnerByIds(partnerIds) {
  const sql = `
  select * 
  from 
  partners
  where p_id IN ( ? );
  `;
  const params = [partnerIds];
  const result = await conn.promise().query(sql, params);
  const partners = result[0];
  const groupedById = _.groupBy(partners, 'p_id');
  return partnerIds.map(k => groupedById[k] || []);
}
import Sequelize from 'sequelize';

import config from 'config';

const { host, database, user, password } = config.mysql;

let mysqlUrl;
if (password) {
  mysqlUrl = `mysql://${user}:${password}@${host}/${database}`;
} else {
  mysqlUrl = `mysql://${user}@${host}/${database}`;
}
console.log(mysqlUrl);

export default new Sequelize(mysqlUrl, {
  define: {
    underscored: true,
    charset: 'utf8mb4'
  }
});

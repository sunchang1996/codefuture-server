import Sequelize from 'sequelize';
import sha1 from 'sha1';

import db from 'db';
import config from 'config';

const User = db.define(
  'user',
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    studentId: { type: Sequelize.STRING },
    avatar: {
      type: Sequelize.STRING,
      // defaultValue() {
      //   return `${config.baseUrl}`
      // }
    },
    nickname: { type: Sequelize.STRING },
    address: { type: Sequelize.STRING },
    gender: { type: Sequelize.STRING },
    age: { type: Sequelize.INTEGER },
    QQ: { type: Sequelize.STRING },
    passwordHash: { type: Sequelize.STRING },
    token: { type: Sequelize.STRING }
  }
);

export default User;

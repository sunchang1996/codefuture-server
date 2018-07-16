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
      defaultValue: `${config.baseUrl}/src/images/default.jpg`
    },
    nickname: { type: Sequelize.STRING }, // 昵称
    name: { type: Sequelize.STRING }, // 学名
    address: { type: Sequelize.STRING },
    gender: {
      type: Sequelize.ENUM,
      values: ['0', '1'],
      get() {
        if (this.getDataValue('gender') === '0') {
          return '女';
        }
        return '男';
      },
      set(value) {
        if (value === '男') {
          this.setDataValue('gender', '1');
        } else {
          this.setDataValue('gender', '0');
        }
      }
    },
    age: { type: Sequelize.INTEGER },
    QQ: { type: Sequelize.STRING },
    passwordHash: { type: Sequelize.STRING },
    token: { type: Sequelize.STRING }
  }
);

export default User;

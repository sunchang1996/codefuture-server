import sha1 from 'sha1';
import generateToken from 'utils/generateToken';
import User from 'models/user';

export async function initUser(password = '1234567890') {
  const user = await User.findOne({ sudentId: '213456' });
  if (user) {
    return;
  }

  await User.create({
    studentId: '123456',
    nickname: 'achang',
    address: '中国',
    gender: '男',
    age: 18,
    QQ: 123456789,
    passwordHash: sha1(password),
    token: generateToken()
  });
}

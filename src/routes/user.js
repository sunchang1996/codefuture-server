import sha1 from 'sha1';
import User from 'models/user';
import multer from 'koa-multer';
import _path from 'path';
import { request, summary, body, tags, formData, middlewares } from 'koa-swagger-decorator';

import generateToken from 'utils/generateToken';
import exception from 'class/exception';
import assertUserExists from 'middleware/user/assertUserExists';
import config from '../config';

const tag = tags(['User']);

const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, _path.resolve('src/images/'));
  },
  filename: (req, file, cb) => {
    const { name, ext } = _path.parse(file.originalname);
    cb(null, `${name}_${Date.now()}${ext}`);
  }
});

const userUpload = multer({ storage: userStorage });

export default class UserRouter {
  @request('post', '/user/register')
  @summary('注册用户')
  @tag
  @body({
    nickname: { type: 'string', required: true },
    password: { type: 'string', required: true }
  })
  static async register(ctx) {
    const { nickname, password } = ctx.validatedBody;

    const user = await User.create({
      nickname,
      passwordHash: sha1(password),
      token: generateToken()
    });

    ctx.body = { user };
  }

  @request('get', '/user/me')
  @tag
  @summary('获取当前用户信息')
  static async getCurrentUser(ctx) {
    ctx.body = { user: ctx.user };
  }

  @request('post', '/user/login')
  @tag
  @summary('用户登录')
  @body({
    studentId: { type: 'string', required: true, description: '用户的学生号' },
    password: { type: 'string', required: true, description: '用户密码' }
  })
  @middlewares([assertUserExists])
  static async login(ctx) {
    const { password } = ctx.validatedBody;
    const { user } = ctx;
    if (ctx.user.passwordHash !== sha1(password)) {
      throw new exception.ForbiddenError('密码错误');
    }

    user.token = generateToken();
    await user.save();
    ctx.body = { user };
  }

  @request('put', '/user/edit')
  @tag
  @summary('编辑用户信息')
  @body({
    nickname: { type: 'string', description: '昵称' },
    name: { type: 'string', description: '学名' },
    address: { type: 'string', description: '地址' },
    gender: { type: 'string', description: '性别' },
    age: { type: 'number', description: '设置年龄' },
    QQ: { type: 'string', description: '设置QQ' }
  })
  static async editUser(ctx) {
    const data = ctx.validatedBody;
    const user = ctx.user;

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const element = data[key];
        if (element) {
          user[key] = element;
        }
      }
    }
    user.save();
    ctx.body = { user };
  }

  @request('post', '/user/avatar')
  @tag
  @summary('上传头像')
  @formData({
    file: { type: 'file', required: true, description: '头像文件' }
  })
  @middlewares([userUpload.single('file')])
  static async uploadAvatar(ctx) {
    const { file } = ctx.req;
    const user = ctx.user;

    await user.update({
      avatar: `${config.baseUrl}/src/images/${file.filename}`
    });

    ctx.body = { msg: '上传成功' };
  }

  @request('put', '/user/password')
  @tag
  @summary('修改用户密码')
  @body({
    password: { type: 'string', required: true, description: '修改用户密码' }
  })
  static async changePassword(ctx) {
    const { password } = ctx.validatedBody;
    ctx.user.passwordHash = sha1(password);

    await ctx.user.save();

    ctx.body = { msg: '修改成功' };
  }
}

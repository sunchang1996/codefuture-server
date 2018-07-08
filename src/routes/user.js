import sha1 from 'sha1';
import User from 'models/user';
import Koa from 'koa';
import { request, summary, body, tags, query, middlewares } from 'koa-swagger-decorator';

import generateToken from 'utils/generateToken';
import exception from 'class/exception';
import assertUserExists from 'middleware/user/assertUserExists';

const tag = tags(['User']);

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

  @request('post', '/user/login')
  @tag
  @summary('用户登录')
  @body({
    studentId: { type: 'string', required: true, description: '用户的学生号'},
    password: { type: 'string', required: true, description: '用户密码'}
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
}

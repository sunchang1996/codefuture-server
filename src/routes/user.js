import sha1 from 'sha1';
import User from 'models/user';
import Koa from 'koa';
import { request, summary, body, tags, query, middlewares } from 'koa-swagger-decorator';

import generateToken from 'utils/generateToken';

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
}

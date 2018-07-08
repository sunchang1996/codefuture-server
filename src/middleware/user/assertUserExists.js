import User from 'models/user';

/**
 * 判断学号是否存在的中间件
 * @param { Koa.Context } ctx
 * @param next
 */

export default async function assertUserExists(ctx, next) {
  const studentId = ctx.request.body.studentId || ctx.request.query.studentId;
  const user = await User.findOne({ where: { studentId } });
  ctx.assert(user, 404, `学号不存在${studentId}`);

  ctx.user = user;

  await next();
}

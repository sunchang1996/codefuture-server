import Router from 'koa-router';

import auth from 'middleware/auth';

import UserRouter from 'routes/user';

import { wrapper } from 'koa-swagger-decorator';

const router = new Router();
wrapper(router);

router.swagger({ title: 'codefuture', description: 'codefuture API DOC', version: '0.0.1' });
router.use(auth({ excludes: ['/user/register'] }));
router.map(UserRouter);
export default router;

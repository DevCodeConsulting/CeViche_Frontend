import WebpackDevMiddleware from 'webpack-dev-middleware';
import applyExpressMiddleware from './apply-express-middleware';
import _debug from 'debug';

import path from 'path';

const debug = _debug('app:server:webpack-dev');

export default function (compiler, publicPath) {
    debug('Enable webpack dev middleware.');

    const middleware = WebpackDevMiddleware(compiler, {
        publicPath,
        contentBase: path.resolve('../src'),
        hot: true,
        quiet: false,
        noInfo: true,
        lazy: false,
        stats: {
            chunks: false,
            chunkModules: false,
            colors: true,
            children: false
        }
    });

    return async function koaWebpackDevMiddleware(ctx, next) {
        let hasNext = await applyExpressMiddleware(middleware, ctx.req, {
            end: (content) => (ctx.body = content),
            setHeader: function () {
                ctx.set.apply(ctx, arguments);
            }
        });

        if (hasNext) {
            await next();
        }
    };
}

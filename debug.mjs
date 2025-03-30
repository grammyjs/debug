import { Context } from "grammy";

const { debug } = console;
const emoji = (bool) => bool ? "✅" : "❌";
const objectMap = (o, fn) => Object.fromEntries(Object.entries(o).map(fn));

Context.has = objectMap(Context.has, ([k, v]) => [k, (arg) => {
    const og = v(arg);
    return (ctx) => {
        const bool = og(ctx);
        debug("%s Context.has.%s(%O)", emoji(bool), k, arg);
        return bool;
    };
}]);

import { Composer } from "grammy";

const { debug } = console;
const emoji = (bool) => bool ? "✅" : "❌";
let call;

for (const k of Object.getOwnPropertyNames(Composer.prototype)) {
    const v = Composer.prototype[k];
    if (k === "errorBoundary") continue;
    if (!/^\w+\(\w+, \.\.\.middleware\)/.test(v)) continue;

    Composer.prototype[k] = function (arg) {
        this.use((_, next) => {
            call ??= [k, arg];
            return next();
        });
        return v.apply(this, arguments);
    };
}

Composer.prototype.branch = function (
    predicate,
    trueMiddleware,
    falseMiddleware,
) {
    return this.lazy(async (ctx) => {
        const bool = await predicate(ctx);
        if (call) debug("%s %s(%O)", emoji(bool), ...call);
        call = undefined;
        return bool ? trueMiddleware : falseMiddleware;
    });
};

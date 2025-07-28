type DefaultValues<T> = {
    [K in keyof T]: any;
};
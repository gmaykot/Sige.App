export interface IResponseInterface<T>
{
    success: boolean,
    data: T,
    status: number,
    message: string,
    errors: IResponseErroIntercace[]
}

export interface IResponseErroIntercace
{
    key: string,
    value: string
}
import * as grpcWeb from "grpc-web"

export type ERROR = grpcWeb.RpcError

export interface Response {
    code: number
    error: ERROR | string
    jwt: string
}

export type CommonResolve<T> = (value: [string | ERROR, T] | PromiseLike<[string | ERROR, T]>) => void
export type CommonResponse<K extends keyof any, T> = Response & {
    [P in K]: T;
}
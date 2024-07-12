import { dxResp } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb"
import { CommonResolve, Response } from "./common"

export type dxResolve = CommonResolve<dxResp>

export interface dxResponse extends Response {}

export interface DeleteRequestArgs {
    idList: (string | Uint8Array)[]
    options: {
        jwt: string
    }
}
import { ceResp, reResp } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb";
import { Edge } from "@aitmed/protorepo/js/ecos/v1beta1/types_pb";
import { CommonResolve, CommonResponse } from "./common";

export type reResolve = CommonResolve<reResp>

export type ceResolve = CommonResolve<ceResp>

export type ceResponse = CommonResponse<"edge", Edge.AsObject>

export type reReponse = CommonResponse<"edge", Array<Edge.AsObject>>

export interface EdgeRequestArgs extends GenerateGRPCEdgeArgs {
    isEncrypt?: boolean
}

export interface GenerateGRPCEdgeArgs {
    tage?: number
    id?: Uint8Array | string
    type: number
    name?: Record<string, any>
    deat?: Record<string, any>
    subtype?: number
    bvid?: Uint8Array | string
    evid?: Uint8Array | string
    stime?: number
    etime?: number
    refid?: Uint8Array | string
    besak?: Uint8Array | string
    eesak?: Uint8Array | string
    sig?: Uint8Array | string
    isEncrypt?: boolean
    jwt?: string
    atimes?: number
}

export type CreateEdgeArgs = Omit<EdgeRequestArgs, 'id'>
export type UpdateEdgeArgs = Omit<EdgeRequestArgs, 'id'> &
    Pick<Required<EdgeRequestArgs>, 'id'>

export interface RetrieveEdgeArgs {
    idList: (string | Uint8Array)[]
    options?: {
        xfname?: string
        type?: number
        key?: string
        sfname?: string
        loid?: string | Uint8Array
        maxcount?: number
        obfname?: string
        scondition?: string
        asc?: boolean
        ObjType?: number
        jwt?: string
    }
}

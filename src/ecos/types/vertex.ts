import { cvResp, rvResp } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb"
import { Vertex } from "@aitmed/protorepo/js/ecos/v1beta1/types_pb"
import { CommonResolve, CommonResponse } from "./common"

export type cvResolve = CommonResolve<cvResp>

export type rvResolve = CommonResolve<rvResp>

export type cvResponse = CommonResponse<"vertex", Vertex.AsObject>

export type rvResponse = CommonResponse<"vertex", Array<Vertex.AsObject>>

export interface RetrieveVertexArgs {
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
        jwtNoUse?: boolean
    }
}

export interface VertexRequestArgs extends GenerateGRPCVertexArgs { }
export interface GenerateGRPCVertexArgs {
    tage?: number
    id?: string | Uint8Array
    type?: number
    subtype?: number
    name?: Record<string, any>
    deat?: Record<string, any>
    atimes?: number
    pk?: Uint8Array
    esk?: Uint8Array
    uid?: string
    jwt?: string
}

export type CreateVertexArgs = Omit<VertexRequestArgs, 'id'>

export type UpdateVertexArgs = Omit<VertexRequestArgs, 'id'> &
    Pick<Required<VertexRequestArgs>, 'id'>


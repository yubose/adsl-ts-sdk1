import { cdResp, rdResp } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb"
import { Doc } from "@aitmed/protorepo/js/ecos/v1beta1/types_pb"
import { CommonResolve, CommonResponse } from "./common"

export type rdResolve = CommonResolve<rdResp>

export type cdResolve = CommonResolve<cdResp>

export type cdResponse = CommonResponse<"document", Doc.AsObject>

export type rdReponse = CommonResponse<"document", Array<Doc.AsObject>>

export interface RetrieveDocumentArgs {
    idList: (string | Uint8Array)[]
    options?: DocumentRequestArgs
}

export interface GenerateGRPCDocumentArgs {
    id?: Uint8Array | string

    type?: number
    subtype?: number
    name?: Record<string, any>
    deat?: Record<string, any>

    size?: number

    fid?: Uint8Array | string
    eid?: Uint8Array | string

    ovid?: Uint8Array | string
    bsig?: Uint8Array | string // overloaded to: ovid, owner vertex id
    reid?: Uint8Array | string
    esig?: Uint8Array | string // overloaded to: reid, root edge id

    ctime?: number
    mtime?: number
    atime?: number
    atimes?: number
    tage?: number
    jwt?: string

    // new & undefined
    xfname?: string
    key?: string
    sfname?: string
    loid?: string | Uint8Array
    maxcount?: number
    obfname?: string
    scondition?: string
    asc?: boolean
    ObjType?: number
}

export interface DocumentRequestArgs extends GenerateGRPCDocumentArgs { }

export type CreateDocumentArgs = Omit<DocumentRequestArgs, 'id'>

export type UpdateDocumentArgs = Omit<DocumentRequestArgs, 'id'> &
    Pick<Required<DocumentRequestArgs>, 'id'>

import { ceReq, ceResp, reResp, rxReq } from '@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb'
import { Edge } from '@aitmed/protorepo/js/ecos/v1beta1/types_pb'
import { replaceUint8ArrayWithBase64, jsonEscape } from "./utils"
import * as grpcWeb from "grpc-web"
import { ERROR } from "ecos/types/common.js"
import EcosAPIClient from '@aitmed/protorepo/dist/types/js'
import { ceResolve, ceResponse, CreateEdgeArgs, EdgeRequestArgs, reResolve, UpdateEdgeArgs, RetrieveEdgeArgs, reReponse } from 'ecos/types/edge'

import ecos_api_pb from '@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb.js'
import types_pb from '@aitmed/protorepo/js/ecos/v1beta1/types_pb.js'

const EdgeClass = types_pb.Edge
const ceReqClass = ecos_api_pb.ceReq
const rxReqClass = ecos_api_pb.rxReq

const ERROR = grpcWeb.RpcError

function toSDKEdge(edge: Edge) {
    let res = {} as Edge.AsObject
    res.id = edge.getId()
    res.bvid = edge.getBvid()
    res.type = edge.getType()
    res.tage = edge.getTage()

    const name = edge.getName()
    if (name === '') {
        res.name = ''
    } else {
        try {
            res.name = JSON.parse(jsonEscape(name))
        } catch (error) {
            throw new Error(JSON.stringify({ name: 'JSON_PARSE_FAILED', message: name }))
        }
    }
    res.evid = edge.getEvid()
    res.subtype = edge.getSubtype()
    res.etime = edge.getEtime()
    res.mtime = edge.getMtime()
    res.atime = edge.getAtime()
    res.stime = edge.getStime()
    res.atimes = edge.getAtimes()
    res.refid = edge.getRefid()
    res.besak = edge.getBesak()
    res.eesak = edge.getEesak()
    res.ctime = edge.getCtime()
    res.sig = edge.getSig()
    const deat = edge.getDeat()
    if (deat === '') {
        // @ts-ignore
        res.deat = null
    } else {
        try {
            res.deat = JSON.parse(deat)
        } catch (error) {
            throw new Error(JSON.stringify({ name: 'JSON_PARSE_FAILED', message: deat }))
        }
    }
    return res
}

const create_edge = async (edgeOptions: CreateEdgeArgs | UpdateEdgeArgs | EdgeRequestArgs, client: EcosAPIClient) => {
    function defaultPath({
        tage, 
        id, 
        type, 
        name, 
        deat, 
        subtype, 
        bvid, 
        atimes, 
        evid, 
        stime, 
        etime, 
        refid, 
        eesak, 
        besak, 
        sig, 
        isEncrypt,
    }: EdgeRequestArgs) {
        const apiEdge = new EdgeClass()
        let besakGen = besak
        if (name) {
            try {
                if (typeof name?.verification_code === "string") {
                    name.verification_code = Number(name?.verification_code)
                }
                const nameJSONString = JSON.stringify(name)
                apiEdge.setName(nameJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
        if (deat) {
            try {
                const deatJSONString = JSON.stringify(deat)
                apiEdge.setDeat(deatJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
        if (bvid !== undefined) apiEdge.setBvid(bvid)
        if (stime !== undefined) apiEdge.setStime(stime)
        if (type !== undefined) apiEdge.setType(type)
        if (tage !== undefined) apiEdge.setTage(tage)
        if (id !== undefined) apiEdge.setId(id)
        if (subtype !== undefined) apiEdge.setSubtype(subtype)
        if (evid !== undefined) apiEdge.setEvid(evid)
        if (etime !== undefined) apiEdge.setEtime(etime)
        if (refid !== undefined) apiEdge.setRefid(refid)
        if (besakGen !== undefined) apiEdge.setBesak(besakGen)
        if (eesak !== undefined) apiEdge.setEesak(eesak)
        if (atimes !== undefined) apiEdge.setAtimes(atimes)
        return apiEdge
    }
    function createEdgeServiceCallBack(
        _error: ERROR, 
        _response: ceResp, 
        resolve: ceResolve
    ) {
        let serviceError
        const gRPCErrorExists = _error !== null
        if (gRPCErrorExists) {
            serviceError = new ERROR( _error.code, _error.message, {})
            resolve([serviceError, _response])
            return
        }
        const serverResponseCode = _response.getCode()
        const serverErrorExists = serverResponseCode !== 0
        if (serverErrorExists) {
            serviceError = _response.getError()
            resolve([serviceError, _response])
            return
        }
        resolve(['', _response])
        return
    }
    function createEdgeService(
        _request: ceReq
    ): Promise<[ERROR | string, ceResp]> {
        return new Promise((resolve) => {
            function callback(_error: ERROR, _response: ceResp) {
                return createEdgeServiceCallBack(_error, _response, resolve)
            }
            client.ce(_request, null, callback)
        })
    }
    const _request = new ceReqClass();
    const requestEdge = defaultPath({ ...edgeOptions });
    _request.setEdge(requestEdge)
    _request.setJwt(edgeOptions.jwt || "")
    const [_error, _response] = await createEdgeService(_request);
    const edge = _response.getEdge();
    const newJWT = _response.getJwt()
    let serviceError = _error as ERROR | string;
    let sdkEdge = {} as Edge.AsObject
    if (edge === undefined) {
        serviceError = "EDGE_IS_UNDEFINED"
    } else {
        sdkEdge = toSDKEdge(edge)
    }
    const responseData = {} as ceResponse;
    responseData.edge = sdkEdge
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = _response.getCode()
    responseData.edge = replaceUint8ArrayWithBase64(responseData.edge);
    return {
        code: _response.getCode(),
        data: responseData,
    }
}

const get_edge = async ({ 
    idList, 
    options 
}: RetrieveEdgeArgs, client: EcosAPIClient) => {
    function retrieveEdgeService(
        _request: rxReq
    ): Promise<[ERROR | string, reResp]> {
        return new Promise((resolve) => {
            function callback(_error: ERROR | string, _response: reResp) {
                return retrieveEdgeCallBack(_error, _response, resolve)
            }
            client.re(_request, null, callback)
        })
    }
    function retrieveEdgeCallBack(
        _error: ERROR | string,
        _response: reResp,
        resolve: reResolve
    ) {
        let serviceError
    
        const gRPCErrorExists = _error !== null
        if (gRPCErrorExists) {
            serviceError = _error
            resolve([serviceError, _response])
            return
        }
        const serverResponseCode = _response.getCode()
        const serverErrorExists = serverResponseCode !== 0
        if (serverErrorExists) {
            serviceError = _response.getError()
            resolve([serviceError, _response])
            return
        }
    
        resolve(['', _response])
        return
    }
    const _request = new rxReqClass();
    _request.setIdList(idList)
    if (options) {
        _request.setJwt(options.jwt || '')
        const {
            xfname,
            type,
            key,
            sfname,
            loid,
            maxcount,
            obfname,
            scondition,
            asc,
            ObjType,
        } = options

        if (xfname !== undefined) _request.setXfname(xfname)
        if (type !== undefined) _request.setType(type)
        if (key !== undefined) _request.setKey(key)
        if (sfname !== undefined) _request.setSfname(sfname)
        if (loid !== undefined) _request.setLoid(loid)
        if (maxcount !== undefined) _request.setMaxcount(maxcount)
        if (obfname !== undefined) _request.setObfname(obfname)
        if (scondition !== undefined) _request.setScondition(scondition)
        if (asc !== undefined) _request.setAsc(asc)
        if (ObjType !== undefined) _request.setObjtype(ObjType)

    }

    let serviceResponse, serviceError;
    const [_error, _response] = await retrieveEdgeService(_request)
    serviceError = _error
    serviceResponse = _response
    let responseData = {} as reReponse
    let sdkEdgeList = [] as Array<Edge.AsObject>

    const edge = serviceResponse.getEdgeList()
    const newJWT = serviceResponse.getJwt();
    sdkEdgeList = edge.map((data: Edge) => toSDKEdge(data))
    responseData.edge = sdkEdgeList
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = serviceResponse.getCode();
    responseData.edge = replaceUint8ArrayWithBase64(responseData.edge);
    return {
        code: serviceResponse.getCode(),
        data: responseData,
    }
}

export {
    create_edge,
    get_edge
}
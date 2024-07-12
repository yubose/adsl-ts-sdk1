// import grpc_client from "./init_ecos.mjs"
import EcosAPIClient from "@aitmed/protorepo/dist/types/js/index"
import { CreateVertexArgs, cvResolve, cvResponse, GenerateGRPCVertexArgs, RetrieveVertexArgs, rvResolve, rvResponse, UpdateVertexArgs } from "../types/vertex"

import { cvReq, cvResp, rvResp, rxReq } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb"

import { replaceUint8ArrayWithBase64, jsonEscape } from "./utils"

import * as grpcWeb from "grpc-web"
import { Vertex } from "@aitmed/protorepo/js/ecos/v1beta1/types_pb"
import { ERROR } from "ecos/types/common"
import ecos_api_pb from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb.js"
import types_pb from "@aitmed/protorepo/js/ecos/v1beta1/types_pb.js"

const VertexClass = types_pb.Vertex
const cvReqClass = ecos_api_pb.cvReq
const rxReqClass = ecos_api_pb.rxReq

const ERROR = grpcWeb.RpcError

const toSDKVertex = (vertex: Vertex) => {
    let res = {} as Vertex.AsObject
    res.id = vertex.getId()
    res.mtime = vertex.getMtime()
    res.ctime = vertex.getCtime()
    res.atime = vertex.getAtime()
    res.atimes = vertex.getAtimes()
    res.type = vertex.getType()
    res.subtype = vertex.getSubtype()
    const name = vertex.getName()
    if (name === "") {
        // @ts-ignore
        res.name = null
    } else {
        try {
            res.name = JSON.parse(jsonEscape(name))
        } catch (error) {
            new Error(JSON.stringify({ name: "JSON_PARSE_FAILED", message: name }))
        }
    }
    res.esk = vertex.getEsk()
    res.pk = vertex.getPk()
    res.uid = vertex.getUid()
    const deat = vertex.getDeat()
    if (deat === "") {
        // @ts-ignore
        res.deat = null
    } else {
        try {
            res.deat = JSON.parse(deat)
        } catch (error) {
            new Error(JSON.stringify({ name: "JSON_PARSE_FAILED", message: deat }))
        }
    }
    res.tage = vertex.getTage()
    return res
}

const get_vertex = async ({
    idList,
    options
}: RetrieveVertexArgs, client: EcosAPIClient) => {

    function retrieveVertexService(
        _request: rxReq
    ): Promise<[ERROR | string, rvResp]> {
        return new Promise((resolve) => {
            function callback(_error: ERROR, _response: rvResp) {
                return retrieveVertexCallBack(_error, _response, resolve)
            }
            client.rv(_request, null, callback)
        })
    }

    function retrieveVertexCallBack(
        _error: ERROR,
        _response: rvResp,
        resolve: rvResolve,
    ) {
        let serviceError = new Error() as ERROR | string

        const gRPCErrorExists = _error !== null
        if (gRPCErrorExists) {
            serviceError = new ERROR(_error.code, _error.message, {})
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
        resolve(["", _response])
        return
    }
    const _request = new rxReqClass();
    _request.setIdList(idList)
    if (options) {
        if (options.jwt) {
            _request.setJwt(options.jwt || "")
        }
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
    const [_error, _response] = await retrieveVertexService(_request)
    serviceError = _error
    serviceResponse = _response
    let responseData = {} as rvResponse
    let sdkVertexList = []

    const vertex = serviceResponse.getVertexList()
    const newJWT = serviceResponse.getJwt();
    sdkVertexList = vertex.map((data: Vertex) => toSDKVertex(data))
    responseData.vertex = sdkVertexList
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = serviceResponse.getCode()
    responseData.vertex = replaceUint8ArrayWithBase64(responseData.vertex);
    return {
        code: serviceResponse.getCode(),
        data: responseData
    }
}

const create_vertex = async (vertexOptions: CreateVertexArgs | UpdateVertexArgs, client: EcosAPIClient) => {
    
    function createVertexService(
        _request: cvReq
    ): Promise<[ERROR | string, cvResp]>  {
        return new Promise((resolve) => {
            function callback(_error: ERROR, _response: cvResp) {
                return createVertexServiceCallBack(_error, _response, resolve)
            }
            client.cv(_request, null, callback)
        })
    }
    function createVertexServiceCallBack(
        _error: ERROR,
        _response: cvResp,
        resolve: cvResolve,
    ) {
        let serviceError = '' as ERROR | string

        const gRPCErrorExists = _error !== null
        if (gRPCErrorExists) {
            serviceError = new ERROR(_error.code, _error.message, {})
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
    function generateGRPCVertex({
        tage,
        id,
        type,
        subtype,
        name,
        atimes,
        deat,
        pk,
        esk,
        uid,
    }: GenerateGRPCVertexArgs) {
        const apiVertex = new VertexClass()
        if (name) {
            try {
                const nameJSONString = JSON.stringify(name)
                apiVertex.setName(nameJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
        if (deat) {
            try {
                const deatJSONString = JSON.stringify(deat)
                apiVertex.setDeat(deatJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
        if (tage !== undefined) apiVertex.setTage(tage)
        if (id !== undefined) apiVertex.setId(id)
        if (type !== undefined) apiVertex.setType(type)
        if (subtype !== undefined) apiVertex.setSubtype(subtype)
        if (pk !== undefined) apiVertex.setPk(pk)
        if (esk !== undefined) apiVertex.setEsk(esk)
        if (uid !== undefined) apiVertex.setUid(uid)
        if (atimes !== undefined) apiVertex.setAtimes(atimes)
        return apiVertex
    }
    const apiVertex = generateGRPCVertex(vertexOptions)
    const _request = new cvReqClass();
    _request.setJwt(vertexOptions.jwt || "")
    _request.setVertex(apiVertex)
    const [_error, _response] = await createVertexService(_request);
    const vertex = _response.getVertex();
    const newJWT = _response.getJwt()
    let serviceError = _error as ERROR | string;
    let sdkVertex = {} as Vertex.AsObject
    if (vertex === undefined) {
        serviceError = "VERTEX_IS_UNDEFINED"
    } else {
        sdkVertex = toSDKVertex(vertex)
    }
    const responseData = {} as cvResponse;
    responseData.vertex = sdkVertex
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = _response.getCode()
    responseData.vertex = replaceUint8ArrayWithBase64(responseData.vertex);
    return {
        code: _response.getCode(),
        data: responseData
    }
}

export {
    get_vertex,
    create_vertex
}
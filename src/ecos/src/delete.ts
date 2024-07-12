import EcosAPIClient from "@aitmed/protorepo/dist/types/js";
import { dxReq, dxResp } from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb";
import { ERROR } from "ecos/types/common";
import * as grpcWeb from "grpc-web"
import { DeleteRequestArgs, dxResolve, dxResponse } from "ecos/types/delete";

import ecos_api_pb from "@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb.js";
const dxReqClass = ecos_api_pb.dxReq

const ERROR = grpcWeb.RpcError

function delete_request({
    idList,
    options
}: DeleteRequestArgs, client: EcosAPIClient): Promise<{
    code: number,
    data: dxResponse
}> {
    function deleteService(_request: dxReq): Promise<[ERROR | string, dxResp]> {
        return new Promise((resolve) => {
            client.dx(_request, null, callback)
            function callback(_error: ERROR, _response: dxResp) {
                return deleteServiceCallBack(_error, _response, resolve)
            }
        })
    }
    function deleteServiceCallBack(
        _error: ERROR,
        _response: dxResp,
        resolve: dxResolve,
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
    return new Promise(async (resolve) => {
        let serviceError = "" as ERROR | string
        let responseData = {} as dxResponse
        const _request = new dxReqClass()
        _request.setJwt(options.jwt || '')
        _request.setIdList(idList)
        let serviceResponse = {} as dxResp
        try {
            const [_error, _response] = await deleteService(_request)
            serviceError = _error
            serviceResponse = _response
        } catch (error) {
            // serviceError = error
            throw new Error("unknown error")
        }

        if (!serviceError && !serviceResponse) {
            serviceError = new ERROR(-1, "", {})
        }
        if (serviceError) {
            resolve(
                {
                    code: serviceResponse.getCode() || -1,
                    data: {
                        ...responseData,
                        error: serviceError,
                    },
                }
            )
        } else if (serviceResponse) {
            const newJWT = serviceResponse.getJwt()
            responseData.jwt = newJWT
            responseData.error = serviceError
            responseData.code = serviceResponse.getCode()
            resolve(
                {
                    code: serviceResponse.getCode(),
                    data: responseData
                }
            )
        }

    })
}

export default delete_request


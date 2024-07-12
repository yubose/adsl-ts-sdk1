import EcosAPIClient from '@aitmed/protorepo/dist/types/js'
import { cdReq, rdResp, rxReq, cdResp } from '@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb'
import { Doc } from '@aitmed/protorepo/js/ecos/v1beta1/types_pb'
import { ERROR } from 'ecos/types/common'
import { cdResolve, cdResponse, CreateDocumentArgs, DocumentRequestArgs, rdReponse, rdResolve, RetrieveDocumentArgs, UpdateDocumentArgs } from 'ecos/types/document'
import { replaceUint8ArrayWithBase64, jsonEscape } from 'ecos/src/utils'

import ecos_api_pb from '@aitmed/protorepo/js/ecos/v1beta1/ecos_api_pb.js'
import types_pb from '@aitmed/protorepo/js/ecos/v1beta1/types_pb.js'

const DocClass = types_pb.Doc
const cdReqClass = ecos_api_pb.cdReq
const rxReqClass = ecos_api_pb.rxReq

function toSDKDoc(doc: Doc) {
    const res = {} as Doc.AsObject
    res.id = doc.getId()
    res.ctime = doc.getCtime()
    res.mtime = doc.getMtime()
    res.atime = doc.getAtime()
    res.atimes = doc.getAtimes()
    res.tage = doc.getTage()
    res.type = doc.getType()
    res.subtype = doc.getSubtype()
    const name = doc.getName()
    if (name === '') {
        // @ts-ignore
        res.name = null
    } else {
        try {
            res.name = JSON.parse(jsonEscape(name))
        } catch (error) {
            throw new Error(JSON.stringify({ name: 'JSON_PARSE_FAILED', message: name }))
        }
    }
    const deat = doc.getDeat()
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
    res.size = doc.getSize()
    res.fid = doc.getFid()
    res.eid = doc.getEid()
    res.bsig = doc.getBsig()
    res.esig = doc.getEsig()
    return res
}

const create_document = async (documentOptions: CreateDocumentArgs | UpdateDocumentArgs, client: EcosAPIClient) => {
    function createDocumentServiceCallBack(
        _error: ERROR,
        _response: cdResp,
        resolve: cdResolve,
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
    function createDocumentService(
        _request: cdReq
    ): Promise<[ERROR | string, cdResp]> {
        return new Promise((resolve) => {
            function callback(_error: ERROR, _response: cdResp) {
                return createDocumentServiceCallBack(_error, _response, resolve)
            }
            client.cd(_request, null, callback)
        })
    }
    function generateGRPCDocument({
        id,
        type,
        subtype,
        name,
        deat,
        size,
        fid,
        eid,

        ovid,
        bsig, // overloaded to: ovid, owner vertex id
        reid,
        esig, // overloaded to: reid, root edge id

        ctime,
        mtime,
        atime,
        atimes,
        tage,
    }: DocumentRequestArgs) {
        const document = new DocClass()
        if (id !== undefined) document.setId(id)
        if (type !== undefined) document.setType(type)
        if (subtype !== undefined) document.setSubtype(subtype)
        if (name) {
            try {
                const nameJSONString = JSON.stringify(name)
                // console.log("nameJSONString==",nameJSONString,typeof nameJSONString)
                document.setName(nameJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
        if (deat) {
            try {
                const deatJSONString = JSON.stringify(deat)
                document.setDeat(deatJSONString)
            } catch (error) {
                throw new Error(JSON.stringify({
                    name: 'JSON_STRINGIFY_FAILED',
                }))
            }
        }
    
        if (size !== undefined) document.setSize(size)
        if (fid !== undefined) document.setFid(fid)
        if (eid !== undefined) document.setEid(eid)

        // 若使用bsig | esig, 将自动覆盖ovid | reid
        if (ovid !== undefined) document.setBsig(ovid)
        if (bsig !== undefined) document.setBsig(bsig)
        if (reid !== undefined) document.setEsig(reid)
        if (esig !== undefined) document.setEsig(esig)

        if (ctime !== undefined) document.setCtime(ctime)
        if (mtime !== undefined) document.setMtime(mtime)
        if (atime !== undefined) document.setAtime(atime)
        if (atimes !== undefined) document.setAtimes(atimes)
        if (tage !== undefined) document.setTage(tage)
    
        return document
    }
    const apiDocument = generateGRPCDocument(documentOptions)
    const _request = new cdReqClass();
    _request.setJwt(documentOptions.jwt || "")
    _request.setDoc(apiDocument)
    const [_error, _response] = await createDocumentService(_request);
    const document = _response.getDoc();
    const newJWT = _response.getJwt()
    let serviceError = _error as ERROR | string
    let sdkDoc = {} as Doc.AsObject
    if (document === undefined) {
        serviceError = "DOCUMENT_IS_UNDEFINED"
    } else {
        sdkDoc = toSDKDoc(document)
    }
    const responseData = {} as cdResponse
    responseData.document = sdkDoc
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = _response.getCode()
    responseData.document = replaceUint8ArrayWithBase64(responseData.document);
    return {
        code: _response.getCode(),
        data: responseData
    }
}

const get_document = async ({ 
    idList, 
    options 
}: RetrieveDocumentArgs, client: EcosAPIClient) => {
    function retrieveDocumentService(
        _request: rxReq
    ): Promise<[ERROR | string, rdResp]> {
        return new Promise((resolve) => {
            function callback(_error: ERROR, _response: rdResp) {
                return retrieveDocumentCallBack(_error, _response, resolve)
            }
            client.rd(_request, null, callback)
        })
    }
    async function retrieveDocumentCallBack(
        _error: ERROR,
        _response: rdResp,
        resolve: rdResolve,
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
        if (options.jwt) {
            _request.setJwt(options.jwt || '')
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
    const [_error, _response] = await retrieveDocumentService(_request)
    serviceError = _error
    serviceResponse = _response
    let responseData = {} as rdReponse
    let sdkDocumentList = [] as Array<Doc.AsObject>

    const document = serviceResponse.getDocList()
    const newJWT = serviceResponse.getJwt();
    sdkDocumentList = document.map((data) => toSDKDoc(data))
    responseData.document = sdkDocumentList
    responseData.jwt = newJWT
    responseData.error = serviceError
    responseData.code = serviceResponse.getCode()
    responseData.document = replaceUint8ArrayWithBase64(responseData.document);
    return {
        code: serviceResponse.getCode(),
        data: responseData
    }
}

export {
    create_document,
    get_document
}
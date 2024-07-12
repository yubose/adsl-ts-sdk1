import EcosAPIClientV1Beta1 from "@aitmed/protorepo"
import logInfo from "./log"
import { CreateEdgeArgs, EdgeRequestArgs, RetrieveEdgeArgs, UpdateEdgeArgs } from "./types/edge"
import { CreateVertexArgs, RetrieveVertexArgs, UpdateVertexArgs } from "./types/vertex"

import { get_vertex, create_vertex } from "./src/vertex"
import { get_edge, create_edge } from "./src/edge"
import { get_document, create_document } from "./src/document"
import { DeleteRequestArgs } from "./types/delete"
import delete_request from "./src/delete"
import { CreateDocumentArgs, DocumentRequestArgs, RetrieveDocumentArgs, UpdateDocumentArgs } from "./types/document"

class EcosSDK {
    private client: EcosAPIClientV1Beta1
    constructor(config: string) {
        if(config) {
            try {
                this.client = new EcosAPIClientV1Beta1(`https://${config}`)
            } catch (error) {
                // @ts-ignore
                this.client = new EcosAPIClientV1Beta1.default(`https://${config}`)
            }
        } else {
            throw Error("No config !!!")
        }
    }
    public async rv({
        idList,
        options
    }: RetrieveVertexArgs) {
        logInfo({
            method: "Get",
            target: "Vertex",
            action: "Request",
            object: {
                idList,
                options
            }
        })
        const resp = await get_vertex({
            idList,
            options
        }, this.client)
        logInfo({
            method: "Get",
            target: "Vertex",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async cv({
        options
    }: {
        options: CreateVertexArgs | UpdateVertexArgs
    }) {
        logInfo({
            method: "Create",
            target: "Vertex",
            action: "Request",
            object: {
                options
            }
        })
        const resp = await create_vertex(options, this.client)
        logInfo({
            method: "Create",
            target: "Vertex",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async re({
        idList,
        options
    }: RetrieveEdgeArgs) {
        logInfo({
            method: "Get",
            target: "Edge",
            action: "Request",
            object: {
                idList,
                options
            }
        })
        const resp = await get_edge({
            idList,
            options
        }, this.client)
        logInfo({
            method: "Get",
            target: "Edge",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async ce({
        options
    }: {
        options: CreateEdgeArgs | UpdateEdgeArgs | EdgeRequestArgs
    }) {
        logInfo({
            method: "Create",
            target: "Edge",
            action: "Request",
            object: {
                options
            }
        })
        const resp = await create_edge(options, this.client)
        logInfo({
            method: "Create",
            target: "Edge",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async rd({
        idList,
        options
    }: RetrieveDocumentArgs) {
        logInfo({
            method: "Get",
            target: "Document",
            action: "Request",
            object: {
                idList,
                options
            }
        })
        const resp = await get_document({
            idList,
            options
        }, this.client)
        logInfo({
            method: "Get",
            target: "Document",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async cd({
        options
    }: {
        options: CreateDocumentArgs | UpdateDocumentArgs | DocumentRequestArgs
    }) {
        logInfo({
            method: "Create",
            target: "Document",
            action: "Request",
            object: {
                options
            }
        })
        const resp = await create_document(options, this.client)
        logInfo({
            method: "Create",
            target: "Document",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
    public async dx({
        idList,
        options
    }: DeleteRequestArgs) {
        logInfo({
            method: "Delete",
            action: "Request",
            object: {
                idList,
                options
            }
        })
        const resp = await delete_request({
            idList,
            options
        }, this.client)
        logInfo({
            method: "Delete",
            action: "Response",
            object: resp.data
        })
        return resp.data
    }
}

export default EcosSDK
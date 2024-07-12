import cloneDeep from 'lodash/cloneDeep.js'
import util from 'tweetnacl-util'
import _ from 'lodash'
const { isArray, isObject } = _
const { encodeBase64 } = util

function replaceUint8ArrayWithBase64<T>(source: T): T {
    let sourceCopy = cloneDeep(source || {});

    if (isArray(source)) {
        sourceCopy = source.map((elem) => replaceUint8ArrayWithBase64(elem))
    } else if (isObject(source)) {
        Object.keys(sourceCopy).forEach((key) => {
            if ((<Record<string, any>>sourceCopy)[key] instanceof Uint8Array) {
                (<Record<string, any>>sourceCopy)[key] = encodeBase64(
                    (<Record<string, any>>sourceCopy)[key],
                )
            } else if (
                (isArray((<Record<string, any>>sourceCopy)[key])) &&
                !((<Record<string, any>>sourceCopy)[key] instanceof Uint8Array)
            ) {
                (<Record<string, any>>sourceCopy)[key] = (<Record<string, any>>sourceCopy)[key].map((elem: any) =>
                    replaceUint8ArrayWithBase64(elem),
                )
            } else if (isObject((<Record<string, any>>sourceCopy)[key])) {
                (<Record<string, any>>sourceCopy)[key] = replaceUint8ArrayWithBase64((<Record<string, any>>sourceCopy)[key])
            }
        })
    }
    return sourceCopy as T
}

const jsonEscape = (str: string) => {
    return str
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
}

export {
    replaceUint8ArrayWithBase64,
    jsonEscape
}

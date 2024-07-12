import chalk from "chalk"
import log from "../log"

const logInfo = ({
    method,
    target,
    action,
    object
}: {
    method: "Get" | "Create" | "Delete",
    target?: "Vertex" | "Edge" | "Document",
    action: "Request" | "Response",
    object: Record<string, any>
}) => {
    let T = " "
    if(target)
        T = ` ${target} `
    const text = `LVL1 ${method}${T}${action}`
    log.info(chalk.bgHex("#e980ff").hex("#FFFFFF")(text), object)
}

export default logInfo
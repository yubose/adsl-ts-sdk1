import log from "loglevel";

if(process.env.NODE_ENV === "production") {
    log.setDefaultLevel('ERROR')
} else {
    log.setDefaultLevel("INFO")
}

export default log
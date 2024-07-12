import { defineConfig } from "tsup"
import * as fs from "fs"

export default defineConfig({
    name: "index.js",
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: false,
    format: "esm",
    clean: true,
    dts: true,
    minify: process.env.NODE_ENV === "production",
    replaceNodeEnv: true,
    plugins: [
        // {
        //     name: "replace-text-plugin",
        //     buildEnd: (ctx) => {
        //         ctx.writtenFiles.forEach(file => {
        //             const origin = fs.readFileSync(file.name, "utf-8")
        //             const target = origin.replace(
        //                 "new EcosAPIClientV1Beta1(`https://${config}`)",
        //                 "new EcosAPIClientV1Beta1.default(`https://${config}`)"
        //             )
        //             fs.writeFileSync(file.name, target, "utf-8")
        //         })
        //     }
        // }
    ]
})
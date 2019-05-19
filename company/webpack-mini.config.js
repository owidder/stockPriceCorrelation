module.exports = {
    mode: process.env.NODE_ENV,
    entry: {
        selectCompanyElement: "./src/SelectCompanyElement.tsx"
    },
    output: {
        filename: "build/static/js/[name].js",
    },
    devtool: "source-map",
    module: {
        rules: [{test: /\.(ts|tsx)$/, use: "ts-loader"}]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    }
}

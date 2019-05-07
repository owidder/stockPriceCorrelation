const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const appDirectory = fs.realpathSync(process.cwd());
const absPath = relPath => path.resolve(appDirectory, relPath);
const packageJson = require("./package.json");

const common = {
    mode: process.env.NODE_ENV,
    output: {
        path: path.resolve(__dirname, "build")
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, "public"),
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                include: absPath("src"),
                use: ['ts-loader'],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin(["public"])
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
}

const testPage = {
    ...common,
    entry: {
        testPage: "./src/testPage.tsx",
        companyCorrelationElement: "./src/CompanyCorrelationElement.tsx",
        componentTestPage: "./src/componentTestPage.ts",
    },
    output: {
        ...common.output,
        filename: "static/js/[name].[contenthash:8].js",
    },
    plugins: [
        ...common.plugins,
        new HtmlWebpackPlugin({
            filename: "testPage.html",
            inject: true,
            template: "./src/testPageTemplate.html",
            chunks: ["testPage"]
        }),
        new HtmlWebpackPlugin({
            filename: "componentTestPage.html",
            inject: "body",
            template: "./src/componentTestPageTemplate.html",
            chunks: ["companyCorrelationElement", "componentTestPage"],
            chunksSortMode: "manual"
        }),
    ]
}

const customElementsDist = {
    ...common,
    entry: {
        companyCorrelationElement: "./src/CompanyCorrelationElement.tsx",
    },
    output: {
        ...common.output,
        filename: `dist/js/[name].${packageJson.version}.js`,
    },
}

module.exports = [testPage, customElementsDist]

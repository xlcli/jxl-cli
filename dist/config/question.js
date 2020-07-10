"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CliQuestions = [
    {
        type: "list",
        name: "template",
        message: "请选择一种模版:",
        choices: [
            {
                key: "react",
                name: "react template",
                value: "react",
            },
            {
                key: "react-ts",
                name: "react ts template",
                value: "react-ts",
            },
            {
                key: "react-lib",
                name: "react library template",
                value: "react-lib",
            },
            {
                key: "react-libts",
                name: "react library ts template",
                value: "react-libts",
            },
            {
                key: "react-ui",
                name: "react ui template",
                value: "react-ui",
            },
            {
                key: "react-vite",
                name: "react vite template",
                value: "react-vite",
            },
            {
                key: "react-vitets",
                name: "react vite ts template",
                value: "react-vitet",
            },
            {
                key: "egg",
                name: "egg template",
                value: "egg",
            },
        ],
    },
    {
        type: "input",
        name: "description",
        message: "请输入项目描述:",
        default: "cli template",
    },
    {
        type: "input",
        name: "author",
        message: "请输入项目作者名:",
        default: "jiangxinlei",
    },
    {
        type: "confirm",
        name: "isInstall",
        message: "是否安装？",
        default: false,
    },
];
exports.CliQuestions = CliQuestions;
const CommitQuestions = [
    {
        type: "input",
        name: "commitInfo",
        message: "请输入提交信息:",
        default: "commit info",
    },
];
exports.CommitQuestions = CommitQuestions;
const BranchQuestion = [
    {
        type: "list",
        name: "branchType",
        message: "新分支类型：",
        choices: [
            {
                key: "patch",
                name: "patch: Bug 修复",
                value: 2,
            },
            {
                key: "minor",
                name: "minor: 向下兼容的功能性新增",
                value: 1,
            },
            {
                key: "major",
                name: "major: 破坏性更新，不向下兼容",
                value: 0,
            }
        ],
    }
];
exports.BranchQuestion = BranchQuestion;

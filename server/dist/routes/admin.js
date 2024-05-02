"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_1 = require("../db/data");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET_KEY || 'secret';
const middleware_1 = __importDefault(require("../middleware/middleware"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
//Admin signup
router.post('/signup', (req, res) => {
    const { username, password } = req.body;
    data_1.Admin.findOne({ username: username }).then((admin) => {
        if (admin) {
            res.status(400).send("Admin already exists. Please select a different username");
        }
        else {
            const newAdmin = new data_1.Admin({ username, password });
            newAdmin.save().then(() => {
                res.status(201).send("Admin created successfully.Please login to continue");
            });
        }
    });
});
//Admin signin
router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    data_1.Admin.findOne({ username: username, password: password }).then((admin) => {
        if (admin) {
            const token = jsonwebtoken_1.default.sign({ username: admin.username }, SECRET, { expiresIn: '1h' });
            res.status(200).json({ msg: "Logged in Successfully", token: token });
        }
        else {
            res.status(401).send("Invalid username or password");
        }
    });
});
//Problem list
router.get('/problems', middleware_1.default, (req, res) => {
    data_1.Problem.find().then((problems) => {
        if (problems.length !== 0)
            res.status(200).json(problems);
        else {
            res.send("No problems found!!");
        }
    });
});
//Particular problem
router.get('/problems/:id', middleware_1.default, (req, res) => {
    const id = req.params.id;
    data_1.Problem.findById(id).then((problem) => {
        res.status(200).json(problem);
    });
});
router.post('/submit/problems/execute/:id', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const finalresult = [];
    const frontendCode = req.body.code.code;
    console.log(frontendCode);
    const language = 62;
    const id = req.params.id;
    const stdinput = yield data_1.Problem.findById(id).then((problem) => {
        const testcases = problem === null || problem === void 0 ? void 0 : problem.testcases;
        return testcases;
    }).then(data => data);
    console.log(stdinput);
    for (let testCase of stdinput) {
        let frontend_modified = '';
        if (id === '6624f59f8144212dd0b104e4') {
            frontend_modified = `
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
            int a[]={${testCase.input.nums}};
            int arr[]=twoSum(a,${testCase.input.target});
            String output=Arrays.toString(arr);
            System.out.println(output);
                }
            }`;
        }
        else if (id === '662ccb15270ad8b7980447ea') {
            frontend_modified = `
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
            String str="${testCase.input.s}";
            int result=lengthOfLongestSubstring(str);
            String output = Integer.toString(result);
            System.out.println(output);
                }
            }`;
        }
        else if (id === '662ccc89270ad8b7980447ed') {
            frontend_modified = `
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
              String s="${testCase.input.s}";
              String p="${testCase.input.p}";
            boolean result=isMatch(s,p);
            String output = String.valueOf(result);
            System.out.println(output);
                }
            }`;
        }
        console.log(frontend_modified);
        const frontend_encoded = btoa(frontend_modified);
        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions',
            params: {
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'content-type': 'application/json',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            data: {
                language_id: language,
                source_code: frontend_encoded,
            }
        };
        let response = null;
        try {
            response = yield axios_1.default.request(options);
        }
        catch (error) {
            console.error("Error while fetching token=" + error);
        }
        let newUrl;
        if (response) {
            newUrl = 'https://judge0-ce.p.rapidapi.com/submissions/' + response.data.token;
            console.log(newUrl);
        }
        else {
            console.log("Response is null");
        }
        let status = null;
        while (status == null || status === 1 || status === 2) {
            const options1 = {
                method: 'GET',
                url: newUrl,
                headers: {
                    'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
            };
            let response1 = null;
            try {
                response1 = yield axios_1.default.request(options1);
            }
            catch (error) {
                console.error("Error while executing and checking status=" + error);
            }
            if (response1) {
                status = response1.data.status.id;
                if (status === 1 || status === 2) {
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    console.log("Waiting for 1 sec and then going again");
                }
            }
            else {
                console.log("Response is null");
            }
        }
        const options1 = {
            method: 'GET',
            url: newUrl,
            headers: {
                'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
        };
        let response1 = null;
        try {
            response1 = yield axios_1.default.request(options1);
        }
        catch (error) {
            console.error("Error while fetching output=" + error);
        }
        if (response1 === null || response1 === void 0 ? void 0 : response1.data.stdout) {
            const output = response1.data.stdout.trim();
            const finalStatus = response1.data.status.description;
            const result = {
                input: testCase.input,
                output: output,
                finalStatus: finalStatus,
                expectedOutput: testCase.expectedOutput
            };
            finalresult.push(result);
        }
        else {
            console.log("Response1 is null while fetching final output");
        }
    }
    res.status(200).send(finalresult);
}));
exports.default = router;

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
const mongodb_1 = require("mongodb");
const db_1 = __importDefault(require("./db"));
const cors_1 = __importDefault(require("cors"));
const linguagem_js_1 = __importDefault(require("./models/linguagem.js"));
const port = 3000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
//GET
app.get("/linguagens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const linguagem = db.collection("linguagens");
        const docs = yield linguagem.find().toArray();
        res.status(200).json(docs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
//POST
app.post("/linguagens", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = req.body;
    try {
        if (typeof record.nome !== "string") {
            throw new Error("O atributo nome não foi informado");
        }
        if (record.nome === "") {
            throw new Error("O atributo nome não é valido");
        }
        if (typeof record.ano != "number") {
            throw new Error("O atributo ano não foi informado");
        }
        if (record.ano <= 0) {
            throw new Error("O atributo ano não é valido");
        }
        if (typeof record.versao !== "string") {
            throw new Error("O atributo versão não foi informado");
        }
        if (record.versao === "") {
            throw new Error("O atributo versão não é valido");
        }
        if (typeof record.criador !== "string") {
            throw new Error("O atributo criador não foi informado");
        }
        if (record.criador === "") {
            throw new Error("O atributo criador não é valido");
        }
        if (typeof record.tipo !== "string") {
            throw new Error("O atributo tipo não foi informado");
        }
        if (record.tipo === "") {
            throw new Error("O atributo tipo não é valido");
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
        return;
    }
    const linguagem = new linguagem_js_1.default(record.nome, record.ano, record.versao, record.criador, record.tipo);
    let conn = null;
    try {
        conn = yield (0, db_1.default)();
        const db = conn.db();
        const linguagens = db.collection("linguagens");
        yield linguagens.insertOne(linguagem);
        res.status(201).json(linguagem);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
    finally {
        conn === null || conn === void 0 ? void 0 : conn.close();
    }
}));
//PUT
app.put("/linguagens/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const objectId = new mongodb_1.ObjectId(id);
        let conn = null;
        try {
            conn = yield (0, db_1.default)();
            const db = conn.db();
            const linguagens = db.collection("linguagens");
            if ((yield linguagens.find({ _id: objectId }).count()) > 0) {
                const record = req.body;
                try {
                    if (typeof record.nome !== "string") {
                        throw new Error("O atributo nome não foi informado.");
                    }
                    if (record.nome === "") {
                        throw new Error("O atributo nome não é válido.");
                    }
                    if (typeof record.ano != "number") {
                        throw new Error("O atributo ano não foi informado.");
                    }
                    if (record.ano <= 0) {
                        throw new Error("O atributo ano não é válido.");
                    }
                    if (typeof record.versao !== "string") {
                        throw new Error("O atributo versão não foi informado");
                    }
                    if (record.versao === "") {
                        throw new Error("O atributo versão não é valido");
                    }
                    if (typeof record.criador !== "string") {
                        throw new Error("O atributo criador não foi informado");
                    }
                    if (record.criador === "") {
                        throw new Error("O atributo criador não é valido");
                    }
                    if (typeof record.tipo !== "string") {
                        throw new Error("O atributo tipo não foi informado");
                    }
                    if (record.tipo === "") {
                        throw new Error("O atributo tipo não é valido");
                    }
                }
                catch (error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                const linguagem = new linguagem_js_1.default(record.nome, record.ano, record.versao, record.criador, record.tipo);
                yield linguagens.updateOne({
                    _id: objectId
                }, {
                    $set: linguagem
                });
                res.status(200).json(linguagem);
            }
            else {
                res.status(404).json({ message: "Não existe linguagem com esse id." });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        finally {
            conn === null || conn === void 0 ? void 0 : conn.close();
        }
    }
    catch (error) {
        res.status(400).json({ message: "O id informado é inválido." });
    }
}));
//DELETE
app.delete("/linguagens/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const objectId = new mongodb_1.ObjectId(id);
        let conn = null;
        try {
            conn = yield (0, db_1.default)();
            const db = conn.db();
            const linguagens = db.collection("linguagens");
            if ((yield linguagens.countDocuments({ _id: objectId })) > 0) {
                yield linguagens.deleteOne({ _id: objectId });
                res.status(204).send("");
            }
            else {
                res.status(404).json({ message: "Não existe linguagem com esse id." });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
        finally {
            conn === null || conn === void 0 ? void 0 : conn.close();
        }
    }
    catch (error) {
        res.status(400).json({ message: "O id informado é inválido." });
    }
}));
app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}`);
});
//npm install cors
//npm install @types/cors -D
//node .\dist\index.js 

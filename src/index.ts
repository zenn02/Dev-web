import express, {Request, Response} from "express";
import { MongoClient, ObjectId } from "mongodb";
import getMongoConn from "./db";
import cors from "cors";
import Dinossauro from "./models/Dinossauro.js";

const port = 3000
const app = express();

app.use(cors());
app.use(express.json());



app.get("/Dinossauros", async (req: Request, res: Response) =>{
    let conn: MongoClient | null  = null;
    try {
        conn =  await getMongoConn();
        const db = conn.db();
        const Dinossauro = db.collection("Dinossauros")
        const docs = await Dinossauro.find().toArray();
        res.status(200).json(docs);
    }catch (error){
        res.status(500).json({ message: (error as Error).message});
    } finally{
        conn?.close();
    }
});



app.post("/Dinossauros", async (req: Request, res: Response) => {
    const record = req.body;
    try{
        if(typeof record.nome !== "string"){
            throw new Error("O atributo nome não foi informado");
        }
        if (record.nome === ""){
            throw new Error("O atributo nome não é valido");
        }
        if (typeof record.altura != "number"){
            throw new Error("O atributo altura não foi informado");
        } 
        if (record.altura <= 0){ 
            throw new Error("O atributo altura não é valido"); 
        }
        if(typeof record.epoca !== "string"){
            throw new Error("O atributo época não foi informado");
        }
        if (record.epoca === ""){
            throw new Error("O atributo época não é valido");
        }
        if(typeof record.dieta !== "string"){
            throw new Error("O atributo dieta não foi informado");
        }
        if (record.dieta === ""){
            throw new Error("O atributo dieta não é valido");
        }  
        if(typeof record.nomeCientifico !== "string"){
            throw new Error("O atributo nome cientifico não foi informado");
        }
        if (record.nomeCientifico === ""){
            throw new Error("O atributo nome cientifico não é valido");
        }
    }catch(error){ 
        res.status(400).json({message: (error as Error).message}); 
        return; 
    } 
    const Dinossauro = new Dinossauro(record.nome, record.altura, record.epoca , record.dieta, record.nomeCientifico); 
    let conn: MongoClient | null = null;
    try{ 
        conn = await getMongoConn();
        const db = conn.db();
        const Dinossauro = db.collection("Dinossauros");
        await Dinossauro.insertOne(Dinossauro);
        res.status(201).json(Dinossauro);
    }catch (error){
        res.status(500).json({message: (error as Error).message});
    }finally{
        conn?.close();
    }
});


app.put("/Dinossauros/:id", async (req: Request, res: Response) => { 
	const id = req.params.id;
	try {
		const objectId = new ObjectId(id);
		let conn: MongoClient | null = null;
		try {
			conn = await getMongoConn();
			const db = conn.db();
			const Dinossauros = db.collection("Dinossauros");
			if (await Dinossauros.find({ _id: objectId }).count() > 0) { 
				const record = req.body;
                try {
                    if (typeof record.nome !== "string") {
                        throw new Error("O atributo nome não foi informado.");
                    }
                    if (record.nome === "") {
                        throw new Error("O atributo nome não é válido.");
                    }
                    if (typeof record.altura != "number") {
                        throw new Error("O atributo altura não foi informado.");
                    }

                    if (record.altura <= 0) {
                        throw new Error("O atributo altura não é válido.");
                    }
                    if(typeof record.epoca !== "string"){
                        throw new Error("O atributo época não foi informado");
                    }
                    if (record.epoca === ""){
                        throw new Error("O atributo época não é valido");
                    }
                    if(typeof record.dieta !== "string"){
                        throw new Error("O atributo dieta não foi informado");
                    }
                    if (record.dieta === ""){
                        throw new Error("O atributo dieta não é valido");
                    }  
                    if(typeof record.nomeCientifico !== "string"){
                        throw new Error("O atributo nome Cientifico não foi informado");
                    }
                    if (record.nomeCientifico === ""){
                        throw new Error("O atributo nome Cientifico não é valido");
                    }
                } catch (error) {
                    res.status(400).json({message: (error as Error).message});
                    return;
                }

                const Dinossauro = new Dinossauro(record.nome, record.ano, record.versao , record.criador, record.tipo);
                await Dinossauros.updateOne({
                    _id: objectId
                }, {
                    $set: Dinossauro
                });

                res.status(200).json(Dinossauro);

			} else {
				res.status(404).json({message: "Não existe Dinossauro com esse id."});
			}

		} catch (error) {
			res.status(500).json({message: (error as Error).message});
		} finally {
			conn?.close();
		}

	} catch (error) {
		res.status(400).json({message: "O id informado é inválido."});
	}
});


app.delete("/Dinossauros/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const objectId = new ObjectId(id);
        let conn: MongoClient | null = null;
        try {
            conn = await getMongoConn();
            const db = conn.db();
            const linguagens = db.collection("Dinossauros");
            
            if (await Dinossauros.countDocuments({ _id: objectId }) > 0) {

                await Dinossauros.deleteOne({ _id: objectId });
                res.status(204).send("");

            } else {
                res.status(404).json({message: "Não existe Dinossauro com esse id."});
            }

        } catch (error) {
            res.status(500).json({message: (error as Error).message});
        } finally {
            conn?.close();
        }

    } catch (error) {
        res.status(400).json({message: "O id informado é inválido."});
    }
});

app.listen(port, () => {
    console.log(`Servidor sendo executado na porta ${port}`);
}); 




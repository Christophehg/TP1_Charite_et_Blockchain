
import {createServer} from "node:http"
import {create, liste} from "./blockchain.js";
import {NotFoundError} from "./errors.js";
import {findBlocks, createBlock, findLastBlock} from "./blockchainStorage.js";

createServer(async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        const url = new URL(req.url, `http://${req.headers.host}`)
        const endpoint = `${req.method}:${url.pathname}`

        let results

        try {
            switch (endpoint) {
                case 'GET:/blockchain':
                    results = await findBlocks();
                    console.log("GET /blockchain");
                    break
                case 'POST:/blockchain':
                    let body = '';
                    req.on('data', chunk => { body += chunk.toString(); });
                    req.on('end', async () => {
                        try {
                            const { name, donation } = JSON.parse(body);
                            const newBlock = await createBlock(name, donation);
                            console.log("Bloc créé :", newBlock);

                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(newBlock));
                        } catch (err) {
                            console.error("Erreur lors de la création du bloc :", err);
                            res.writeHead(400, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Données invalides' }));
                        }
                    });
                    break
                default :
                    res.writeHead(404)
            }
            if (results) {
                res.write(JSON.stringify(results))
            }
        } catch (erreur) {
            if (erreur instanceof NotFoundError) {
                res.writeHead(404)
            } else {
                throw erreur
            }
        }
        res.end()
    }
).listen(3000)

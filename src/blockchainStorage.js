import {readFile, writeFile} from 'node:fs/promises'
import {getDate, monSecret} from "./divers.js";
import {NotFoundError} from "./errors.js";
import {createHash} from 'node:crypto'
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/* Chemin de stockage des blocks */
const pathBlockchain = path.join('../src/data/blockchain.json');

function calculateHash(data) {
    return createHash('sha256').update(data).digest('hex');
}


/**
 * Mes définitions
 * @typedef { id: string, nom: string, don: number, date: string,hash: string} Block
 * @property {string} id
 * @property {string} nom
 * @property {number} don
 * @property {string} date
 * @property {string} string
 *
 */

/**
 * Renvoie un tableau json de tous les blocks
 * @return {Promise<any>}
 */
export async function findBlocks() {
    try {
        const data = await fs.readFile(pathBlockchain, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erreur lors de la lecture du fichier blockchain.json", error);
        throw new Error("Impossible de lire la blockchain");
    }
}

/**
 * Trouve un block à partir de son id
 * @param partialBlock
 * @return {Promise<Block[]>}
 */
export async function findBlock(partialBlock) {
    // A coder
}

/**
 * Trouve le dernier block de la chaine
 * @return {Promise<Block|null>}
 */
export async function findLastBlock() {
    try {
        const blocks = await findBlocks();

        return blocks.length > 0 ? blocks[blocks.length - 1] : null;
    } catch (error) {
        console.error("Erreur lors de la récupération du dernier bloc :", error);
        throw error;
    }
}

/**
 * Creation d'un block depuis le contenu json
 * @param contenu
 * @return {Promise<Block[]>}
 */
export async function createBlock(name, donation) {
    try {
        const blocks = await findBlocks();
        const lastBlock = await findLastBlock();
        const newBlock = {
            id: uuidv4(),
            name,
            donation,
            date: new Date().toISOString(),
            previousHash: lastBlock ? calculateHash(JSON.stringify(lastBlock)) : null,
        };
        newBlock.hash = calculateHash(JSON.stringify(newBlock));
        blocks.push(newBlock);
        await fs.writeFile(pathBlockchain, JSON.stringify(blocks, null, 2));

        return newBlock;
    } catch (error) {
        console.error("Erreur lors de la création du bloc :", error);
        throw error;
    }
}

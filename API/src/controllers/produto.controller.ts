import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";

const prisma = new PrismaClient();

class ProdutoController{
    async createProduto(request:Request, response:Response){
        try{
            const { nome, descricao, preco, tipo, compras } = request.body
            const produto = await prisma.produto.create({
                data: {
                    nome,
                    descricao,
                    preco,
                    tipo,
                    compras: {
                        connect: compras
                    }
                }
            })
            response.status(201).json({message: "Produto criado com sucesso!", produto})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async readProduto(request:Request, response:Response){
        try{
            const produtos = await prisma.produto.findMany()
            if(produtos == null){
                throw new Error("Produto não existe")
            }
            response.status(200).json({message: "Produto(s) lido(s) com sucesso!", produtos})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async updateProduto(request:Request, response:Response){
        const {id} = request.params

        try{
            const produto = await prisma.produto.update({
                where: {id: Number(id)},
                data: request.body
            })
            response.status(200).json({message: "Produto atualizado com sucesso!", produto})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async destroyProduto(request:Request, response:Response){
        const {id} = request.params
        
        try{
            const produto = await prisma.produto.delete({
                where: {id: Number(id)}
            })
            response.status(204).json({message: "Produto excluído com sucesso!", produto})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }
}

export default ProdutoController;
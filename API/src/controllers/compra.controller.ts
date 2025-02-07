import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express";
import { Mailer } from "../config/mailer";

const prisma = new PrismaClient();

class CompraController{
    async createCompra(request:Request, response:Response){
        try{
            const { usuarioId, produtos } = request.body
            
            // Para o valorCompra não ser passado no request.body, implementei a lógica para
            // ler o valor dos produtos e o valorCompra ser o total.
            const produtosId = produtos.map((p: {id:number}) => p.id)

            const produtosAchados = await prisma.produto.findMany({
                where: {id:{in:produtosId}}
            })

            let valorCompra = 0
            produtosAchados.forEach((produto) => {
                valorCompra += produto.preco
            })

            // Aplicar o desconto se o usuário for Premium
            if((request as any).isPremium)
                valorCompra *= 0.9

            valorCompra = parseFloat(valorCompra.toFixed(2))

            const dataCompra = new Date()
            
            const compra = await prisma.compra.create({
                data: {
                    dataCompra,
                    valorCompra,
                    usuarioId,
                    produtos: {
                        connect: produtos
                    }
                }
            })
            // Email de confirmação de compra
            const usuario = await prisma.usuario.findUnique({
                where: {id: usuarioId}
            })

            if(usuario){
                const emailToBeSendedTo = usuario.email
                const subject = "Confirmação de Compra"
                const messageText = `Olá ${usuario.nome},\n\nSua compra foi confirmada!!\n\nValor da Compra: BRL ${valorCompra}`

                await Mailer.sendEmail(emailToBeSendedTo, subject, messageText)
            }

            response.status(201).json({message: "Compra criada com sucesso!", compra})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async readCompra(request:Request, response:Response){
        try{
            const compras = await prisma.compra.findMany()
            if(compras == null){
                throw new Error("Compra não existe")
            }
            response.status(200).json({message: "Compra(s) lida(s) com sucesso!", compras})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }   

    async updateCompra(request:Request, response:Response){
        const {id} = request.params
        try{
            const compra = await prisma.compra.update({
                where: {id: Number(id)},
                data: request.body
            })
            response.status(200).json({message: "Compra atualizada com sucesso!", compra})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async destroyCompra(request:Request, response:Response){
        const {id} = request.params
        try{
            const compra = await prisma.compra.delete({
                where: {id: Number(id)}
            })
            response.status(204).json({message: "Compra excluída com sucesso!", compra})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

}

export default CompraController;
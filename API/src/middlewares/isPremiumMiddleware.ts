import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Verifica se o usuário é premium e aplica um desconto
async function isPremium(request:Request, response:Response, next:NextFunction){
    try{
        const { usuarioId } = request.body

        console.log(usuarioId)

        const user = await prisma.usuario.findUnique({
            where: {id: usuarioId}
        })

        if(user?.premium)
            (request as any).isPremium = true
        else
            (request as any).isPremium = false

        next()

    }
    catch(error){
        response.status(500).json({error:error})
    }
}

export default isPremium;
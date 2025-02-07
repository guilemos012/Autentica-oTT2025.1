import {PrismaClient} from "@prisma/client";  //faz conexao entre as Models e as tabelas do banco
import {Request, Response} from "express";
import auth from "../config/auth";

const prisma = new PrismaClient();

class UsuarioController{
    async createUsuario(request:Request, response:Response) {
        try{
            const { cpf, email, nome, senha, premium, rua, numero } = request.body
            const { hash, salt } = auth.generatePassword(senha)
            const user = await prisma.usuario.create(
                {data: {
                    cpf,
                    email,
                    nome,
                    rua,
                    premium,
                    numero,
                    hash,
                    salt
                }
            })
            response.status(201).json({message: "Usuário criado com sucesso!", user})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async login(request:Request, response:Response){
        
        try{
            const { email, senha } = request.body

            const user = await prisma.usuario.findUnique({
                where: {email:email}
            })

            if(!user){
                response.status(400).json({message:"Usuário não existe"})
                return
            }

            const { hash, salt } = user

            if(!auth.checkPassword(senha, hash, salt)){
                response.status(400).json({message:"Senha incorreta"})
                return
            }

            const token = auth.generateJWT(user)

            response.status(201).json({message: "Token enviado", token: token})
    
        }
        catch(error){
            response.status(500).json({message: "Server Error"})
        }
    }

    async testeAutenticacao(request: Request, response: Response){
        const email = request.user as string; 

        if(!email){
            response.status(401).json({ message: "Não autorizado" });
            return 
        }

        response.status(201).json({message:"acesso autorizado"})
    }

    async readUsuario(request:Request, response:Response){        
        try{
            const users = await prisma.usuario.findMany()
            if(users == null){
                response.status(404).json({message: "Nenhum usuário encontrado"});
                return 
            }
            response.status(200).json({message: "Usuário lido com sucesso!", users});
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async updateUsuario(request:Request, response:Response){
        const {id} = request.params

        try{
            const user = await prisma.usuario.update({
                data: request.body,
                where: {id: Number(id)}
            })
            response.status(200).json({message: "Atualização feita com sucesso!", user})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }

    async destroyUsuario(request:Request, response:Response){
        const {id} = request.params

        try{
            const user = await prisma.usuario.delete({
                where: {id: Number(id)}
            })
            response.status(204).json({menssage: "Usuário deletado com sucesso!", user})
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }  
}

export default UsuarioController;
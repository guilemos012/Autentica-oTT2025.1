import { body } from "express-validator";

export class UserValidator{
    public static validatorUser(crudMethod: string){
        switch(crudMethod){
            case "create":
                return [
                    body("cpf").exists().isLength({min:10, max:11}),

                    body("email").exists().trim().isEmail(),

                    body("nome").exists().trim().isString().isLength({min:3}),

                    body("premium").optional().isBoolean(),

                    body("rua").exists().trim().isString(),

                    body("numero").exists().isNumeric()
                ];
            default:
                return [];
        }
    }
}

export class CompraValidator{
    public static validatorCompra(crudMethod: string){
        switch(crudMethod){
            case "create":
                return[
                    body("usuarioId").exists().isNumeric(),

                    body("produtos").isArray({min:1}),

                    body("produtos.*.id").exists().isNumeric()
                ];
            default:
                return [];
        }
    }
}


export class ProdutoValidator{
    public static validatorProduto(crudMethod: string){
        switch(crudMethod){
            case "create":
                return [
                    body("nome").exists().trim().isString(),

                    body("descricao").optional().trim().isString(),

                    body("preco").exists().isNumeric(),

                    body("tipo").exists().trim().isString()
                ];
            default:
                return [];
        }
    }
}
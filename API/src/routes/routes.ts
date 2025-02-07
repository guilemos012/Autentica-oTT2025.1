// Importações
import { Router } from "express";
import passport from "passport";
import isPremium from "../middlewares/isPremiumMiddleware";
import { UserValidator, ProdutoValidator, CompraValidator } from "../config/validator";
import { ResultValidator } from "../middlewares/resultValidator";

import UsuarioController from "../controllers/usuario.controller";
import CompraController from "../controllers/compra.controller";
import ProdutoController from "../controllers/produto.controller";
import { photoUpload } from "../config/uploader";

const router = Router()

const usuarioController = new UsuarioController();
const compraController = new CompraController();
const produtoController = new ProdutoController();

// Definição das rotas para Usuário
router.post(
    "/usuarios", 
    UserValidator.validatorUser("create"),
    ResultValidator.validateResult,
    usuarioController.createUsuario 
)
router.get("/usuarios", usuarioController.readUsuario)
router.put("/usuarios/:id", usuarioController.updateUsuario)
router.delete("/usuarios/:id", usuarioController.destroyUsuario)
router.get("/usuarios/login", usuarioController.login)
router.get("/usuario", passport.authenticate("jwt", { session: false }), usuarioController.testeAutenticacao)
router.post("/usuario/img", photoUpload.single("image"))

// Definição das rotas para Compra
router.post("/compras", 
CompraValidator.validatorCompra("create"),
ResultValidator.validateResult,    
isPremium, 
compraController.createCompra
)
router.get("/compras", compraController.readCompra)
router.put("/compras/:id", compraController.updateCompra)
router.delete("/compras/:id", compraController.destroyCompra)

// Definição das rotas para Produto
router.post("/produtos", 
ProdutoValidator.validatorProduto("create"),
ResultValidator.validateResult,    
produtoController.createProduto
)
router.get("/produtos", produtoController.readProduto)
router.put("/produtos/:id", produtoController.updateProduto)
router.delete("/produtos/:id", produtoController.destroyProduto)

export default router;
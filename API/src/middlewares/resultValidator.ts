import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export class ResultValidator{
    public static validateResult(request:Request, response:Response, next:NextFunction){
        try{
            const validationError = validationResult(request)

            if(!validationError.isEmpty()){
                response.status(400).json({error:validationError.array()})
                return 
            }
            
            next();
        }
        catch(error){
            response.status(500).json({error:error})
        }
    }
}
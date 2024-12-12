import { Request } from "express";
import { IFreelancer } from "../models/freelancer";

interface AuthenticationRequest extends Request {
    user?: IFreelancer | undefined;
}

export {
    AuthenticationRequest
}
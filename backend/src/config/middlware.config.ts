import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import path from 'path'

export default class MiddlwareConfig {
  static config(app: express.Application): void {
    const origins = ['http://localhost:5173', '3.144.116.111']  
    app.use(
            cors({
              origin: origins,
              methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
              credentials: true,
              allowedHeaders: [
                "Content-Type",
                "Authorization",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Access-Control-Allow-Headers",
              ],
            })
          );
          
        app.use(express.static(path.join(process.cwd(), "src", "public")));
        app.use(cookieParser());

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

    }
}
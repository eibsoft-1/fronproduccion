import { Router } from "express";
import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config();

const dash = Router();

dash.get("/inicio", (req, res)=>{
    if (req.cookies.ckeib){
        try {
            const token = jwt.verify(
                req.cookies.ckeib, 
                process.env.SECRET_KEY)

                res.render("dash", {
                   "nombre": token.nombre,
                   "foto":token.foto,
                   "menu" : 0
                });

        } catch (error) {
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }
})

dash.get("/usuario", async (req, res)=>{
    if (req.cookies.ckeib){
        try {
            const token = jwt.verify(
                req.cookies.ckeib, 
                process.env.SECRET_KEY)

                let ruta = process.env.ENDPOINT + "/api/users";
                let option = {
                    method:"GET"
                }
                let datos = {};
                const result = await fetch(ruta, option)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    datos = data;
                })
                .catch(err => console.error("Error en peticion: " + err))

                res.render("dash", {
                   "nombre": token.nombre,
                   "foto":token.foto,
                   "menu" : 1,
                   "datos" : datos 
                });

        } catch (error) {
            res.redirect("/");
        }
    }else{
        res.redirect("/");
    }
})

dash.post("/guardar", (req, res)=>{
    if(req.body.name){

        let data = {
            name : req.body.name
        }
        let metodo = "post";

        if (req.body.id){
            data = {
                id: req.body.id,
                name : req.body.name
            }
            metodo = "put";
        }

        let ruta = process.env.ENDPOINT + "/api/users";

        let option = {
            method : metodo,
            headers:{
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        }
        try {
            const result = fetch(ruta, option)
            .then(res=>res.json())
            .then(data=>{
                console.log("Datos guardados");
            })
            .catch(err=>console.log("erro al consumir api " + err))
            res.redirect("/v1/usuario");
        } catch (error) {
            
        }

    }else{
        res.send("erorr ");
    }
})

dash.get("/salir", (req, res)=>{
    res.clearCookie("ckeib");
    res.redirect("/");
})
dash.get("/edit-user",(req, res)=>{
    const id = req.query.id;
    const name = req.query.name;

    let datos = {
        id:id,
        name:name
    }

    if (req.cookies.ckeib){
        try {
            const token = jwt.verify(
                req.cookies.ckeib, 
                process.env.SECRET_KEY)
                res.render("dash", {
                    "nombre": token.nombre,
                    "foto":token.foto,
                    "menu" : 4,
                    "datos" : datos
                 });

        } catch (error) {
            console.error("Errro con el token");
        }
    }
})

dash.get("/borrar", async (req, res)=>{
    const id = req.query.id;
    if (req.cookies.ckeib){
        try {
            const token = jwt.verify(
                req.cookies.ckeib, 
                process.env.SECRET_KEY)

                const url = `${process.env.ENDPOINT}/api/users/${id}`;
                const option={
                    method:"DELETE"
                };
                const result = await fetch(url, option)
                .then(response=>response.json())
                .then(data=>{
                    if (data[0].affectedRows==1){

                    }else{
                        console.log("NO BORRADO");
                    }
                })
                res.redirect("/v1/usuario")
        } catch (error) {
            console.error("Erro con el token", error);
        }
    }
})

export default dash;
import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { userModel } from "../src/models/user.model.js";


// BLOQUES DE PRUEBA
describe(
    "Pruebas de controladores para los usuarios",
    ()=>{
        beforeEach(async()=>{
            await userModel.deleteMany({});
        });
        afterAll(async()=>{
            await mongoose.connection.close();
        });
        const testUser = {
            Nombre: "Juan Esteban Ocampo",
            Correo: "juanesocampo@gmail.com",
            Contrasena: "javeriana123",
        }

        // Peticion Put
        describe(
            "Pruebas PUT con los usuarios",
            () => {
                it(
                    "Deberia decir que hay un error al modificar el usuario",
                    async()=>{
                        const res = await supertest(app).put("/usuarios/actualizar/:id");

                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al actualizar el usuario")
                    }
                )

                it(
                    "Deberia actualizar el usuario",
                    async()=>{
                        const newUser = (await userModel.create(testUser)).save();
                        const updatedUser = { ...testUser, Nombre: "Pablo" };
                        const res = await supertest(app).put('/usuarios/actualizar/' + (await newUser).id).send(updatedUser);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El usuario fue altualizado con exito")
                    }
                )

                it(
                    "No se encuentra usuario para modificar",
                    async()=>{
                        const newUser = (await userModel.create(testUser)).save();
                        const idUser = "9a5c1d3e7f800bca246e905f";
                        const updatesUser = { ...testUser, Nombre: "Pablo" };
                        const res = await supertest(app).put('/usuarios/actualizar/' + idUser).send(updatesUser);
                        expect(res.statusCode).toBe(404);
                        expect(res.body).toHaveProperty("mensaje", "No ha sido posible encontrar un usuario para actualizar")
                    }
                )
            }
        )

        // Peticion Post
        describe(
            "Pruebas POST para usuarios",
            () => {
                it(
                    "Creacion de usuarios correcta",
                    async()=>{
                        const res = await supertest(app).post('/usuarios/crear').send(testUser)
                        expect(res.statusCode).toBe(201);
                    }
                )

                it(
                    "Error en caso que falte info",
                    async()=>{
                        const res = await supertest(app).post("/usuarios/crear").send({ email: testUser.email })
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al crear un usuario");
                    }
                )
            }
        )

        // Peticion Delete
        describe(
            "Pruebas Delete",
            ()=>{
                it(
                    "Ocurre un error al eliminar el usuario",
                    async()=>{
                        const res = await supertest(app).delete("/usuarios/eliminar/:id");
                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al eliminar el usuario")
                    }
                )

                it(
                    "Eliminar el Usuario",
                    async()=>{
                        const newUser = (await userModel.create(testUser)).save();
                        const res = await supertest(app).delete("/usuarios/eliminar/" + (await newUser).id);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El usuario fue eliminado sin problema alguno :D")
                    }
                )
            }
        )

        // Peticion Get
        describe(
            "Pruebas GET para usuarios",
            ()=>{
                it(
                    "No hay usuarios almacenados",
                    async()=>{
                        const res = await supertest(app).get("/usuarios/obtener");
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "No hay usuarios en Ecocloset")
                    }
                )

                it(
                    "Obtener los usuarios",
                    async()=>{
                        await userModel.create(testUser);
                        const res = await supertest(app).get("/usuarios/obtener");

                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "Los usuarios encontrados son los siguientes:")
                    }
                )
            }
        )
    }
)
import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { adminModel } from "../src/models/admin.model.js";


// BLOQUES DE PRUEBA
describe(
    "Pruebas de controladores para los administradores",
    ()=>{
        beforeEach(async()=>{
            await adminModel.deleteMany({});
        });
        afterAll(async()=>{
            await mongoose.connection.close();
        });
        const testAdmin = {
            Nombre: "Adriana",
            Correo: "ariana@administradora.com",
            Telefono: 3147887658,
            Contrasena: "locky123", 
        }

        // Peticion Put
        describe(
            "Pruebas PUT con los productos",
            ()=>{
                it(
                    "Deberia decir que hay un error al modificar el producto",
                    async()=>{
                        const res = await supertest(app).put("/admin/actualizar/:id");
                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al actualizar el administrador/a")
                    }
                )

                it(
                    "Deberia actualizar el administrador",
                    async()=>{
                        const newUser = (await adminModel.create(testAdmin)).save();
                        const updatedAdmin = { ...testAdmin, Nombre: "Mariana" };
                        const res = await supertest(app).put('/admin/actualizar/' + (await newAdmin).id).send(updatedAdmin);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El administrador/a fue actualizado con exito")
                    }
                )

                it(
                    "No se encuentra un administrador para modificar",
                    async()=>{
                        const newAdmin = (await adminModel.create(testAdmin)).save();
                        const idAdmin = "f27b9c5d1a680e3f04d8e2a7";
                        const updatedAdmin = { ...testAdmin, Nombre: "Mariana" };
                        const res = await supertest(app).put('/admin/actualizar/' + idProduct).send(updatedAdmin);
                        expect(res.statusCode).toBe(404);
                        expect(res.body).toHaveProperty("mensaje", "No ha sido posible encontrar un administrador/a para actualizar")
                    }
                )
            }
        )

        // Peticion Post
        describe(
            "Pruebas POST para administradores",
            () => {
                it(
                    "Creacion del administrador sin problema",
                    async()=>{
                        const res = await supertest(app).post('/admin/crear').send(testAdmin)
                        expect(res.statusCode).toBe(201);
                    }
                )

                it(
                    "Error en caso que falte información",
                    async()=>{
                        const res = await supertest(app).post("/admin/crear").send({ email: testAdmin.email })
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al crear el administrador/a");
                    }
                )
            }
        )

        // Peticion Delete
        describe(
            "Probar eliminar un adiministrador/a",
            ()=>{
                it(
                    "Ocurre un error al eliminar el administrador",
                    async()=>{
                        const res = await supertest(app).delete("/admin/eliminar/:id");
                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al eliminar el administrador")
                    }
                )

                it(
                    "Eliminar el administrador",
                    async()=>{
                        const newAdmin = (await adminModel.create(testAdmin)).save();
                        const res = await supertest(app).delete("/admin/eliminar/" + (await newAdmin).id);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El administrador fue eliminado sin problema alguno :3")
                    }
                )
            }
        )

        // Peticion Get
        describe(
            "Pruebas GET para el administrador",
            ()=>{
                it(
                    "No hay ningun administrador almacenado",
                    async()=>{
                        const res = await supertest(app).get("/admin/obtener");
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "No hay ningun administrador en Ecocloset")
                    }
                )

                it(
                    "Obtener los administradores",
                    async()=>{
                        await adminModel.create(testAdmin);
                        const res = await supertest(app).get("/admin/obtener");
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "Los administradores encontrados son los siguientes:")
                    }
                )
            }
        )
    }
)
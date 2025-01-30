import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import { productModel } from "../src/models/products.models.js";


// BLOQUES DE PRUEBA
describe(
    "Pruebas de controladores para los productos",
    () => {
        beforeEach(async()=>{
            await productModel.deleteMany({});
        });
        afterAll(async()=>{
            await mongoose.connection.close();
        });
        const testProduct = {
            Nombre: "Camiseta",
            Imagen: "https://undergoldapparel.com/cdn/shop/files/2_65fba958-eb77-4414-94ac-37cf2f62f3cf_1440x1800.jpg?v=1729881341",
            Tallas: "S, M, L,",
            Precio: "250000",
            Descripcion: "Camiseta con diseño oversized",
        }

        // Peticion Put
        describe(
            "Pruebas PUT con los productos",
            ()=>{
                it(
                    "Deberia decir que hay un error al modificar el producto",
                    async()=>{
                        const res = await supertest(app).put("/productos/actualizar/:id");
                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al actualizar el producto")
                    }
                )

                it(
                    "Deberia actualizar el producto",
                    async()=>{
                        const newUser = (await productModel.create(testProduct)).save();
                        const updatedProduct = { ...testProduct, Nombre: "Chamarra" };
                        const res = await supertest(app).put('/productos/actualizar/' + (await newProduct).id).send(updatedProduct);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El producto fue actualizado con exito")
                    }
                )

                it(
                    "No se encuentra producto para modificar",
                    async()=>{
                        const newProduct = (await productModel.create(testProduct)).save();
                        const idProduct = "9a5c1d3e7f800bca246e905f";
                        const updatedProduct = { ...testProduct, Nombre: "Chamarra" };
                        const res = await supertest(app).put('/productos/actualizar/' + idProduct).send(updatesUser);
                        expect(res.statusCode).toBe(404);
                        expect(res.body).toHaveProperty("mensaje", "No ha sido posible encontrar un usuario para actualizar")
                    }
                )
            }
        )

        // Peticion Post
        describe(
            "Pruebas POST para productos",
            () => {
                it(
                    "Creacion del producto sin problema",
                    async()=>{
                        const res = await supertest(app).post('/producto/crear').send(testProduct)
                        expect(res.statusCode).toBe(201);
                    }
                )

                it(
                    "Error en caso que falte información",
                    async()=>{
                        const res = await supertest(app).post("/productos/crear").send({ email: testUser.email })
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al crear el producto");
                    }
                )
            }
        )

        // Peticion Delete
        describe(
            "Probar eliminar un producto",
            ()=>{
                it(
                    "Ocurre un error al eliminar el producto",
                    async()=>{
                        const res = await supertest(app).delete("/producto/eliminar/:id");
                        expect(res.statusCode).toBe(400);
                        expect(res.body).toHaveProperty("mensaje", "Ocurrio un error al eliminar el producto")
                    }
                )

                it(
                    "Eliminar el producto",
                    async()=>{
                        const newUser = (await productModel.create(testProduct)).save();
                        const res = await supertest(app).delete("/producto/eliminar/" + (await newUser).id);
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "El producto fue eliminado sin problema alguno :P")
                    }
                )
            }
        )

        // Peticion Get
        describe(
            "Pruebas GET para el producto",
            ()=>{
                it(
                    "No hay ningun producto almacenado",
                    async()=>{
                        const res = await supertest(app).get("/productos/obtener");
                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "No hay producto en Ecocloset")
                    }
                )

                it(
                    "Obtener los productos",
                    async()=>{
                        await productModel.create(testProduct);
                        const res = await supertest(app).get("/productos/obtener");

                        expect(res.statusCode).toBe(200);
                        expect(res.body).toHaveProperty("mensaje", "Los productos encontrados son los siguientes:")
                    }
                )
            }
        )
    }
)
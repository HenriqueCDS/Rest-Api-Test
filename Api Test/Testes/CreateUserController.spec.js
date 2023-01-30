const app = require("../app");
const request = require("supertest");
const {User} = require("../app");
 



describe("Criar usuario controle", () => {

    it("Deve criar um novo usuario", async () => {
        /*const response = await request(app).post("/produtos").send({
            nome:"Gabriel",
            preco: 10
        });

      console.log(response.status);

      expect(responde.nome).toBe('Gabriel');*/
        const user = ({
            nome: 'Gabriel',
            preco: 10,
        })
        /*console.log(user);
        expect(user.nome).toBe('Gabriel');*/

        const response = await request (app).post("/produtos").send({
            nome: user.nome,
            preco: user.preco,
        });
        console.log(response.nome);
        expect(response.status).toBe(200);

    });

});

const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const req = require('express/lib/request');

router.get('/', (req, res, next) => {
    /* res.status(200).send({
         mensagem: 'Usando o Get de teste',
     });*/
    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM teste',
            (error, result, fields) => { // result recebe o valor da consulta do bd
                if (error) { return res.status(500).send({ error: error }) }


                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => { // muda o retorno para um novo
                        return {
                            id: prod.id,
                            nome: prod.nome,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/teste/' + prod.teste
                            }
                        }
                    })
                }

                return res.status(200).send({ response })
            }
        )
    });
});

//retorna todos os produtos
router.post('/', (req, res, next) => {
    /*res.status(201).send({
        mensagem: 'Usando o post dentro do bd edukas' 
    });*/
    mysql.getConnection((error, conn) => {

        if (error) {
            console.error(error);
            res.status(500).send({ error: error });
        }
        conn.query(
            'INSERT INTO teste(id, nome) VALUES (?,?)',
            [req.body.id, req.body.nome],

            (error, result, field) => {
                conn.release(); // libera banco para proxima passagem


                if (error) {

                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                }

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id: result.id,
                        nome: req.body.nome,
                        request: {
                            tipo: 'POST',
                            descricao: 'Insere um produto',
                            url: 'http://localhost:3000/teste'
                        }
                    }
                }
                return res.status(201).send(response);


            }
        );
    });
});

// alterar um produto 
router.patch('/', (req, res, next) => {
    /* res.status(201).send({
         mensagem: 'Usando o PATCH dentro da rota de teste',
     });*/
    mysql.getConnection((error, conn) => {

        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'UPDATE teste SET  id = ?, nome = ?  WHERE id = ?',
            [req.body.id_novo, req.body.nome, req.body.id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id: req.body.id,
                        nome: req.body.nome,
                        request: {
                            tipo: 'PATCH',
                            descricao: 'Altera o produto',
                            url: 'http://localhost:3000/teste' + req.body.id
                        }
                    }
                }
                return res.status(202).send(response);

            }
        );

    });

});

//deleta um produto
router.delete('/', (req, res, next) => {
    /*res.status(201).send({
        mensagem: 'Usando o DELETE dentro do bd edukas'
    });*/
    mysql.getConnection((error, conn) =>{

        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM teste where id = ?',
            [req.body.id],
            (error, result, fields) =>{
                if(error){return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo:'POST',
                        descricao:'Insere um produto',
                        url:'http://localhost:3000/teste',
                        body:{
                            nome:'string',
                            preco: 'Number'
                        }

                    }
                }
    

                res.status(202).send({response});
            }
        )

    });

});


module.exports = router;
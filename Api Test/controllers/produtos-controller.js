const mysql = require('../mysql').pool

exports.getProdutos =(req,res,next) => {
    mysql.getConnection((error,conn) => {

        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos', 
            (error, result, fields) =>{ // result recebe o valor da consulta do bd
                if(error){return res.status(500).send({error: error})}
                

                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod =>{ // muda o retorno para um novo
                        return{
                            id_produto:prod.id_produto,
                            nome: prod.nome,
                            preco:prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os produtos',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto 
                            }
                        }
                    })
                }

                return res.status(200).send({response})
            }
        )
    });
};

exports.postProdutos = (req,res,next)=>{
    mysql.getConnection((error, conn) =>{
        
        if(error){
            console.error(error);
            res.status(500).send({error:error});
        }
         conn.query(
            'INSERT INTO produtos(nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],

            (error, result, field) => {
                conn.release(); // libera banco para proxima passagem


                if(error){
                    
                    return res.status(500).send({
                        error:error,
                        response:null
                    });
                }

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {
                        id_produto: result.id_produto,
                        nome:req.body.nome,
                        preco: req.body.preco,
                        request:{
                            tipo: 'POST',
                            descricao:'Insere um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response);


            }
        );
    });


};

exports.getUmProduto = (req,res,next) =>{
    mysql.getConnection((error, conn) =>{

        if(error){return res.status(500).send({error: error})}
        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?',
            [req.params.id_produto],
            (error, result, fields) =>{
                if(error){return res.status(500).send({error: error})}

                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'nao foi encontrado o produto'
                    })
                }
    
                const response = {
                    produto: {
                        mensagem:'Produto retornado com sucesso',
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request:{
                            tipo: 'GET',
                            descricao:'Retorna os dados de um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(200).send(response);

            }
        )

    });
}
exports.patchProduto = (req,res,next) => {
    mysql.getConnection((error, conn) =>{

        if(error){return res.status(500).send({error: error})}
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, resultado, fields) =>{
                if(error){return res.status(500).send({error: error})}

                const response = {
                    mensagem:'Produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request:{
                            tipo: 'PATCH',
                            descricao:'Altera o produto',
                            url: 'http://localhost:3000/produtos' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response);

            }
        )

    });
}
exports.deleteProduto = (req,res,next) =>{
    mysql.getConnection((error, conn) =>{

        if(error){return res.status(500).send({error: error})}
        conn.query(
            'DELETE FROM produtos where id_produto = ?',
            [req.body.id_produto],
            (error, result, fields) =>{
                if(error){return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo:'POST',
                        descricao:'Insere um produto',
                        url:'http://localhost:3000/produtos',
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
}
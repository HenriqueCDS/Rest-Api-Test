const mysql = require('../mysql').pool

exports.getPedidos =(req, res, next) => {

    mysql.getConnection((error,conn) => {

        if(error){return res.status(500).send({error: error})}
        conn.query(
            `SELECT pedido.id_pedido, 
                    pedido.quantidade, 
                    produtos.id_produto,
                    produtos.nome,
                    produtos.preco
               FROM pedido 
        INNER JOIN  produtos 
            
            on produtos.id_produto = pedido.id_produto;`, 
            (error, result, fields) =>{ // result recebe o valor da consulta do bd
                if(error){return res.status(500).send({error: error})}
                

                const response = {
                    pedidos: result.map(pedido =>{ // muda o retorno para um novo
                        return{
                            id_pedido: pedido.id_pedido,
                            quantidade: pedido.quantidade,

                            produto:{
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco,

                            },
                            
                            
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os Retorna um pedido',
                                url: 'http://localhost:3000/produtos/' + pedido.id_pedido 
                            }
                        }
                    })
                }

                return res.status(200).send({response})
            }
        )
    });
};

exports.postPedidos = (req,res, next) => {

    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM produtos WHERE id_produto = ?;', [req.body.id_produto],
            (error, resultado, field) => {

                if (error) { console.error(error); res.status(500).send({ error: error }) }

                if (resultado.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID'
                    })
                }

                conn.query(
                    'INSERT INTO pedido (id_produto, quantidade) VALUES (?,?);',
                    [req.body.id_produto, req.body.quantidade],
                    (error, resultado, field) => {
                        conn.release();
                        console.error(error)
                        if (error) { console.error(error); res.status(500).send({ error: error }) }
                        const response = {
                            mensagem: 'Pedidos inserido com sucesso',
                            pedidos: {
                                id_pedidos: resultado.id_pedidos,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'Retorna todos o pedidos',
                                    url: 'http://localhost:3000/pedidos'
                                }
                            }
                        }
                        return res.status(201).send(response);
                    }
                )
            })
    })
    
};

exports.getUmPedido = (req,res,next) => {

    mysql.getConnection((error, conn) => {

        if (error) { console.error(error); res.status(500).send({ error: error }) } 
        conn.query(
            'SELECT * FROM pedido WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, resultado,field) =>{
            if (error) { console.error(error); res.status(500).send({ error: error }) } 

            if(resultado.length == 0){
                  return res.status(404).send({
                    mensagem:'Não foi encontrado produto com este ID'
                  }) 
            }
            const response = {
                pedido:  {
                        id_pedido: resultado[0].id_pedido,
                        id_produto: resultado[0].id_produto,
                        quantidade: resultado[0].quantidade, 
                        request:{
                            tipo:'GET',
                            descricao:'Retorna todos os pedidos',
                            url:'http://localhost:3000/produtos'
                        }
                    }
            } 
           return res.status(200).send(response);
        }

        )
    });
}

exports.deletePedido = (req,res,next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { console.error(error); res.status(500).send({ error: error }) }
        conn.query(

            'delete from pedido where id_pedido = ?',[req.body.id_pedido],
            (error, resultado, field) => {
                conn.release();
                console.error(error)
                if (error) { console.error(error); res.status(500).send({ error: error }) } 
                const response = {
                    mensagem: 'Pedidos removido com sucesso',
                    request:{
                                tipo:'Post',
                                descricao:'Insere um pedidos',
                                url:'http://localhost:3000/pedidos',
                                body: {
                                    id_produto:'Number',
                                    qunatidade: 'Number'
                                }
                            }


                } 
               return res.status(202).send(response);
            }
        )
    });
}

const express = require('express');
const req = require('express/lib/request');
const router = express.Router();

const PedidosController = require('../controllers/pedidos-controller');


// retorna um pedido expecifico

router.get('/', PedidosController.getPedidos);


// insere um pedido
router.post('/', PedidosController.postPedidos);


// retorna os dados de um produto
router.get('/:id_pedido', PedidosController.getUmPedido);


// exclui um produto
router.delete('/', PedidosController.deletePedido);


module.exports = router;


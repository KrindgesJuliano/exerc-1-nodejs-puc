import express from 'express';
import cors from 'cors';
import fs from 'fs';

const options = {
  key: fs.readFileSync(
    '/etc/letsencrypt/live/atividade1.vps.webdock.cloud/privkey.pem/'
  ),
  cert: fs.readFileSync(
    '/etc/letsencrypt/live/atividade1.vps.webdock.cloud/fullchain.pem'
  ),
};
const app = express();
const port = 3000;
app.use(express.json());

const lista_produtos = {
  produtos: [
    {
      id: 1,
      descricao: 'Arroz parboilizado 5Kg',
      valor: 25.0,
      marca: 'Tio João',
    },
    { id: 2, descricao: 'Maionese 250gr', valor: 7.2, marca: 'Helmans' },
    { id: 3, descricao: 'Iogurte Natural 200ml', valor: 2.5, marca: 'Itambé' },
    {
      id: 4,
      descricao: 'Batata Maior Palha 300gr',
      valor: 15.2,
      marca: 'Chipps',
    },
    { id: 5, descricao: 'Nescau 400gr', valor: 8.0, marca: 'Nestlé' },
  ],
};

function generateUniqueId() {
  return Math.floor(Math.random() * 100).toFixed();
}

app.post('/produtos', (req, res) => {
  const requestBody = req.body;
  const newId = Number(generateUniqueId());

  const newProduct = { id: newId, ...requestBody };

  lista_produtos.produtos.push(newProduct);

  const createdResource = newProduct;
  res.status(201).json(createdResource);
});

app.get('/produtos', (req, res) => {
  res.send(lista_produtos.produtos);
});

app.get('/produtos/:idProduct', (req, res) => {
  const { idProduct } = req.params;

  const getProduct = lista_produtos.produtos.find(
    ({ id }) => id === Number(idProduct)
  );

  res.send(getProduct);
});

app.put('/produtos/:idProduct', (req, res) => {
  const { id, descricao, valor, marca } = req.body;
  const { idProduct } = req.params;

  const getProductIndex = lista_produtos.produtos.findIndex(
    ({ id }) => id === Number(idProduct)
  );

  if (getProductIndex !== -1) {
    const product = lista_produtos.produtos[getProductIndex];
    lista_produtos.produtos[getProductIndex] = {
      id: product.id,
      descricao: !descricao ? product.descricao : descricao,
      valor: !valor ? product.valor : valor,
      marca: !marca ? product.marca : marca,
    };
    res.send(lista_produtos.produtos[getProductIndex]);
  } else {
    res.status(400).json('Product with the specified ID was not found.');
  }
});

app.delete('/produtos/:idProduct', (req, res) => {
  const { idProduct } = req.params;

  const getProductIndex = lista_produtos.produtos.findIndex(
    ({ id }) => id === Number(idProduct)
  );

  if (getProductIndex !== -1) {
    lista_produtos.produtos = lista_produtos.produtos.filter(
      (product) => product.id !== Number(idProduct)
    );
    console.log(lista_produtos.produtos);
    res.send('Success');
  } else {
    res.status(400).json('Product with the specified ID was not found.');
  }
});

app.use(cors());
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

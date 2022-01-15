import { Router } from 'express';
import { api } from './services/api';

const router = Router();

type Item = {
  id: string;
  title: string;
  price: {
    currency: string;
    amount: number;
    decimals: number;
  };
  picture: string;
  condition: string;
  free_shipping: string;
  sold_quantity?: number;
  description?: string;
};

type Author = {
  name: string;
  lastname: string;
};

interface IProducts {
  author: Author;
  categories: string[];
  items: Item[];
}

interface IProductDetail {
  author: Author;
  item: Item;
}

router.get('/api/items', async (req, res) => {
  try {
    const response = await api.get(`sites/MLA/search?q=${req.query.q}`);

    const items = response.data.results.slice(0, 4);

    const products: IProducts = {
      author: {
        name: '',
        lastname: '',
      },
      categories: [],
      items: [],
    };

    items.forEach((item: any) => {
      products.items.push({
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: 0,
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
      });
    });

    return res.status(200).json(items);
  } catch (err) {
    return res.status(500);
  }
});

router.get('/api/items/:id', async (req, res) => {
  console.log(req.params.id);

  try {
    const itemData = await api.get(`items/${req.params.id}`);
    const descriptionData = await api.get(`items/${req.params.id}/description`);

    const product: IProductDetail = {
      author: {
        name: '',
        lastname: '',
      },
      item: {
        id: itemData.data.id,
        title: itemData.data.title,
        price: {
          currency: itemData.data.currency_id,
          amount: itemData.data.price,
          decimals: 0,
        },
        picture: itemData.data.thumbnail,
        condition: itemData.data.condition,
        free_shipping: itemData.data.shipping.free_shipping,
        sold_quantity: 0,
        description: descriptionData.data.plain_text,
      },
    };

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500);
  }
});

export { router };

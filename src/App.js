import { useState } from "react";

const initialProducts = [
  {
    id: 12345,
    name: "AA Bateries",
    price: 10.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI3S7ddcwzAaRG_7qPvFivJC00-vZknstgZA&usqp=CAU",
    quantity: 0,
  },
  {
    id: 54321,
    name: "Blanket",
    price: 25.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgB5K2Jmh3mFGnxOWPZd769LgZyODSPv3vzA&usqp=CAU",
    quantity: 0,
  },
  {
    id: 34512,
    name: "Shampoo",
    price: 7.99,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4XLla7EspKXM0AAq8cfmDpVFVI4XN6yLARQ&usqp=CAU",
    quantity: 0,
  },
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [inCartProducts, setInCartProducts] = useState([]);

  function handleProductCreate(product) {
    console.log("called");

    setProducts((productsList) => [...productsList, product]);

    console.log(products);
  }

  function handleCartProductAdd(product, quantity) {
    const alreadyInCart = inCartProducts.map((curProd) =>
      curProd.id === product.id ? true : false
    );

    if (alreadyInCart.includes(true)) {
      setInCartProducts((inCartProducts) =>
        inCartProducts.map((curProd) =>
          curProd.id === product.id
            ? {
                ...curProd,
                quantity: Number(curProd.quantity) + Number(quantity),
              }
            : curProd
        )
      );
    } else {
      setInCartProducts((inCartProducts) =>
        [...inCartProducts, product].map((curProd) =>
          curProd.id === product.id
            ? { ...curProd, quantity: quantity }
            : curProd
        )
      );
    }
  }

  function handleCartProductRemove(product) {
    setInCartProducts((inCartProducts) =>
      inCartProducts.filter((curProd) => curProd.id !== product.id)
    );
  }

  return (
    <div className="container">
      <ProductsList
        products={products}
        onCartProductAdd={handleCartProductAdd}
        onProductCreate={handleProductCreate}
      />
      <ShoppingCart
        inCartProducts={inCartProducts}
        onCartProductRemove={handleCartProductRemove}
      />
    </div>
  );
}

function ProductsList({ products, onCartProductAdd, onProductCreate }) {
  const [action, setAction] = useState(true);

  function onSetAction() {
    setAction((action) => !action);
  }

  return (
    <div className="cart-container">
      <h2>Products List</h2>
      <div className="shopping-cart">
        {action === true ? (
          products.map((product) => (
            <Product
              product={product}
              location="shopping"
              onCartProductAdd={onCartProductAdd}
              key={product.id}
            />
          ))
        ) : (
          <CreateProduct
            onProductCreate={onProductCreate}
            onSetAction={onSetAction}
          />
        )}
      </div>

      <div className="center">
        <button
          className="create-new-product-button"
          onClick={() => setAction((action) => !action)}
        >
          {action === true ? (
            <span>Create new product</span>
          ) : (
            <span>Return to shopping</span>
          )}
        </button>
      </div>
    </div>
  );
}

function CreateProduct({ onProductCreate, onSetAction }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  function handleSubmit(e) {
    console.log("called");
    e.preventDefault();

    if (!price || !name) return;

    const newProduct = {
      id: crypto.randomUUID(),
      name,
      price: Number(price),
      image: image
        ? image
        : "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/1200px-Question_Mark.svg.png",
      quantity: 0,
    };

    onProductCreate(newProduct);
    onSetAction();

    setName("");
    setPrice("");
    setImage("");
  }

  return (
    <div>
      <h3>Add a product listing:</h3>
      <form className="create-product" onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button onClick={handleSubmit}>Create the new item</button>
      </form>
    </div>
  );
}

function Product({ product, location, onCartProductAdd, onCartProductRemove }) {
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <div>
        <h3>{product.name}</h3>
        <p>
          {(Math.round(product.price * 100) / 100).toFixed(2)}{" "}
          {location === "cart" && <span>x {product.quantity}</span>}
        </p>
      </div>
      <form className="btn" onSubmit={handleSubmit}>
        {location === "shopping" && (
          <div>
            <label>Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
            </select>
          </div>
        )}

        {location === "cart" && (
          <h3>
            {(Math.round(product.price * product.quantity * 100) / 100).toFixed(
              2
            )}
          </h3>
        )}

        {location === "shopping" ? (
          <button onClick={() => onCartProductAdd(product, quantity)}>
            Add to card
          </button>
        ) : (
          <button onClick={() => onCartProductRemove(product)}>Remove</button>
        )}
      </form>
    </div>
  );
}

function ShoppingCart({ inCartProducts, onCartProductRemove }) {
  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      <div className="shopping-cart">
        {inCartProducts?.map((product) => (
          <Product
            product={product}
            location="cart"
            onCartProductRemove={onCartProductRemove}
            key={product.id}
          />
        ))}
      </div>
      <div className="center">
        <h2 className="total">
          Total:{" "}
          {(
            Math.round(
              inCartProducts.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ) * 100
            ) / 100
          ).toFixed(2)}
        </h2>
      </div>
    </div>
  );
}

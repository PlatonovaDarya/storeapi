const productsContainer = document.getElementById("products");
const loadMoreButton = document.getElementById("loadMore");
const addProductForm = document.getElementById("addProductForm");
const categorySelect = document.getElementById("category");

let currentPage = 1;
const productsPerPage = 6;

async function fetchProducts(page = 1, category = "") {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products?limit=${productsPerPage}&page=${page}`
    );
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error("Ошибка при получении товаров:", error);
    alert("Не удалось загрузить товары. Попробуйте позже.");
  }
}

function displayProducts(products) {
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <h3>${product.title}</h3>
            <p>Цена: $${product.price}</p>
            <p>${product.description}</p>
            <button onclick="deleteProduct(${product.id})">Удалить товар</button>
        `;
    productsContainer.appendChild(productCard);
  });
}

async function deleteProduct(id) {
  try {
    await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });
    alert("Товар успешно удален.");
    productsContainer.innerHTML = "";
    fetchProducts(currentPage);
  } catch (error) {
    console.error("Ошибка при удалении товара:", error);
    alert("Не удалось удалить товар. Попробуйте позже.");
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(
      "https://fakestoreapi.com/products/categories"
    );
    const categories = await response.json();
    populateCategorySelect(categories);
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    alert("Не удалось загрузить категории. Попробуйте позже.");
  }
}

function populateCategorySelect(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

categorySelect.addEventListener("change", (event) => {
  const selectedCategory = event.target.value;
  productsContainer.innerHTML = "";
  currentPage = 1;
  fetchProducts(currentPage, selectedCategory);
});

loadMoreButton.addEventListener("click", () => {
  currentPage++;
  fetchProducts(currentPage);
});

addProductForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const category = document.getElementById("categoryInput").value;

  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        price,
        description,
        category,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при добавлении товара");
    }

    const newProduct = await response.json();
    alert("Товар успешно добавлен.");
    productsContainer.innerHTML = "";
    fetchProducts(currentPage);
  } catch (error) {
    console.error("Ошибка при добавлении товара:", error);
    alert("Не удалось добавить товар. Попробуйте позже.");
  }
});

fetchProducts(currentPage);
fetchCategories();

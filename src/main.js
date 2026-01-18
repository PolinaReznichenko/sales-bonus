/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции (данные о продаже конкретного товара)
  const discount = 1 - purchase.discount / 100;
  const sale_price = purchase.sale_price;
  const quantity = purchase.quantity;
  return sale_price * quantity * discount;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  // @TODO: Расчет бонуса от позиции в рейтинге
  const profit = seller.profit;
  let bonusPerc;
  if (index === 0) {
    bonusPerc = 0.15;
  } else if (index === 1 || index === 2) {
    bonusPerc = 0.1;
  } else if (index === total - 1) {
    bonusPerc = 0;
  } else {
    bonusPerc = 0.05;
  }
  return profit * bonusPerc;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // @TODO: Проверка входных данных
  if (!data
    || !Array.isArray(data.sellers)
    || !Array.isArray(data.products)
    || !Array.isArray(data.purchase_records)
    || data.products.length === 0
    || data.sellers.length === 0
    || data.purchase_records.length === 0
  ) {
    throw new Error("Некорректные входные данные");
  }

  // @TODO: Проверка наличия опций
  // Проверка, что опции — это объект
  if (typeof options !== "object") {
    throw new Error("options не является объектом");
  }
  // Деструктуризация опций
  const { calculateRevenue, calculateBonus } = options;
  // Проверка, что calculateRevenue и calculateBonus — это функции
  if (
    typeof calculateRevenue !== "function" ||
    typeof calculateBonus !== "function"
  ) {
    throw new Error("Переменная объекта options не является функцией");
  }
  // Проверка, что calculateRevenue и calculateBonus определены
  if (!calculateRevenue || !calculateBonus) {
    throw new Error("Функция не определена");
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики
  const sellerStats = data.sellers.map((seller) => ({
    id: seller.id,
    name: `${seller.first_name} ${seller.last_name}`,
    revenue: 0,
    profit: 0,
    sales_count: 0,
    products_sold: {}
  }));

  // @TODO: Индексация продавцов и товаров для быстрого доступа
  const sellerIndex = Object.fromEntries(sellerStats.map((sellerStat) => [sellerStat.id, sellerStat]));
  const productIndex = data.products.reduce((result, product) => ({
      ...result,
      [product.sku]: product
    }), {});

  // @TODO: Расчет выручки и прибыли для каждого продавца
  // Расчёт выручки от всех продаж
  data.purchase_records.forEach((record) => {
    const seller = sellerIndex[record.seller_id]; // Продавец
    // Увеличение количества продаж
    seller.sales_count++;
    // Увеличение общей суммы выручки всех продаж
    seller.revenue += record.total_amount - record.total_discount;
    // Расчёт прибыли для каждого товара
    record.items.forEach((item) => {
      const product = productIndex[item.sku]; // Товар
      // Вычисление себестоимости (cost) товара
      const cost = product.purchase_price * item.quantity;
      // Вычисление выручки от продажи товара с учётом скидки
      const revenue = calculateRevenue(item, product);
      // Подсчет прибыли
      const profit = revenue - cost;
      // Увеличение общей накопленной прибыли у продавца
      seller.profit += profit;
      // Учёт количества проданных товаров
      if (!seller.products_sold[item.sku]) {
        seller.products_sold[item.sku] = 0;
      }
      // По артикулу товара увеличение его проданного количества у продавца
      seller.products_sold[item.sku] += item.quantity;
    });
  });

  // @TODO: Сортировка продавцов по прибыли
  sellerStats.sort((a, b) => b.profit - a.profit);

  // @TODO: Назначение премий на основе ранжирования
  sellerStats.forEach((seller, index) => {
    // Считаем бонус
    seller.bonus = calculateBonus(index, sellerStats.length, seller);
    // Формируем топ-10 товаров
    seller.top_products = seller.products_sold;
    seller.top_products = Object.entries(seller.products_sold) // Преобразование объекта в массив массивов
    .map(([sku, quantity]) => ({sku, quantity})) // Преобразование массива массивов в массив объектов
    .sort((a, b) => b.quantity - a.quantity) // Сортировка по убыванию количества товаров
    .slice(0, 10); // Отделение от массива первых 10 элементов
    delete seller.products_sold;
  });

  // @TODO: Подготовка итоговой коллекции с нужными полями
  return sellerStats.map((seller) => ({
    seller_id: seller.id, // Строка, идентификатор продавца
    name: seller.name, // Строка, имя продавца
    revenue: +seller.revenue.toFixed(2), // Число с двумя знаками после точки, выручка продавца
    profit: +seller.profit.toFixed(2), // Число с двумя знаками после точки, прибыль продавца
    sales_count: seller.sales_count, // Целое число, количество продаж продавца
    top_products: seller.top_products, // Массив объектов, топ-10 товаров продавца
    bonus: +seller.bonus.toFixed(2), // Число с двумя знаками после точки, бонус продавца
  }));
}

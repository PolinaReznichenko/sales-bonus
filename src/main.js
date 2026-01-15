/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
   // @TODO: Расчет выручки от операции
   const { discount, sale_price, quantity } = purchase;
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
    const { profit } = seller;
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
        || data.customers.length === 0
        || data.products.length === 0
        || data.sellers.length === 0
        || data.purchase_records.length === 0
    ) {
        throw new Error('Некорректные входные данные');
    };

    // @TODO: Проверка наличия опций
    typeof options === 'object';
    const { calculateRevenue, calculateBonus } = options;
    if (!calculateRevenue || !calculateBonus) {
        throw new Error('Переменная не определена');
    };
    typeof calculateRevenue === 'function';
    typeof calculateBonus === "function";


    // @TODO: Подготовка промежуточных данных для сбора статистики
    const sellerStats = data.sellers.map(seller => ({
        id: seller.id,
        name: `${seller.first_name} ${seller.last_name}`,
        revenue: 0,
        profit: 0,
        sales_count: 0,
        products_sold: {}
    }));
    console.log(sellerStats)

    //Накапливаем количество всех проданных товаров(но не по каждому продавцу)
    const products_sold = {};
    data.purchase_records.forEach(record => {
        record.items.forEach(item => {
        const sku = item.sku;
        const quantity = item.quantity;
        if (products_sold[sku]) {
            products_sold[sku] += quantity;
        } else {
            products_sold[sku] = quantity;
        }
    });
    });
    console.log(products_sold)

    // @TODO: Индексация продавцов и товаров для быстрого доступа
    const sellerIndex = Object.fromEntries(data.sellers.map((seller, index) => [seller.id, sellerStats[index]]));
    console.log(sellerIndex);

    const productIndex = data.products.reduce((result, product) => ({
        ...result,
        [product.sku]: product
    }), {});
    console.log(productIndex);

    // @TODO: Расчет выручки и прибыли для каждого продавца


    // @TODO: Сортировка продавцов по прибыли


    // @TODO: Назначение премий на основе ранжирования


    // @TODO: Подготовка итоговой коллекции с нужными полями

}

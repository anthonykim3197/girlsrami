(() => {
  const columns = ['결제일', '주문번호', '상품주문번호', '상품명', '수량', '상품결제금액'];

  function parseRows(csv) {
    const source = csv.replace(/^\uFEFF/, '').trimEnd();
    const field = /(?:"((?:[^"]|"")*)"|([^",\r\n]*))(,|\r\n|\n|$)/y;
    const rows = [];
    let row = [];
    while (field.lastIndex < source.length) {
      const match = field.exec(source);
      if (!match) throw new Error('CSV의 따옴표 또는 줄바꿈을 확인해 주세요.');
      row.push(match[1]?.replace(/""/g, '"') ?? match[2]);
      if (match[3] !== ',') {
        rows.push(row);
        row = [];
      }
    }
    if (row.length) rows.push([...row, '']);
    return rows;
  }

  function summarize(csv) {
    const [header, ...rows] = parseRows(csv);
    if (!header || header.length !== columns.length ||
        !columns.every((column, index) => header[index].trim() === column)) {
      throw new Error('CSV 첫 행의 열 이름과 순서를 확인해 주세요.');
    }
    const orders = new Set();
    const items = new Set();
    const products = new Map();
    const daily = new Map();
    let quantity = 0;
    let amount = 0;
    for (const [index, row] of rows.entries()) {
      const [date, order, item, product, units, payment] = row.map(value => value.trim());
      const parsedDate = new Date(date);
      const count = Number(units);
      const paid = Number(payment);
      if (row.length !== columns.length || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
          !Number.isFinite(+parsedDate) || parsedDate.toISOString().slice(0, 10) !== date ||
          !order || !item || !product || !/^\d+$/.test(units) || !/^\d+$/.test(payment) ||
          !Number.isSafeInteger(count + quantity) || count < 1 || !Number.isSafeInteger(paid + amount)) {
        throw new Error(`${index + 2}번째 행의 날짜, 필수 값 또는 숫자 형식을 확인해 주세요.`);
      }
      if (items.has(item)) throw new Error(`${index + 2}번째 행에 상품주문번호가 중복됩니다.`);
      items.add(item);
      orders.add(order);
      quantity += count;
      amount += paid;

      const sales = products.get(product) ?? { quantity: 0, amount: 0 };
      sales.quantity += count;
      sales.amount += paid;
      products.set(product, sales);
      const day = daily.get(date) ?? { orders: new Set(), quantity: 0, amount: 0 };
      day.orders.add(order);
      day.quantity += count;
      day.amount += paid;
      daily.set(date, day);
    }
    return {
      orders: orders.size, quantity, amount,
      products: [...products].sort((a, b) => b[1].quantity - a[1].quantity),
      daily: [...daily].sort(([a], [b]) => a.localeCompare(b)).map(([date, day]) =>
        [date, { ...day, orders: day.orders.size }])
    };
  }

  globalThis.GRSales = { summarize };
})();

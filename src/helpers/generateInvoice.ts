const generateInvoice = () => {
  const invoiceData = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV${invoiceData}-${randomSuffix}`;
};

export default generateInvoice;

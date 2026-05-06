const fs = require('fs');
const files = {
  'src/i18n/en.json': {
    "add_new_product": "Add New Product",
    "edit_product": "Edit Product",
    "product_name": "Product Name",
    "description": "Description",
    "price": "Price",
    "category": "Category",
    "region": "Region",
    "stock_quantity": "Stock Quantity",
    "upload_image": "Upload Product Image",
    "save": "Save",
    "cancel": "Cancel",
    "delete_confirm_msg": "Are you sure you want to remove this product?",
    "listed_products": "Your Listed Products",
    "listing_subtitle": "Manage your authentic crafts"
  },
  'src/i18n/ar.json': {
    "add_new_product": "إضافة منتج جديد",
    "edit_product": "تعديل المنتج",
    "product_name": "اسم المنتج",
    "description": "الوصف",
    "price": "السعر",
    "category": "الفئة",
    "region": "المنطقة",
    "stock_quantity": "كمية المخزون",
    "upload_image": "تحميل صورة المنتج",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete_confirm_msg": "هل أنت متأكد أنك تريد إزالة هذا المنتج؟",
    "listed_products": "منتجاتك المدرجة",
    "listing_subtitle": "إدارة حرفك الأصيلة"
  },
  'src/i18n/fr.json': {
    "add_new_product": "Ajouter un nouveau produit",
    "edit_product": "Modifier le produit",
    "product_name": "Nom du produit",
    "description": "Description",
    "price": "Prix",
    "category": "Catégorie",
    "region": "Région",
    "stock_quantity": "Quantité en stock",
    "upload_image": "Télécharger l'image du produit",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete_confirm_msg": "Êtes-vous sûr de vouloir supprimer ce produit?",
    "listed_products": "Vos produits listés",
    "listing_subtitle": "Gérez vos métiers authentiques"
  }
};

for (const [file, newData] of Object.entries(files)) {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(content, newData);
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}
console.log("Updated translation files for Product CRUD");

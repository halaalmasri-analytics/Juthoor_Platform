const fs = require('fs');
const files = {
  'src/i18n/en.json': {
    "heritage_certified": "Heritage Certified ✓",
    "pending_review": "Pending Review",
    "verification_explanation": "This product has been verified by Juthoor AI as an authentic Palestinian handmade craft. The artisan's identity, location, and crafting method have been reviewed and approved.",
    "profile_under_review": "Your profile is under review. You will be notified once verified.",
    "verification_requests": "Verification Requests",
    "artisan_name": "Artisan Name",
    "craft_type": "Craft Type",
    "approve": "Approve",
    "reject": "Reject"
  },
  'src/i18n/ar.json': {
    "heritage_certified": "تراث معتمد ✓",
    "pending_review": "قيد المراجعة",
    "verification_explanation": "تم التحقق من هذا المنتج بواسطة ذكاء جذور الاصطناعي كحرفة يدوية فلسطينية أصيلة. تمت مراجعة هوية الحرفي وموقعه وطريقة صناعته والموافقة عليها.",
    "profile_under_review": "ملفك الشخصي قيد المراجعة. سيتم إعلامك بمجرد التحقق منه.",
    "verification_requests": "طلبات التحقق",
    "artisan_name": "اسم الحرفي",
    "craft_type": "نوع الحرفة",
    "approve": "موافقة",
    "reject": "رفض"
  },
  'src/i18n/fr.json': {
    "heritage_certified": "Patrimoine Certifié ✓",
    "pending_review": "En Attente",
    "verification_explanation": "Ce produit a été vérifié par l'IA Juthoor comme un artisanat palestinien authentique. L'identité de l'artisan, son emplacement et sa méthode de fabrication ont été examinés et approuvés.",
    "profile_under_review": "Votre profil est en cours d'examen. Vous serez informé une fois vérifié.",
    "verification_requests": "Demandes de Vérification",
    "artisan_name": "Nom de l'Artisan",
    "craft_type": "Type d'Artisanat",
    "approve": "Approuver",
    "reject": "Rejeter"
  }
};

for (const [file, newData] of Object.entries(files)) {
  const content = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(content, newData);
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
}
console.log("Updated translation files");

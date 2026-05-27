export const categories = [
  {
    name: "КРУАСАНИ СЕНДВІЧІ",
  },
  {
    name: "СОЛОДКІ КРУАСАНИ",
  },
  {
    name: "НАПОЇ",
  },
];

export const ingredients = [
  {
    name: "Круасан масляний",
    price: 120,
    imageUrl:
      "https://i.pinimg.com/736x/0f/0f/29/0f0f29ce2bc99e443d91f4c88a420617.jpg",
  },
  {
    name: "Xамон",
    price: 50,
    imageUrl:
      "https://i.pinimg.com/1200x/7b/51/b3/7b51b3600dde02cbf0590ba84c920fe5.jpg",
  },
  {
    name: "Сир Моцарела",
    price: 40,
    imageUrl:
      "https://i.pinimg.com/1200x/e4/d4/e0/e4d4e0b5475a1c2329dd35226dd428bc.jpg",
  },
  {
    name: "Рукола",
    price: 35,
    imageUrl:
      "https://i.pinimg.com/736x/f8/95/5a/f8955ab64a18bf7f8bd8c9e8442baa21.jpg",
  },
  {
    name: "Перець болгарський",
    price: 20,
    imageUrl:
      "https://i.pinimg.com/736x/8a/c3/98/8ac39854595f26765413ef1ee22e668f.jpg",
  },
  {
    name: "Курятина grilled chicken",
    price: 40,
    imageUrl:
      "https://i.pinimg.com/736x/42/4f/01/424f01fea8dbd178c17504386332b098.jpg",
  },
  {
    name: "Салат Айсберг",
    price: 40,
    imageUrl:
      "https://i.pinimg.com/736x/b7/52/0d/b7520de93df87d82badea23995270600.jpg",
  },
  {
    name: "Огірок",
    price: 20,
    imageUrl:
      "https://i.pinimg.com/736x/72/16/13/721613679596f7b5bb700a391f026dad.jpg",
  },
  {
    name: "Сир Філадельфія",
    price: 30,
    imageUrl:
      "https://i.pinimg.com/1200x/93/20/e5/9320e5f3d377f66a833df5a605c35929.jpg",
  },
].map((obj, index) => ({ id: index + 1, ...obj }));

export const products = [
  {
    name: "З хамоном, моцарелою та в’яленими томатами",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2025/07/z-hamonom-moczareloyu-ta-vyalenymy-tomatamy.png",
    categoryId: 1,
  },
  {
    name: "З лососем та каперсами",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/z-lososem-ta-kapersamy.webp",
    categoryId: 1,
  },
  {
    name: "З креветкою по-азійськи",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_novynky_kiosk_1080x720_kruasan-krevetka-po-azijskyj.webp",
    categoryId: 1,
  },
  {
    name: "Гірос з яловичиною",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/giros-z-yalovychynoyu.webp",
    categoryId: 1,
  },
  {
    name: "Чізбургер",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/chyzburger-sous-gostr.webp",
    categoryId: 1,
  },
  {
    name: "Дабл Чізбургер",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/dabl-chyzburger-sous-burger.webp",
    categoryId: 1,
  },
  {
    name: "Курка Теріякі",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/kurka-teriyaki.webp",
    categoryId: 1,
  },
  {
    name: "Галицький",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/galyczkyj.webp",
    categoryId: 1,
  },
  {
    name: "Філадельфія з лососем",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/filadelfiya-z-lososem.webp",
    categoryId: 1,
  },
  {
    name: "Філадельфія з шинкою",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/filadelfiya-z-shynkoyu.webp",
    categoryId: 1,
  },
  {
    name: "Дубайський шоколад",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/kruasan-dubajskyj-shokolad.webp",
    categoryId: 2,
  },
  {
    name: "З кремом маскарпоне та лохиною",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/z-maskarpone-ta-lohynoyu.webp",
    categoryId: 2,
  },
  {
    name: "Фісташковий",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/fistashkovyj.webp",
    categoryId: 2,
  },
  {
    name: "З шоколадом та бананом",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/z-shokoladom-ta-bananom.webp",
    categoryId: 2,
  },
  {
    name: "Малинова насолода",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/malynova-nasoloda.webp",
    categoryId: 2,
  },
  {
    name: "П’яна вишня",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/pyana-vyshnya.webp",
    categoryId: 2,
  },
  {
    name: "Айс ПінкШейк",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_pozycziyi-napoyi_sajt_840h450_0037_mholodnyj_pinkshejk.webp",
    categoryId: 3,
  },
  {
    name: "Айс Лате",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_pozycziyi-napoyi_sajt_840h450_0013_ice-latte-z-topingom.webp",
    categoryId: 3,
  },
  {
    name: "Мохіто лохина-лаванда",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_pozycziyi-napoyi_sajt_840h450_0023_mohito_lavanda.webp",
    categoryId: 3,
  },
  {
    name: "Лавандова Матча",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_pozycziyi-napoyi_sajt_840h450_0037_matcha_lavanda.webp",
    categoryId: 3,
  },
  {
    name: "Полунична Матча",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/04/lc_ua_pozycziyi-napoyi_sajt_840h450_0037_matcha_polunyczya.webp",
    categoryId: 3,
  },
  {
    name: "Капучино L",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/kapuchyno-l.webp",
    categoryId: 3,
  },
  {
    name: "Капучино XL",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/kapuchyno-l.webp",
    categoryId: 3,
  },
  {
    name: "Лате L",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/late-l.webp",
    categoryId: 3,
  },
  {
    name: "Лате XL",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/late-l.webp",
    categoryId: 3,
  },
  {
    name: "Американо",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/amerykano.webp",
    categoryId: 3,
  },
  {
    name: "Еспресо",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/espreso.webp",
    categoryId: 3,
  },
  {
    name: "Чай вітамінний “Ягоди годжі з лимоном”",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/chaj-vitaminnyj-yagody-godzhi-z-lymonom.webp",
    categoryId: 3,
  },
  {
    name: "Чай “Зелений високогірний”",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/chaj-zelenyj-vysokogirnyj.webp",
    categoryId: 3,
  },
  {
    name: "Чай “Королівський десерт”",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/chaj-korolivskyj-desert.webp",
    categoryId: 3,
  },
  {
    name: "Чай “Сер Чарльз Грей”",
    imageUrl:
      "https://lvivcroissants.com/ua/wp-content/uploads/sites/3/2026/03/chaj-ser-charlz-grej.webp",
    categoryId: 3,
  },
];

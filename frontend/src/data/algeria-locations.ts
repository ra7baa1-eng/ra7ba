export interface Wilaya {
  id: number;
  name: string;
  nameAr: string;
  communes: Commune[];
}

export interface Commune {
  id: number;
  name: string;
  nameAr: string;
  postalCode: string;
}

export const ALGERIA_LOCATIONS: Wilaya[] = [
  {
    id: 1,
    name: "Adrar",
    nameAr: "أدرار",
    communes: [
      { id: 1, name: "Adrar", nameAr: "أدرار", postalCode: "01000" },
      { id: 2, name: "Tamest", nameAr: "تامست", postalCode: "01001" },
      { id: 3, name: "Charouine", nameAr: "شاروين", postalCode: "01002" },
    ]
  },
  {
    id: 2,
    name: "Chlef",
    nameAr: "الشلف",
    communes: [
      { id: 1, name: "Chlef", nameAr: "الشلف", postalCode: "02000" },
      { id: 2, name: "Tenes", nameAr: "تنس", postalCode: "02001" },
      { id: 3, name: "Benairia", nameAr: "بن عايرية", postalCode: "02002" },
    ]
  },
  {
    id: 16,
    name: "Algiers",
    nameAr: "الجزائر",
    communes: [
      { id: 1, name: "Sidi M'Hamed", nameAr: "سيدي امحمد", postalCode: "16000" },
      { id: 2, name: "El Madania", nameAr: "المدنية", postalCode: "16001" },
      { id: 3, name: "Hussen Dey", nameAr: "حسين داي", postalCode: "16002" },
      { id: 4, name: "Kouba", nameAr: "القبة", postalCode: "16003" },
      { id: 5, name: "Bourouba", nameAr: "بوروبة", postalCode: "16004" },
      { id: 6, name: "Casbah", nameAr: "القصبة", postalCode: "16005" },
    ]
  },
  {
    id: 31,
    name: "Oran",
    nameAr: "وهران",
    communes: [
      { id: 1, name: "Oran", nameAr: "وهران", postalCode: "31000" },
      { id: 2, name: "Gdyel", nameAr: "قديل", postalCode: "31001" },
      { id: 3, name: "Bir El Djir", nameAr: "بئر الجير", postalCode: "31002" },
      { id: 4, name: "Hassi Bounif", nameAr: "حاسي بونيف", postalCode: "31003" },
    ]
  },
  {
    id: 25,
    name: "Constantine",
    nameAr: "قسنطينة",
    communes: [
      { id: 1, name: "Constantine", nameAr: "قسنطينة", postalCode: "25000" },
      { id: 2, name: "Hamma Bouziane", nameAr: "حامة بوزيان", postalCode: "25001" },
      { id: 3, name: "Didouche Mourad", nameAr: "ديدوش مراد", postalCode: "25002" },
    ]
  },
  {
    id: 23,
    name: "Annaba",
    nameAr: "عنابة",
    communes: [
      { id: 1, name: "Annaba", nameAr: "عنابة", postalCode: "23000" },
      { id: 2, name: "El Hadjar", nameAr: "الحجار", postalCode: "23001" },
      { id: 3, name: "Sidi Amar", nameAr: "سيدي عمار", postalCode: "23002" },
    ]
  },
  {
    id: 9,
    name: "Blida",
    nameAr: "البليدة",
    communes: [
      { id: 1, name: "Blida", nameAr: "البليدة", postalCode: "09000" },
      { id: 2, name: "Boufarik", nameAr: "بوفاريك", postalCode: "09001" },
      { id: 3, name: "Larbaa", nameAr: "الأربعاء", postalCode: "09002" },
    ]
  },
  {
    id: 10,
    name: "Bouira",
    nameAr: "البويرة",
    communes: [
      { id: 1, name: "Bouira", nameAr: "البويرة", postalCode: "10000" },
      { id: 2, name: "Lakhdaria", nameAr: "الأخضرية", postalCode: "10001" },
      { id: 3, name: "M'Chedallah", nameAr: "مشد الله", postalCode: "10002" },
    ]
  }
];

export const getWilayaById = (id: number): Wilaya | undefined => {
  return ALGERIA_LOCATIONS.find(w => w.id === id);
};

export const getCommunesByWilaya = (wilayaId: number): Commune[] => {
  const wilaya = getWilayaById(wilayaId);
  return wilaya ? wilaya.communes : [];
};

export const searchWilayas = (query: string): Wilaya[] => {
  const lowerQuery = query.toLowerCase();
  return ALGERIA_LOCATIONS.filter(w => 
    w.name.toLowerCase().includes(lowerQuery) || 
    w.nameAr.includes(query)
  );
};

// Custom commodity group mappings for grocery products
export const commodityGroups = {
	// BAGERI (300-399)
	bröd: '310',
	mjukbröd: '315',
	'hårt bröd': '320',
	knäckebröd: '320',
	fralla: '330',
	frallor: '330',
	bulle: '340',
	bullar: '340',
	fikabröd: '345',
	kaka: '350',
	kakor: '350',
	'bröd övrigt': '399',

	// FRUKT & GRÖNT (400-499)
	apelsin: '402',
	clementin: '403',
	mandarin: '403',
	satsuma: '403',
	småcitrus: '403',
	citron: '404',
	lime: '405',
	banan: '410',
	äpple: '420',
	päron: '430',
	tomat: '445',
	gurka: '450',
	paprika: '443',
	sallad: '460',
	isbergssallad: '460',
	färdigskuret: '470',
	potatis: '480',
	lök: '490',
	'fog övrigt': '499',

	// MEJERI (500-599)
	mjölk: '510',
	mellanmjölk: '510',
	lättmjölk: '510',
	minimjölk: '510',
	filmjölk: '520',
	yoghurt: '530',
	kvarg: '540',
	grädde: '502',
	'crème fraiche': '503',
	gräddfil: '504',
	'mejeri övrigt': '599',

	// OST (600-699)
	ost: '610',
	hårdost: '610',
	präst: '610',
	herrgård: '610',
	grevé: '610',
	mjukost: '620',
	färskost: '630',
	dessertost: '640',
	mögelost: '650',
	'ost övrigt': '699',

	// KÖTT (700-799)
	färs: '710',
	köttfärs: '720',
	nötfärs: '720',
	nötkött: '730',
	fläskkött: '740',
	fläskfärs: '740',
	fläsk: '740',
	kyckling: '750',
	kycklingfilé: '750',
	kycklinglår: '750',
	'kött övrigt': '799',

	// FISK (800-899)
	lax: '810',
	'gravad lax': '810',
	torsk: '820',
	räka: '830',
	räkor: '830',
	handskalade: '830',
	sill: '840',
	fiskröra: '850',
	fiskröror: '850',
	'fisk övrigt': '899',
};

// Get commodity group code for a product
// Matches product name against known categories
export function getCommodityGroup(productName, category) {
	if (!productName) {
		return '999';
	}

	const lowerName = productName.toLowerCase();

	// Try to find exact match in product name
	// Sort by keyword length (longest first) for better matching
	const sortedEntries = Object.entries(commodityGroups).sort(
		(a, b) => b[0].length - a[0].length
	);

	for (const [keyword, code] of sortedEntries) {
		if (lowerName.includes(keyword.toLowerCase())) {
			console.log(`✅ Matched "${productName}" → ${keyword} (${code})`);
			return code;
		}
	}

	// Fallback: use category-based default
	const categoryDefaults = {
		Bageri: '310',
		Frukt: '410',
		Grönsaker: '460',
		Mejeri: '510',
		Mejeriprodukter: '510',
		Ost: '610',
		Kött: '720',
		Fisk: '810',
		Charkuterier: '750',
		Diverse: '999',
	};

	const fallbackCode = categoryDefaults[category] || '999';
	console.log(
		`⚠️  No match for "${productName}" (${category}) → fallback ${fallbackCode}`
	);
	return fallbackCode;
}

// Get commodity group name from code
export function getCommodityGroupName(code) {
	const groupNames = {
		// BAGERI (300-399)
		310: 'Bröd',
		315: 'Mjukbröd',
		320: 'Hårt bröd',
		330: 'Frallor',
		340: 'Bullar',
		345: 'Fikabröd',
		350: 'Kakor',
		399: 'Bröd övrigt',

		// FRUKT & GRÖNT (400-499)
		402: 'Apelsiner',
		403: 'Småcitrus',
		404: 'Citroner',
		405: 'Lime',
		410: 'Bananer',
		420: 'Äpplen',
		430: 'Päron',
		443: 'Paprikor',
		445: 'Tomater',
		450: 'Gurkor',
		460: 'Sallad',
		470: 'Färdigskuret',
		480: 'Potatis',
		490: 'Lök',
		499: 'FoG övrigt',

		// MEJERI (500-599)
		510: 'Mjölk',
		520: 'Filmjölk',
		530: 'Yoghurt',
		540: 'Kvarg',
		502: 'Grädde',
		503: 'Crème fraiche',
		504: 'Gräddfil',
		599: 'Mejeri övrigt',

		// OST (600-699)
		610: 'Hårdost',
		620: 'Mjukost',
		630: 'Färskost',
		640: 'Dessertost',
		650: 'Mögelost',
		699: 'Ost övrigt',

		// KÖTT (700-799)
		710: 'Färs (blandfärs)',
		720: 'Nötkött/Nötfärs',
		730: 'Nötkött',
		740: 'Fläskkött/Fläskfärs',
		750: 'Kyckling',
		799: 'Kött övrigt',

		// FISK (800-899)
		810: 'Lax',
		820: 'Torsk',
		830: 'Räkor',
		840: 'Sill',
		850: 'Fiskröror',
		899: 'Fisk övrigt',

		999: 'Övrigt',
	};

	return groupNames[code] || 'Okänd varugrupp';
}

// Get category from commodity group code
export function getCategoryFromCode(code) {
	const codeNum = parseInt(code);

	if (codeNum >= 300 && codeNum < 400) return 'Bageri';
	if (codeNum >= 400 && codeNum < 500) return 'Frukt & Grönt';
	if (codeNum >= 500 && codeNum < 600) return 'Mejeri';
	if (codeNum >= 600 && codeNum < 700) return 'Ost';
	if (codeNum >= 700 && codeNum < 800) return 'Kött';
	if (codeNum >= 800 && codeNum < 900) return 'Fisk';

	return 'Övrigt';
}

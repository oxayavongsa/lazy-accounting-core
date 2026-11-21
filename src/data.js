// Data used by Lazy Accounting (lazyaccounting.com). Sources: IRS Schedule C (Form 1040), IRS standard mileage rates,
// Treasury list of occupations that customarily and regularly received tips (TTOC codes, 2025 OBBBA).

/** Schedule C line numbers and labels. */
export const SCHEDULE_C_LINES = {
  "1": "Gross receipts",
  "2": "Returns and allowances",
  "4": "Cost of goods sold",
  "6": "Other income",
  "8": "Advertising",
  "9": "Car and truck expenses",
  "10": "Commissions and fees",
  "11": "Contract labor",
  "13": "Depreciation and Sec. 179",
  "15": "Insurance (other than health)",
  "17": "Legal and professional services",
  "18": "Office expense",
  "21": "Repairs and maintenance",
  "22": "Supplies",
  "23": "Taxes and licenses",
  "25": "Utilities",
  "26": "Wages",
  "16b": "Interest (other)",
  "20a": "Rent on vehicles, machinery and equipment",
  "20b": "Rent on other business property",
  "24a": "Travel",
  "24b": "Deductible meals",
  "27a": "Other expenses"
};

/** Base categories: [name, type, Schedule C line]. type is income | expense | equity | transfer | none. */
export const BASE_CATEGORIES = [
  [
    "Refunds to clients",
    "income",
    "2"
  ],
  [
    "Other income",
    "income",
    "6"
  ],
  [
    "Advertising",
    "expense",
    "8"
  ],
  [
    "Car & truck (actual costs)",
    "expense",
    "9"
  ],
  [
    "Commissions & fees",
    "expense",
    "10"
  ],
  [
    "Contract labor",
    "expense",
    "11"
  ],
  [
    "Equipment",
    "expense",
    "13"
  ],
  [
    "Insurance",
    "expense",
    "15"
  ],
  [
    "Legal & professional",
    "expense",
    "17"
  ],
  [
    "Office expense",
    "expense",
    "18"
  ],
  [
    "Postage & shipping",
    "expense",
    "18"
  ],
  [
    "Rent",
    "expense",
    "20b"
  ],
  [
    "Repairs & maintenance",
    "expense",
    "21"
  ],
  [
    "Supplies",
    "expense",
    "22"
  ],
  [
    "Taxes & licenses",
    "expense",
    "23"
  ],
  [
    "Travel",
    "expense",
    "24a"
  ],
  [
    "Meals (50%)",
    "expense",
    "24b"
  ],
  [
    "Utilities & phone",
    "expense",
    "25"
  ],
  [
    "Wages",
    "expense",
    "26"
  ],
  [
    "Software & subscriptions",
    "expense",
    "27a"
  ],
  [
    "Bank & merchant fees",
    "expense",
    "27a"
  ],
  [
    "Education & dues",
    "expense",
    "27a"
  ],
  [
    "Owner contribution",
    "equity",
    null
  ],
  [
    "Owner draw",
    "equity",
    null
  ],
  [
    "Tax payment (personal)",
    "equity",
    null
  ],
  [
    "Transfer between accounts",
    "transfer",
    null
  ],
  [
    "Uncategorized",
    "none",
    null
  ]
];

/** Industry charts of accounts: income categories, extra expense categories [name, line], and vendor keyword rules. */
export const INDUSTRIES = {
  "notary": {
    "name": "Notary & loan signing",
    "desc": "Notarizations, loan signings, apostille, fingerprinting",
    "inc": [
      "Notary fees",
      "Loan signing fees",
      "Apostille services",
      "Fingerprinting fees"
    ],
    "exp": [
      [
        "Stamps & journals",
        "22"
      ],
      [
        "Commission & bond fees",
        "23"
      ]
    ],
    "rules": [
      "SIGNING ORDER +=> Loan signing fees",
      "SNAPDOCS +=> Loan signing fees",
      "NATIONAL NOTARY => Education & dues",
      "NNA => Education & dues"
    ]
  },
  "beauty": {
    "name": "Beauty & salon",
    "desc": "Hair, nails, lashes, barbers, spa",
    "inc": [
      "Service income",
      "Retail product sales",
      "Tips"
    ],
    "exp": [
      [
        "Beauty supplies",
        "22"
      ],
      [
        "Booth or suite rent",
        "20b"
      ],
      [
        "Products for resale",
        "4"
      ],
      [
        "Board license & permits",
        "23"
      ]
    ],
    "rules": [
      "SALLY BEAUTY => Beauty supplies",
      "COSMOPROF => Beauty supplies",
      "VAGARO => Software & subscriptions",
      "GLOSSGENIUS => Software & subscriptions",
      "BOOKSY => Software & subscriptions"
    ]
  },
  "auto": {
    "name": "Auto repair & mobile mechanic",
    "desc": "Repairs, parts, diagnostics, towing",
    "inc": [
      "Labor",
      "Parts sales",
      "Diagnostic fees",
      "Service call fees"
    ],
    "exp": [
      [
        "Parts for resale",
        "4"
      ],
      [
        "Small tools",
        "22"
      ],
      [
        "Shop supplies",
        "22"
      ],
      [
        "Shop rent",
        "20b"
      ],
      [
        "Equipment rental",
        "20a"
      ]
    ],
    "rules": [
      "AUTOZONE => Parts for resale",
      "O'REILLY => Parts for resale",
      "OREILLY => Parts for resale",
      "ADVANCE AUTO => Parts for resale",
      "NAPA => Parts for resale",
      "HARBOR FREIGHT => Small tools",
      "SNAP-ON => Small tools"
    ]
  },
  "food": {
    "name": "Food, catering & home kitchen",
    "desc": "Meals, catering, food trucks, delivery apps",
    "inc": [
      "Food sales",
      "Catering",
      "Delivery app sales"
    ],
    "exp": [
      [
        "Food & ingredients",
        "4"
      ],
      [
        "Packaging & disposables",
        "22"
      ],
      [
        "Health permits",
        "23"
      ],
      [
        "Kitchen rent",
        "20b"
      ],
      [
        "Delivery app fees",
        "10"
      ]
    ],
    "rules": [
      "RESTAURANT DEPOT => Food & ingredients",
      "SMART FOODSERVICE => Food & ingredients",
      "WEBSTAURANT => Packaging & disposables",
      "DOORDASH +=> Delivery app sales",
      "UBER EATS +=> Delivery app sales",
      "GRUBHUB +=> Delivery app sales"
    ]
  },
  "freelance": {
    "name": "Freelance & consulting",
    "desc": "Consultants, designers, writers, developers",
    "inc": [
      "Consulting fees",
      "Project fees",
      "Retainers"
    ],
    "exp": [
      [
        "Coworking space",
        "20b"
      ],
      [
        "Platform fees",
        "10"
      ]
    ],
    "rules": [
      "UPWORK +=> Project fees",
      "FIVERR +=> Project fees",
      "WEWORK => Coworking space"
    ]
  },
  "cleaning": {
    "name": "Cleaning & home services",
    "desc": "Cleaning, landscaping, handyman, pest",
    "inc": [
      "Service income",
      "Move-out & deep cleans",
      "Tips"
    ],
    "exp": [
      [
        "Cleaning supplies",
        "22"
      ],
      [
        "Equipment rental",
        "20a"
      ]
    ],
    "rules": [
      "HOME DEPOT => Supplies",
      "LOWES => Supplies",
      "THUMBTACK => Advertising",
      "ANGI => Advertising"
    ]
  },
  "retail": {
    "name": "Retail & online store",
    "desc": "Products sold online or in person",
    "inc": [
      "Product sales",
      "Shipping charged to customers"
    ],
    "exp": [
      [
        "Inventory purchases",
        "4"
      ],
      [
        "Shipping supplies",
        "22"
      ],
      [
        "Marketplace fees",
        "10"
      ]
    ],
    "rules": [
      "SHOPIFY +=> Product sales",
      "ETSY +=> Product sales",
      "AMAZON MKTPLACE +=> Product sales",
      "EBAY +=> Product sales",
      "SHOPIFY => Software & subscriptions",
      "PIRATE SHIP => Postage & shipping",
      "ULINE => Shipping supplies"
    ]
  },
  "trades": {
    "name": "Construction & trades",
    "desc": "Contractors, electricians, plumbers",
    "inc": [
      "Contract revenue",
      "Change orders",
      "Service calls"
    ],
    "exp": [
      [
        "Job materials",
        "4"
      ],
      [
        "Subcontractors",
        "11"
      ],
      [
        "Equipment rental",
        "20a"
      ],
      [
        "Permits & licenses",
        "23"
      ],
      [
        "Small tools",
        "22"
      ]
    ],
    "rules": [
      "HOME DEPOT => Job materials",
      "LOWES => Job materials",
      "FERGUSON => Job materials",
      "SUNBELT => Equipment rental",
      "UNITED RENTALS => Equipment rental",
      "CSLB => Permits & licenses"
    ]
  },
  "transport": {
    "name": "Delivery, rideshare & trucking",
    "desc": "Gig drivers, couriers, owner-operators",
    "inc": [
      "Rideshare income",
      "Delivery income",
      "Freight income",
      "Tips"
    ],
    "exp": [
      [
        "Fuel",
        "9"
      ],
      [
        "Vehicle repairs",
        "21"
      ],
      [
        "Tolls & parking",
        "24a"
      ],
      [
        "Permits & IFTA",
        "23"
      ],
      [
        "Platform fees",
        "10"
      ]
    ],
    "rules": [
      "UBER +=> Rideshare income",
      "LYFT +=> Rideshare income",
      "DOORDASH +=> Delivery income",
      "INSTACART +=> Delivery income",
      "AMAZON FLEX +=> Delivery income",
      "SHELL => Fuel",
      "CHEVRON => Fuel",
      "ARCO => Fuel",
      "FASTRAK => Tolls & parking"
    ]
  },
  "realestate": {
    "name": "Real estate agent",
    "desc": "Agents, brokers, property managers",
    "inc": [
      "Commissions",
      "Referral fees",
      "Property management fees"
    ],
    "exp": [
      [
        "MLS & board dues",
        "27a"
      ],
      [
        "Signs & lockboxes",
        "22"
      ],
      [
        "Staging",
        "27a"
      ],
      [
        "Brokerage desk fees",
        "10"
      ]
    ],
    "rules": [
      "ZILLOW => Advertising",
      "REALTOR => Education & dues",
      "SENTRILOCK => Signs & lockboxes"
    ]
  },
  "wellness": {
    "name": "Health, fitness & wellness",
    "desc": "Trainers, therapists, massage, coaches",
    "inc": [
      "Session fees",
      "Packages & memberships",
      "Product sales"
    ],
    "exp": [
      [
        "Studio rent",
        "20b"
      ],
      [
        "Continuing education",
        "27a"
      ],
      [
        "Liability insurance",
        "15"
      ]
    ],
    "rules": [
      "MINDBODY => Software & subscriptions",
      "SIMPLEPRACTICE => Software & subscriptions"
    ]
  },
  "creative": {
    "name": "Photo, video & creative",
    "desc": "Photographers, videographers, artists",
    "inc": [
      "Session fees",
      "Print & product sales",
      "Licensing fees"
    ],
    "exp": [
      [
        "Camera & gear (small)",
        "22"
      ],
      [
        "Props & sets",
        "22"
      ],
      [
        "Studio rent",
        "20b"
      ],
      [
        "Gear rental",
        "20a"
      ]
    ],
    "rules": [
      "B&H PHOTO => Camera & gear (small)",
      "ADORAMA => Camera & gear (small)",
      "LENSRENTALS => Gear rental",
      "PIXIESET => Software & subscriptions"
    ]
  }
};

/** IRS business standard mileage rates in dollars per mile, by effective date. */
export const IRS_MILEAGE_RATES = [
  [
    "2025-01-01",
    0.7
  ],
  [
    "2026-01-01",
    0.725
  ],
  [
    "2026-07-01",
    0.76
  ]
];

/** Default vendor keyword rules ("KEYWORD => Category", "KEYWORD +=> Category" matches deposits only). */
export const DEFAULT_RULES = [
  "USPS => Postage & shipping",
  "UPS STORE => Postage & shipping",
  "FEDEX => Postage & shipping",
  "STAPLES => Office expense",
  "OFFICE DEPOT => Office expense",
  "ADOBE => Software & subscriptions",
  "GOOGLE *WORKSPACE => Software & subscriptions",
  "MICROSOFT => Software & subscriptions",
  "CANVA => Software & subscriptions",
  "ZOOM => Software & subscriptions",
  "INTUIT => Software & subscriptions",
  "SQUARESPACE => Software & subscriptions",
  "WIX => Software & subscriptions",
  "FACEBK => Advertising",
  "META ADS => Advertising",
  "GOOGLE ADS => Advertising",
  "YELP => Advertising",
  "VERIZON => Utilities & phone",
  "T-MOBILE => Utilities & phone",
  "AT&T => Utilities & phone",
  "COMCAST => Utilities & phone",
  "XFINITY => Utilities & phone",
  "IRS USATAXPYMT => Tax payment (personal)",
  "FRANCHISE TAX => Tax payment (personal)",
  "SECRETARY OF STATE => Taxes & licenses",
  "MONTHLY MAINTENANCE FEE => Bank & merchant fees",
  "SERVICE CHARGE => Bank & merchant fees"
];

/** Treasury Tipped Occupation Codes (W-2 box 14b). */
export const TTOC_CODES = [
  [
    "101",
    "Bartenders"
  ],
  [
    "102",
    "Wait staff"
  ],
  [
    "103",
    "Food servers, nonrestaurant"
  ],
  [
    "104",
    "Dining room/cafeteria attendants, bartender helpers"
  ],
  [
    "105",
    "Chefs and cooks"
  ],
  [
    "106",
    "Food preparation workers"
  ],
  [
    "107",
    "Fast food and counter workers"
  ],
  [
    "108",
    "Dishwashers"
  ],
  [
    "109",
    "Host staff (restaurant, lounge, coffee shop)"
  ],
  [
    "110",
    "Bakers"
  ],
  [
    "201",
    "Gambling dealers"
  ],
  [
    "202",
    "Gambling change persons and booth cashiers"
  ],
  [
    "203",
    "Gambling cage workers"
  ],
  [
    "204",
    "Gambling and sports book writers and runners"
  ],
  [
    "205",
    "Dancers"
  ],
  [
    "206",
    "Musicians and singers"
  ],
  [
    "207",
    "Disc jockeys (except radio)"
  ],
  [
    "208",
    "Entertainers and performers"
  ],
  [
    "209",
    "Digital content creators"
  ],
  [
    "210",
    "Ushers, lobby attendants, ticket takers"
  ],
  [
    "211",
    "Locker room, coatroom, dressing room attendants"
  ],
  [
    "301",
    "Baggage porters and bellhops"
  ],
  [
    "302",
    "Concierges"
  ],
  [
    "303",
    "Hotel, motel and resort desk clerks"
  ],
  [
    "304",
    "Maids and housekeeping cleaners"
  ],
  [
    "401",
    "Home maintenance and repair workers"
  ],
  [
    "402",
    "Home landscaping and groundskeeping workers"
  ],
  [
    "403",
    "Home electricians"
  ],
  [
    "404",
    "Home plumbers"
  ],
  [
    "405",
    "Home heating and A/C mechanics and installers"
  ],
  [
    "406",
    "Home appliance installers and repairers"
  ],
  [
    "407",
    "Home cleaning service workers"
  ],
  [
    "408",
    "Locksmiths"
  ],
  [
    "409",
    "Roadside assistance workers"
  ],
  [
    "501",
    "Personal care and service workers"
  ],
  [
    "502",
    "Private event planners"
  ],
  [
    "503",
    "Private event and portrait photographers"
  ],
  [
    "504",
    "Private event videographers"
  ],
  [
    "505",
    "Event officiants"
  ],
  [
    "506",
    "Pet caretakers"
  ],
  [
    "507",
    "Tutors"
  ],
  [
    "508",
    "Nannies and babysitters"
  ],
  [
    "509",
    "Visual artists"
  ],
  [
    "510",
    "Floral designers"
  ],
  [
    "601",
    "Skincare specialists"
  ],
  [
    "602",
    "Massage therapists"
  ],
  [
    "603",
    "Barbers, hairdressers, hairstylists, cosmetologists"
  ],
  [
    "604",
    "Shampooers"
  ],
  [
    "605",
    "Manicurists and pedicurists"
  ],
  [
    "606",
    "Eyebrow threading and waxing technicians"
  ],
  [
    "607",
    "Makeup artists"
  ],
  [
    "608",
    "Exercise trainers and group fitness instructors"
  ],
  [
    "609",
    "Tattoo artists and piercers"
  ],
  [
    "610",
    "Tailors"
  ],
  [
    "611",
    "Shoe and leather workers and repairers"
  ],
  [
    "701",
    "Golf caddies"
  ],
  [
    "702",
    "Self-enrichment teachers"
  ],
  [
    "703",
    "Recreational and tour pilots"
  ],
  [
    "704",
    "Tour guides and escorts"
  ],
  [
    "705",
    "Travel guides"
  ],
  [
    "706",
    "Sports and recreation instructors"
  ],
  [
    "801",
    "Parking and valet attendants"
  ],
  [
    "802",
    "Taxi and rideshare drivers and chauffeurs"
  ],
  [
    "803",
    "Shuttle drivers"
  ],
  [
    "804",
    "Goods delivery people"
  ],
  [
    "805",
    "Personal vehicle and equipment cleaners"
  ],
  [
    "806",
    "Private and charter bus drivers"
  ],
  [
    "807",
    "Water taxi operators and charter boat workers"
  ],
  [
    "808",
    "Rickshaw, pedicab and carriage drivers"
  ],
  [
    "809",
    "Home movers"
  ],
  [
    "810",
    "Gas pump attendants"
  ],
  [
    "000",
    "Not a qualifying occupation (or a specified service business)"
  ]
];

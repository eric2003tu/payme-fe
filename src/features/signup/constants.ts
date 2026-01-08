export const DocumentType = {
  NATIONAL_ID: "NATIONAL_ID",
  PASSPORT: "PASSPORT",
  UTILITY_BILL: "UTILITY_BILL",
  SELFIE: "SELFIE",
  BANK_STATEMENT: "BANK_STATEMENT",
  PAYSLIP: "PAYSLIP",
} as const;

export const COUNTRIES = [
  { id: "rw", name: "Rwanda", flag: "🇷🇼" },
  { id: "ug", name: "Uganda", flag: "🇺🇬" },
  { id: "tz", name: "Tanzania", flag: "🇹🇿" },
  { id: "ke", name: "Kenya", flag: "🇰🇪" },
  { id: "us", name: "United States", flag: "🇺🇸" },
];

export const ADDRESS_DATA = {
  rw: {
    provinces: [
      {
        id: "kigali",
        name: "Kigali City",
        districts: [
          {
            id: "gasabo",
            name: "Gasabo",
            sectors: [
              {
                id: "remera",
                name: "Remera",
                cells: [
                  {
                    id: "gishushu",
                    name: "Gishushu",
                    villages: [
                      { id: "v1", name: "Gishushu A" },
                      { id: "v2", name: "Gishushu B" },
                      { id: "v3", name: "Gishushu C" },
                    ],
                  },
                  {
                    id: "kimironko",
                    name: "Kimironko",
                    villages: [
                      { id: "v4", name: "Kimironko A" },
                      { id: "v5", name: "Kimironko B" },
                    ],
                  },
                ],
              },
              {
                id: "kacyiru",
                name: "Kacyiru",
                cells: [
                  {
                    id: "cell1",
                    name: "Kacyiru Center",
                    villages: [
                      { id: "v6", name: "Kacyiru East" },
                      { id: "v7", name: "Kacyiru West" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "nyarugenge",
            name: "Nyarugenge",
            sectors: [
              {
                id: "nyamirambo",
                name: "Nyamirambo",
                cells: [
                  {
                    id: "cell2",
                    name: "Nyamirambo Center",
                    villages: [
                      { id: "v8", name: "Nyamirambo A" },
                      { id: "v9", name: "Nyamirambo B" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "south",
        name: "Southern Province",
        districts: [
          {
            id: "huye",
            name: "Huye",
            sectors: [
              {
                id: "huyesector",
                name: "Huye Sector",
                cells: [
                  {
                    id: "cell3",
                    name: "Huye Cell",
                    villages: [
                      { id: "v10", name: "Huye Village A" },
                      { id: "v11", name: "Huye Village B" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  us: {
    provinces: [
      {
        id: "ny",
        name: "New York",
        districts: [
          {
            id: "nyc",
            name: "New York City",
            sectors: [
              {
                id: "manhattan",
                name: "Manhattan",
                cells: [
                  {
                    id: "midtown",
                    name: "Midtown",
                    villages: [
                      { id: "v12", name: "Times Square" },
                      { id: "v13", name: "Hell's Kitchen" },
                      { id: "v14", name: "Theater District" },
                    ],
                  },
                  {
                    id: "uppereast",
                    name: "Upper East Side",
                    villages: [
                      { id: "v15", name: "Carnegie Hill" },
                      { id: "v16", name: "Yorkville" },
                    ],
                  },
                ],
              },
              {
                id: "brooklyn",
                name: "Brooklyn",
                cells: [
                  {
                    id: "williamsburg",
                    name: "Williamsburg",
                    villages: [
                      { id: "v17", name: "Northside" },
                      { id: "v18", name: "Southside" },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: "buffalo",
            name: "Buffalo",
            sectors: [
              {
                id: "downtown",
                name: "Downtown",
                cells: [
                  {
                    id: "center",
                    name: "City Center",
                    villages: [
                      { id: "v19", name: "Central Business" },
                      { id: "v20", name: "Waterfront" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "ca",
        name: "California",
        districts: [
          {
            id: "la",
            name: "Los Angeles",
            sectors: [
              {
                id: "hollywood",
                name: "Hollywood",
                cells: [
                  {
                    id: "hollywoodcell",
                    name: "Hollywood",
                    villages: [
                      { id: "v21", name: "Hollywood Hills" },
                      { id: "v22", name: "Downtown Hollywood" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  ug: {
    provinces: [
      {
        id: "central",
        name: "Central Region",
        districts: [
          {
            id: "kampala",
            name: "Kampala",
            sectors: [
              {
                id: "nakawa",
                name: "Nakawa Division",
                cells: [
                  {
                    id: "nakawacell",
                    name: "Nakawa",
                    villages: [
                      { id: "v23", name: "Nakawa A" },
                      { id: "v24", name: "Nakawa B" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
} as const;

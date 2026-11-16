import type { LanguageCode, ThaiPoliteForm } from '../types';

export interface IntroSlotOption {
  key: string;
  label: string;
  translations: Record<
    LanguageCode,
    {
      native: string;
      phonetic: string;
    }
  >;
}

export const ORIGIN_OPTIONS: IntroSlotOption[] = [
  {
    key: 'singapore',
    label: 'Singapore',
    translations: {
      th: { native: 'สิงคโปร์', phonetic: 'Sing-kha-poh' },
      id: { native: 'Singapura', phonetic: 'Sing-ah-POO-rah' },
      it: { native: 'Singapore', phonetic: 'Seen-gah-POH-reh' },
      es: { native: 'Singapur', phonetic: 'Seen-gah-POOR' },
    },
  },
  {
    key: 'malaysia',
    label: 'Malaysia',
    translations: {
      th: { native: 'มาเลเซีย', phonetic: 'Maa-leh-sia' },
      id: { native: 'Malaysia', phonetic: 'Mah-LAI-syah' },
      it: { native: 'Malesia', phonetic: 'Mah-LEH-zyah' },
      es: { native: 'Malasia', phonetic: 'Mah-LAH-syah' },
    },
  },
  {
    key: 'usa',
    label: 'the US',
    translations: {
      th: { native: 'อเมริกา', phonetic: 'A-meh-ri-gaa' },
      id: { native: 'Amerika', phonetic: 'Ah-meh-REE-kah' },
      it: { native: 'gli Stati Uniti', phonetic: 'lyee STAH-tee oo-NEE-tee' },
      es: { native: 'Estados Unidos', phonetic: 'Es-TAH-dohs oo-NEE-dohs' },
    },
  },
  {
    key: 'uk',
    label: 'the UK',
    translations: {
      th: { native: 'อังกฤษ', phonetic: 'Ang-grit' },
      id: { native: 'Inggris', phonetic: 'ING-grees' },
      it: { native: 'il Regno Unito', phonetic: 'eel REHN-yoh oo-NEE-toh' },
      es: { native: 'el Reino Unido', phonetic: 'el RAY-noh oo-NEE-doh' },
    },
  },
  {
    key: 'australia',
    label: 'Australia',
    translations: {
      th: { native: 'ออสเตรเลีย', phonetic: 'Ot-treh-lia' },
      id: { native: 'Australia', phonetic: 'Ows-TRAH-lee-ah' },
      it: { native: 'l’Australia', phonetic: 'lows-TRAH-lyah' },
      es: { native: 'Australia', phonetic: 'Ows-TRAH-lyah' },
    },
  },
];

export const COMPANION_OPTIONS: IntroSlotOption[] = [
  {
    key: 'family',
    label: 'with my family',
    translations: {
      th: { native: 'มากับครอบครัว', phonetic: 'maa gap khrop-khrua' },
      id: { native: 'bersama keluarga saya', phonetic: 'ber-SAH-mah keh-loo-AR-gah SAH-yah' },
      it: { native: 'con la mia famiglia', phonetic: 'kohn lah MEE-ah fah-MEEL-yah' },
      es: { native: 'con mi familia', phonetic: 'kohn mee fah-MEE-lyah' },
    },
  },
  {
    key: 'wife',
    label: 'with my wife',
    translations: {
      th: { native: 'มากับภรรยา', phonetic: 'maa gap phan-ra-yaa' },
      id: { native: 'bersama istri saya', phonetic: 'ber-SAH-mah EES-tree SAH-yah' },
      it: { native: 'con mia moglie', phonetic: 'kohn MEE-ah MOHL-yeh' },
      es: { native: 'con mi esposa', phonetic: 'kohn mee es-POH-sah' },
    },
  },
  {
    key: 'husband',
    label: 'with my husband',
    translations: {
      th: { native: 'มากับสามี', phonetic: 'maa gap saa-mee' },
      id: { native: 'bersama suami saya', phonetic: 'ber-SAH-mah soo-AH-mee SAH-yah' },
      it: { native: 'con mio marito', phonetic: 'kohn MEE-oh mah-REE-toh' },
      es: { native: 'con mi esposo', phonetic: 'kohn mee es-POH-soh' },
    },
  },
  {
    key: 'kids',
    label: 'with my kids',
    translations: {
      th: { native: 'มากับลูกๆ', phonetic: 'maa gap look-look' },
      id: { native: 'bersama anak-anak', phonetic: 'ber-SAH-mah AH-nahk-AH-nahk' },
      it: { native: 'con i miei figli', phonetic: 'kohn ee MYEH-ee FEEL-yee' },
      es: { native: 'con mis hijos', phonetic: 'kohn mees EE-hohs' },
    },
  },
  {
    key: 'parents',
    label: 'with my parents',
    translations: {
      th: { native: 'มากับคุณพ่อคุณแม่', phonetic: 'maa gap khun-phor khun-mae' },
      id: { native: 'bersama orang tua saya', phonetic: 'ber-SAH-mah OH-rahng TOO-ah SAH-yah' },
      it: { native: 'con i miei genitori', phonetic: 'kohn ee MYEH-ee jeh-nee-TOH-ree' },
      es: { native: 'con mis padres', phonetic: 'kohn mees PAH-drehs' },
    },
  },
];

export const LOVE_OPTIONS: IntroSlotOption[] = [
  {
    key: 'food',
    label: 'the local food',
    translations: {
      th: { native: 'อาหารที่นี่', phonetic: 'aa-haan tee-nee' },
      id: { native: 'makanan di sini', phonetic: 'mah-KAH-nahn dee SEE-nee' },
      it: { native: 'la cucina locale', phonetic: 'lah koo-CHEE-nah loh-KAH-leh' },
      es: { native: 'la comida local', phonetic: 'lah koh-MEE-dah loh-KAHL' },
    },
  },
  {
    key: 'people',
    label: 'how warm the people are',
    translations: {
      th: { native: 'ความใจดีของคนที่นี่', phonetic: 'khwaam jai-dee khong khon tee-nee' },
      id: { native: 'keramahan orang-orang di sini', phonetic: 'keh-rah-MAH-hahn OH-rahng dee SEE-nee' },
      it: { native: 'la gentilezza delle persone', phonetic: 'lah jen-tee-LET-sah DEL-leh per-SOH-neh' },
      es: { native: 'lo amable que es la gente', phonetic: 'loh ah-MAH-bleh keh es lah HEN-teh' },
    },
  },
  {
    key: 'culture',
    label: 'your culture',
    translations: {
      th: { native: 'วัฒนธรรมที่นี่', phonetic: 'wat-tha-na-tham tee-nee' },
      id: { native: 'budaya di sini', phonetic: 'boo-DAH-yah dee SEE-nee' },
      it: { native: 'la vostra cultura', phonetic: 'lah VOHS-trah kool-TOO-rah' },
      es: { native: 'su cultura', phonetic: 'soo kool-TOO-rah' },
    },
  },
  {
    key: 'language',
    label: 'learning your language',
    translations: {
      th: { native: 'การเรียนภาษาไทย', phonetic: 'gaan rian phaa-saa Thai' },
      id: { native: 'belajar bahasa Indonesia', phonetic: 'beh-LAH-jar bah-HAH-sah In-doh-NEH-syah' },
      it: { native: 'imparare l’italiano', phonetic: 'eem-pah-RAH-reh lee-tah-LYAH-noh' },
      es: { native: 'aprender español', phonetic: 'ah-pren-DER es-pah-NYOL' },
    },
  },
];

export function buildPersonalIntro(
  language: LanguageCode,
  thaiPoliteForm: ThaiPoliteForm,
  name: string,
  originKey: string,
  companionKey: string,
  loveKey: string
): {
  native: string;
  phonetic: string;
  english: string;
} {
  const safeName = name.trim() || 'Marcus';
  const origin = ORIGIN_OPTIONS.find((o) => o.key === originKey) ?? ORIGIN_OPTIONS[0];
  const companion =
    COMPANION_OPTIONS.find((c) => c.key === companionKey) ?? COMPANION_OPTIONS[0];
  const love = LOVE_OPTIONS.find((l) => l.key === loveKey) ?? LOVE_OPTIONS[0];

  const o = origin.translations[language];
  const c = companion.translations[language];
  const l = love.translations[language];

  const english = `Hello! My name is ${safeName}. I am from ${origin.label}, and I am here ${companion.label}. I only speak a little, but I really love ${love.label}!`;

  if (language === 'th') {
    const p = thaiPoliteForm === 'khrap' ? 'ครับ' : 'ค่ะ';
    const pp = thaiPoliteForm === 'khrap' ? 'khrap' : 'kha';
    const self = thaiPoliteForm === 'khrap' ? 'ผม' : 'ฉัน';
    const selfPhon = thaiPoliteForm === 'khrap' ? 'phom' : 'chan';

    return {
      english,
      native: `สวัสดี${p} ${self}ชื่อ${safeName}${p} มาจาก${o.native} และ${c.native}${p} ${self}พูดไทยได้นิดหน่อย แต่ชอบ${l.native}มากเลย${p}`,
      phonetic: `sa-wat-dee ${pp}! ${selfPhon} chue ${safeName} ${pp}. maa jaak ${o.phonetic}, lae ${c.phonetic} ${pp}. ${selfPhon} phoot Thai dai nit-noi, tae chop ${l.phonetic} maak loei ${pp}!`,
    };
  }

  if (language === 'id') {
    return {
      english,
      native: `Halo! Nama saya ${safeName}. Saya berasal dari ${o.native}, dan saya ke sini ${c.native}. Saya baru bisa sedikit bahasa Indonesia, tapi saya sangat suka ${l.native}!`,
      phonetic: `HAH-loh! NAH-mah SAH-yah ${safeName}. SAH-yah ber-AH-sahl DAH-ree ${o.phonetic}, dahn SAH-yah keh SEE-nee ${c.phonetic}. SAH-yah BAH-roo BEE-sah seh-DEE-kit bah-HAH-sah In-doh-NEH-syah, TAH-pee SAH-yah SAHNG-aht SOO-kah ${l.phonetic}!`,
    };
  }

  if (language === 'it') {
    return {
      english,
      native: `Ciao! Mi chiamo ${safeName}. Vengo da ${o.native} e sono qui ${c.native}. Parlo solo un po’ d’italiano, ma adoro ${l.native}!`,
      phonetic: `CHOW! mee KYAH-moh ${safeName}. VEN-goh dah ${o.phonetic} eh SOH-noh kwee ${c.phonetic}. PAR-loh SOH-loh oon poh dee-tah-LYAH-noh, mah ah-DOH-roh ${l.phonetic}!`,
    };
  }

  return {
    english,
    native: `¡Hola! Me llamo ${safeName}. Soy de ${o.native} y estoy aquí ${c.native}. Hablo solo un poquito de español, ¡pero me encanta ${l.native}!`,
    phonetic: `OH-lah! meh YAH-moh ${safeName}. soy deh ${o.phonetic} ee es-TOY ah-KEE ${c.phonetic}. AH-bloh SOH-loh oon poh-KEE-toh deh es-pah-NYOL, peh-roh meh en-KAHN-tah ${l.phonetic}!`,
  };
}

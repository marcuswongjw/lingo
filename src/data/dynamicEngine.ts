import type { DynamicSituationResult, LanguageCode, ThaiPoliteForm } from '../types';

export interface SituationPreset {
  id: string;
  label: string;
  query: string;
}

export const SITUATION_PRESETS: SituationPreset[] = [
  {
    id: 'taxi',
    label: 'Friendly Taxi / Grab Chat',
    query: 'Chatting warmly with our taxi or Grab driver',
  },
  {
    id: 'host',
    label: 'Meeting Our Host',
    query: 'Meeting our local Airbnb or homestay host with family',
  },
  {
    id: 'food',
    label: 'Street Food / Café',
    query: 'Ordering and complimenting food at a local family stall or café',
  },
  {
    id: 'market',
    label: 'Friendly Market Chat',
    query: 'Chatting with a friendly vendor at a local market',
  },
  {
    id: 'photo',
    label: 'Asking for a Family Photo',
    query: 'Politely asking someone to take a photo of our family',
  },
  {
    id: 'directions',
    label: 'Directions & Toilet',
    query: 'Politely asking for directions to the station or bathroom',
  },
  {
    id: 'health',
    label: 'Pharmacy & Kid Health',
    query: 'Asking at a pharmacy for medicine or help for our family',
  },
];

type IntentKey =
  | 'taxi'
  | 'host'
  | 'food'
  | 'market'
  | 'photo'
  | 'directions'
  | 'health'
  | 'general';

function detectIntent(query: string): IntentKey {
  const q = query.toLowerCase();
  if (/(taxi|grab|driver|car|ride|uber|tuk)/.test(q)) return 'taxi';
  if (/(host|airbnb|hotel|home|stay|neighbor|check-in|check in)/.test(q)) return 'host';
  if (/(food|eat|cafe|coffee|restaurant|stall|dinner|lunch|breakfast|dish)/.test(q))
    return 'food';
  if (/(market|shop|buy|vendor|store|price|souvenir)/.test(q)) return 'market';
  if (/(photo|picture|camera|selfie)/.test(q)) return 'photo';
  if (/(direction|where|station|train|bus|toilet|bathroom|restroom|way|map|far)/.test(q))
    return 'directions';
  if (/(pharmacy|doctor|sick|fever|medicine|help|hospital|hurt|allergy|health)/.test(q))
    return 'health';
  return 'general';
}

export function generateDynamicSituation(
  query: string,
  language: LanguageCode,
  thaiPoliteForm: ThaiPoliteForm
): DynamicSituationResult {
  const intent = detectIntent(query);
  const p = thaiPoliteForm === 'khrap' ? 'ครับ' : 'ค่ะ';
  const pp = thaiPoliteForm === 'khrap' ? 'khrap' : 'kha';

  const cleanTitle = query.trim() || 'Friendly Everyday Connection';

  const templates: Record<IntentKey, Record<LanguageCode, Omit<DynamicSituationResult, 'id' | 'title'>>> = {
    taxi: {
      th: {
        contextSummary: 'Warm small talk with a driver — builds instant goodwill during your ride.',
        phrases: [
          {
            id: 'dyn-taxi-th-1',
            english: 'Hello! Thank you for picking us up.',
            native: `สวัสดี${p} ขอบคุณที่มารับนะ${p}`,
            phonetic: `sa-wat-dee ${pp}, khop-khun tee maa rap na ${pp}`,
            tip: 'A friendly greeting sets a relaxed tone for the whole ride.',
          },
          {
            id: 'dyn-taxi-th-2',
            english: 'Have you been driving for a long time today?',
            native: `วันนี้ขับรถนานหรือยัง${p}`,
            phonetic: `wan-nee khap-rot naan rue yang ${pp}?`,
            tip: 'Shows empathy and curiosity about their day.',
          },
          {
            id: 'dyn-taxi-th-3',
            english: 'Thank you! Drive safely!',
            native: `ขอบคุณมาก${p} ขับรถดีๆ นะ${p}`,
            phonetic: `khop-khun maak ${pp}, khap-rot dee-dee na ${pp}!`,
            tip: 'Wishing them safe driving when stepping out is deeply appreciated.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Going to the city center?',
            native: 'สวัสดีครับ ไปในเมืองใช่ไหมครับ',
            phonetic: 'sa-wat-dee khrap, pai nai mueang chai mai khrap?',
          },
          {
            speaker: 'you',
            english: 'Yes! Thank you for picking us up. Is traffic busy today?',
            native: `ใช่${p} ขอบคุณที่มารับนะ${p} วันนี้รถติดไหม${p}`,
            phonetic: `chai ${pp}! khop-khun tee maa rap na ${pp}. wan-nee rot tit mai ${pp}?`,
            hint: 'Tap to practice asking about traffic — drivers love chatting about it!',
          },
          {
            speaker: 'local',
            english: 'A little busy, but we will get there comfortably!',
            native: 'ติดนิดหน่อยครับ แต่ไปสบายๆ ครับ',
            phonetic: 'tit nit-noi khrap, tae pai sa-bai-sa-bai khrap!',
          },
        ],
      },
      id: {
        contextSummary: 'Friendly Indonesian ride chat — drivers love warm, relaxed conversation.',
        phrases: [
          {
            id: 'dyn-taxi-id-1',
            english: 'Hello! Thank you for picking us up.',
            native: 'Halo Pak/Bu! Terima kasih sudah menjemput.',
            phonetic: 'HAH-loh Pahk/Boo! teh-ree-mah KAH-see SOO-dah men-jem-POOT.',
            tip: 'Use "Pak" for male drivers and "Bu" for female drivers.',
          },
          {
            id: 'dyn-taxi-id-2',
            english: 'Is traffic usually busy around here?',
            native: 'Di sini biasanya macet ya?',
            phonetic: 'dee SEE-nee bee-ah-SAH-nyah MAH-chet yah?',
            tip: '"Macet" (traffic jam) is an instant conversation starter in Indonesia.',
          },
          {
            id: 'dyn-taxi-id-3',
            english: 'Thank you, take care on the road!',
            native: 'Terima kasih banyak, hati-hati di jalan!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk, HAH-tee HAH-tee dee JAH-lahn!',
            tip: 'Warm farewell as you step out.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Good afternoon! Going with the family?',
            native: 'Selamat siang! Sama keluarga ya?',
            phonetic: 'seh-lah-maht SEE-ahng! SAH-mah keh-loo-AR-gah yah?',
          },
          {
            speaker: 'you',
            english: 'Yes, we are visiting together! Thank you for picking us up.',
            native: 'Iya, kami berlibur bersama! Terima kasih sudah menjemput.',
            phonetic: 'EE-yah, KAH-mee ber-LEE-boor ber-SAH-mah! teh-ree-mah KAH-see SOO-dah men-jem-POOT.',
          },
          {
            speaker: 'local',
            english: 'Welcome! Enjoy your time here!',
            native: 'Selamat datang! Semoga senang di sini!',
            phonetic: 'seh-lah-maht DAH-tahng! seh-MOH-gah seh-NAHNG dee SEE-nee!',
          },
        ],
      },
      it: {
        contextSummary: 'Warm Italian car chat — polite, appreciative, and relaxed.',
        phrases: [
          {
            id: 'dyn-taxi-it-1',
            english: 'Good morning! Thank you for picking us up.',
            native: 'Buongiorno! Grazie per essere venuto.',
            phonetic: 'bwohn-JOHR-noh! GRAHT-syeh per ES-seh-reh veh-NOO-toh.',
            tip: 'Always greet warmly when getting into a cab.',
          },
          {
            id: 'dyn-taxi-it-2',
            english: 'Do you have any favorite places to eat nearby?',
            native: 'Ha un posto preferito dove mangiare qui vicino?',
            phonetic: 'ah oon POHS-toh preh-feh-REE-toh DOH-veh mahn-JAH-reh kwee vee-CHEE-noh?',
            tip: 'Italian drivers are famous for giving the best local food tips.',
          },
          {
            id: 'dyn-taxi-it-3',
            english: 'Thank you so much, have a great day!',
            native: 'Grazie mille, buona giornata!',
            phonetic: 'GRAHT-syeh MEEL-leh, BWOH-nah johr-NAH-tah!',
            tip: 'Friendly closing.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! Is this your first time in Italy?',
            native: 'Benvenuti! È la prima volta in Italia?',
            phonetic: 'ben-veh-NOO-tee! eh lah PREE-mah VOHL-tah een ee-TAH-lyah?',
          },
          {
            speaker: 'you',
            english: 'Yes! We are here with our family and we love it already!',
            native: 'Sì! Siamo qui con la famiglia e ci piace già tantissimo!',
            phonetic: 'see! SYAH-moh kwee kohn lah fah-MEEL-yah eh chee PYAH-cheh jah tahn-TEES-see-moh!',
          },
          {
            speaker: 'local',
            english: 'Wonderful! You will eat very well here!',
            native: 'Che bello! Qui si mangia benissimo!',
            phonetic: 'keh BEL-loh! kwee see MAHN-jah beh-NEES-see-moh!',
          },
        ],
      },
      es: {
        contextSummary: 'Friendly Spanish ride chat — warm, curious, and easy.',
        phrases: [
          {
            id: 'dyn-taxi-es-1',
            english: 'Hello! Thank you for picking us up.',
            native: '¡Hola! Muchas gracias por recogernos.',
            phonetic: 'OH-lah! MOO-chahs GRAH-syahs por reh-koh-HER-nohs.',
            tip: 'Starts the ride with warmth.',
          },
          {
            id: 'dyn-taxi-es-2',
            english: 'What do you recommend we see around here?',
            native: '¿Qué nos recomienda ver por aquí?',
            phonetic: 'keh nohs reh-koh-MYEN-dah ver por ah-KEE?',
            tip: 'Locals love sharing hidden gems.',
          },
          {
            id: 'dyn-taxi-es-3',
            english: 'Thank you very much, take care!',
            native: '¡Muchas gracias, que le vaya muy bien!',
            phonetic: 'MOO-chahs GRAH-syahs, keh leh VAH-yah mwee BYEN!',
            tip: 'Literally "May it go very well for you!"',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Where are you all visiting from?',
            native: '¡Hola! ¿De dónde nos visitan?',
            phonetic: 'OH-lah! deh DOHN-deh nohs vee-SEE-tahn?',
          },
          {
            speaker: 'you',
            english: 'We are from Singapore, traveling with family!',
            native: '¡Somos de Singapur, viajando en familia!',
            phonetic: 'SOH-mohs deh Seen-gah-POOR, vyah-HAHN-doh en fah-MEE-lyah!',
          },
          {
            speaker: 'local',
            english: 'Welcome! You are going to love it here.',
            native: '¡Bienvenidos! Les va a encantar aquí.',
            phonetic: 'byen-veh-NEE-dohs! lehs vah ah en-kahn-TAR ah-KEE.',
          },
        ],
      },
    },

    host: {
      th: {
        contextSummary: 'Meeting your homestay or hotel host with warmth and gratitude.',
        phrases: [
          {
            id: 'dyn-host-th-1',
            english: 'Hello! Your home is so lovely and welcoming.',
            native: `สวัสดี${p} บ้านน่ารักและอบอุ่นมากเลย${p}`,
            phonetic: `sa-wat-dee ${pp}, baan naa-rak lae op-un maak loei ${pp}`,
            tip: 'Complimenting someone’s home ("naa-rak" = lovely, "op-un" = warm) brings instant smiles.',
          },
          {
            id: 'dyn-host-th-2',
            english: 'Thank you for welcoming our family.',
            native: `ขอบคุณที่ต้อนรับครอบครัวของเรานะ${p}`,
            phonetic: `khop-khun tee ton-rap khrop-khrua khong rao na ${pp}`,
            tip: 'Warm and polite gratitude.',
          },
          {
            id: 'dyn-host-th-3',
            english: 'Is there a nice neighborhood market or café nearby?',
            native: `แถวนี้มีตลาดหรือคาเฟ่แนะนำไหม${p}`,
            phonetic: `thaeo-nee mee ta-laat rue kaa-feh nae-nam mai ${pp}?`,
            tip: 'Great way to get local recommendations.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! Did you have a good trip?',
            native: 'ยินดีต้อนรับครับ เดินทางมาเหนื่อยไหมครับ',
            phonetic: 'yin-dee ton-rap khrap, doen-thaang maa nueai mai khrap?',
          },
          {
            speaker: 'you',
            english: 'Thank you! We are so happy to be here. Your place is lovely!',
            native: `ขอบคุณ${p} ดีใจมากที่ได้มา${p} ที่นี่น่ารักมาก${p}`,
            phonetic: `khop-khun ${pp}! dee-jai maak tee dai maa ${pp}. tee-nee naa-rak maak ${pp}!`,
          },
          {
            speaker: 'local',
            english: 'Make yourselves at home! Let me know if you need anything.',
            native: 'ทำตัวตามสบายนะครับ มีอะไรบอกได้เสมอครับ',
            phonetic: 'tham tua taam sa-bai na khrap, mee a-rai bok dai sa-moe khrap.',
          },
        ],
      },
      id: {
        contextSummary: 'Meeting your Indonesian host or neighbor warmly.',
        phrases: [
          {
            id: 'dyn-host-id-1',
            english: 'Thank you for welcoming our family!',
            native: 'Terima kasih sudah menyambut keluarga kami!',
            phonetic: 'teh-ree-mah KAH-see SOO-dah men-yahm-BOOT keh-loo-AR-gah KAH-mee!',
            tip: 'Shows genuine appreciation for hospitality.',
          },
          {
            id: 'dyn-host-id-2',
            english: 'Your place is very comfortable and peaceful.',
            native: 'Tempatnya sangat nyaman dan tenang.',
            phonetic: 'tem-PAHT-nyah SAHNG-aht NYAH-mahn dahn teh-NAHNG.',
            tip: '"Nyaman" (comfortable) is a lovely compliment.',
          },
          {
            id: 'dyn-host-id-3',
            english: 'Where is a good place for breakfast nearby?',
            native: 'Tempat sarapan yang enak di dekat sini di mana ya?',
            phonetic: 'tem-PAHT sah-RAH-pahn yahng EH-nahk dee deh-KAHT SEE-nee dee MAH-nah yah?',
            tip: 'Hosts love pointing out their favorite local breakfast spot.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! Please come in and rest.',
            native: 'Selamat datang! Silakan masuk dan istirahat.',
            phonetic: 'seh-lah-maht DAH-tahng! see-LAH-kahn MAH-sook dahn ees-tee-RAH-haht.',
          },
          {
            speaker: 'you',
            english: 'Thank you so much! Your home is very comfortable.',
            native: 'Terima kasih banyak! Rumahnya sangat nyaman.',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk! roo-MAH-nyah SAHNG-aht NYAH-mahn.',
          },
          {
            speaker: 'local',
            english: 'Thank you! Feel right at home.',
            native: 'Terima kasih! Anggap saja rumah sendiri.',
            phonetic: 'teh-ree-mah KAH-see! AHNG-gahp SAH-jah ROO-mah sen-DEE-ree.',
          },
        ],
      },
      it: {
        contextSummary: 'Meeting your Italian host — warm hospitality and local tips.',
        phrases: [
          {
            id: 'dyn-host-it-1',
            english: 'Thank you so much for welcoming us!',
            native: 'Grazie mille per la splendida accoglienza!',
            phonetic: 'GRAHT-syeh MEEL-leh per lah SPLEN-dee-dah ahk-kohl-YEN-tsah!',
            tip: 'Italians take great pride in "accoglienza" (hospitality).',
          },
          {
            id: 'dyn-host-it-2',
            english: 'Your home is really beautiful!',
            native: 'La sua casa è davvero bellissima!',
            phonetic: 'lah SOO-ah KAH-zah eh dahv-VEH-roh bel-LEES-see-mah!',
            tip: 'Warm and sincere.',
          },
          {
            id: 'dyn-host-it-3',
            english: 'Where do locals go for morning coffee?',
            native: 'Dove prendono il caffè le persone del posto?',
            phonetic: 'DOH-veh PREN-doh-noh eel kahf-FEH leh per-SOH-neh del POHS-toh?',
            tip: 'Gets you off the tourist path immediately.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! Have a wonderful stay!',
            native: 'Benvenuti! Vi auguro un ottimo soggiorno!',
            phonetic: 'ben-veh-NOO-tee! vee OW-goo-roh oon OHT-tee-moh sohd-JOHR-noh!',
          },
          {
            speaker: 'you',
            english: 'Thank you! Your home is so beautiful!',
            native: 'Grazie mille! La sua casa è bellissima!',
            phonetic: 'GRAHT-syeh MEEL-leh! lah SOO-ah KAH-zah eh bel-LEES-see-mah!',
          },
          {
            speaker: 'local',
            english: 'You are too kind! Enjoy the neighborhood.',
            native: 'Troppo gentili! Godetevi il quartiere.',
            phonetic: 'TROHP-poh jen-TEE-lee! goh-DEH-teh-vee eel kwahr-TYEH-reh.',
          },
        ],
      },
      es: {
        contextSummary: 'Meeting your Spanish-speaking host with warmth.',
        phrases: [
          {
            id: 'dyn-host-es-1',
            english: 'Thank you for welcoming our family!',
            native: '¡Muchas gracias por recibir a nuestra familia!',
            phonetic: 'MOO-chahs GRAH-syahs por reh-see-BEER ah NWES-trah fah-MEE-lyah!',
            tip: 'Gracious opening.',
          },
          {
            id: 'dyn-host-es-2',
            english: 'Your home is very cozy and lovely.',
            native: 'Su casa es muy acogedora y bonita.',
            phonetic: 'soo KAH-sah es mwee ah-koh-heh-DOH-rah ee boh-NEE-tah.',
            tip: '"Acogedora" means cozy and welcoming.',
          },
          {
            id: 'dyn-host-es-3',
            english: 'Is there a bakery or café you love nearby?',
            native: '¿Hay una panadería o café favorito por aquí?',
            phonetic: 'ay OO-nah pah-nah-deh-REE-ah oh kah-FEH fah-voh-REE-toh por ah-KEE?',
            tip: 'Great neighborhood icebreaker.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! Please make yourselves at home.',
            native: '¡Bienvenidos! Están en su casa.',
            phonetic: 'byen-veh-NEE-dohs! es-TAHN en soo KAH-sah.',
          },
          {
            speaker: 'you',
            english: 'Thank you so much! Your home is lovely.',
            native: '¡Muchas gracias! Su casa es muy bonita.',
            phonetic: 'MOO-chahs GRAH-syahs! soo KAH-sah es mwee boh-NEE-tah.',
          },
          {
            speaker: 'local',
            english: 'With pleasure! Anything you need, just tell me.',
            native: '¡Con mucho gusto! Lo que necesiten, me avisan.',
            phonetic: 'kohn MOO-choh GOOS-toh! loh keh neh-seh-SEE-ten, meh ah-VEE-sahn.',
          },
        ],
      },
    },

    food: {
      th: {
        contextSummary: 'Connecting warmly at a street food stall or family restaurant.',
        phrases: [
          {
            id: 'dyn-food-th-1',
            english: 'What is your most popular dish?',
            native: `จานไหนอร่อยที่สุด${p}`,
            phonetic: `jaan nai a-roi tee-sut ${pp}?`,
            tip: 'Locals love recommending their specialty.',
          },
          {
            id: 'dyn-food-th-2',
            english: 'Not spicy for the kids, please!',
            native: `ไม่เผ็ดสำหรับเด็กนะ${p}`,
            phonetic: `mai phet sam-rap dek na ${pp}`,
            tip: 'Essential for families! "Mai phet" = not spicy.',
          },
          {
            id: 'dyn-food-th-3',
            english: 'Everything was so delicious, thank you!',
            native: `อร่อยมากเลย${p} ขอบคุณมาก${p}`,
            phonetic: `a-roi maak loei ${pp}, khop-khun maak ${pp}!`,
            tip: 'Say this when paying or leaving.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! What would you like to eat today?',
            native: 'สวัสดีค่ะ วันนี้ทานอะไรดีคะ',
            phonetic: 'sa-wat-dee kha, wan-nee thaan a-rai dee kha?',
          },
          {
            speaker: 'you',
            english: 'What is your favorite dish? Not too spicy please!',
            native: `มีอะไรแนะนำไหม${p} ขอไม่เผ็ดนะ${p}`,
            phonetic: `mee a-rai nae-nam mai ${pp}? khor mai phet na ${pp}`,
          },
          {
            speaker: 'local',
            english: 'Try our Pad Thai — kids love it!',
            native: 'ลองผัดไทยไหมคะ เด็กๆ ชอบมากค่ะ',
            phonetic: 'long phat-thai mai kha, dek-dek chop maak kha!',
          },
        ],
      },
      id: {
        contextSummary: 'Warmly ordering and complimenting at an Indonesian warung or café.',
        phrases: [
          {
            id: 'dyn-food-id-1',
            english: 'What is the specialty here?',
            native: 'Menu spesial di sini apa ya?',
            phonetic: 'meh-NOO speh-SYAHL dee SEE-nee AH-pah yah?',
            tip: 'Friendly way to ask what they are proudest of.',
          },
          {
            id: 'dyn-food-id-2',
            english: 'Not spicy please, it’s for the kids.',
            native: 'Tidak pedas ya, untuk anak-anak.',
            phonetic: 'TEE-dahk PEH-dahs yah, oon-TOOK AH-nahk-AH-nahk.',
            tip: '"Tidak pedas" = not spicy.',
          },
          {
            id: 'dyn-food-id-3',
            english: 'The food is amazing, thank you!',
            native: 'Makanannya enak sekali, terima kasih!',
            phonetic: 'mah-kah-NAHN-nyah EH-nahk seh-KAH-lee, teh-ree-mah KAH-see!',
            tip: 'Always brings a warm smile.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Please sit! What would you like to order?',
            native: 'Silakan duduk! Mau pesan apa?',
            phonetic: 'see-LAH-kahn DOO-dook! mow peh-SAHN AH-pah?',
          },
          {
            speaker: 'you',
            english: 'What do you recommend? Not spicy for our kids, please.',
            native: 'Yang enak apa ya? Tidak pedas untuk anak-anak ya.',
            phonetic: 'yahng EH-nahk AH-pah yah? TEE-dahk PEH-dahs oon-TOOK AH-nahk-AH-nahk yah.',
          },
          {
            speaker: 'local',
            english: 'Try our fried rice — very tasty!',
            native: 'Coba nasi goreng kami, enak sekali!',
            phonetic: 'CHOH-bah NAH-see GOH-reng KAH-mee, EH-nahk seh-KAH-lee!',
          },
        ],
      },
      it: {
        contextSummary: 'Friendly Italian trattoria or café connection.',
        phrases: [
          {
            id: 'dyn-food-it-1',
            english: 'What is the dish of the day?',
            native: 'Qual è il piatto del giorno?',
            phonetic: 'kwahl eh eel PYAHT-toh del JOHR-noh?',
            tip: 'Always a great choice in family-run trattorias.',
          },
          {
            id: 'dyn-food-it-2',
            english: 'Is there something simple for the kids?',
            native: 'C’è qualcosa di semplice per i bambini?',
            phonetic: 'cheh kwahl-KOH-zah dee SEM-plee-cheh per ee bahm-BEE-nee?',
            tip: 'Italian kitchens are almost always happy to accommodate children.',
          },
          {
            id: 'dyn-food-it-3',
            english: 'Compliments to the chef, it was delicious!',
            native: 'Complimenti allo chef, era buonissimo!',
            phonetic: 'kohm-plee-MEN-tee AHL-loh shef, EH-rah bwoh-NEES-see-moh!',
            tip: 'The ultimate Italian food compliment.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Good evening! Table for the whole family?',
            native: 'Buonasera! Tavolo per tutta la famiglia?',
            phonetic: 'bwoh-nah-SEH-rah! TAH-voh-loh per TOOT-tah lah fah-MEEL-yah?',
          },
          {
            speaker: 'you',
            english: 'Yes, please! What do you recommend tonight?',
            native: 'Sì, grazie! Cosa ci consiglia stasera?',
            phonetic: 'see, GRAHT-syeh! KOH-zah chee kohn-SEEL-yah stah-SEH-rah?',
          },
          {
            speaker: 'local',
            english: 'Our homemade pasta is fresh today!',
            native: 'La nostra pasta fatta in casa è freschissima!',
            phonetic: 'lah NOHS-trah PAHS-tah FAHT-tah een KAH-zah eh fres-KEES-see-mah!',
          },
        ],
      },
      es: {
        contextSummary: 'Warmly connecting at a Spanish or Latin American café.',
        phrases: [
          {
            id: 'dyn-food-es-1',
            english: 'What is your house specialty?',
            native: '¿Cuál es la especialidad de la casa?',
            phonetic: 'kwahl es lah es-peh-syah-lee-DAHD deh lah KAH-sah?',
            tip: 'Shows genuine interest in their cooking.',
          },
          {
            id: 'dyn-food-es-2',
            english: 'Not spicy for the children, please.',
            native: 'Sin picante para los niños, por favor.',
            phonetic: 'seen pee-KAHN-teh PAH-rah lohs NEEN-yohs, por fah-VOR.',
            tip: '"Sin picante" = without spice.',
          },
          {
            id: 'dyn-food-es-3',
            english: 'Everything was delicious, thank you!',
            native: '¡Estuvo delicioso, muchas gracias!',
            phonetic: 'es-TOO-voh deh-lee-SYOH-soh, MOO-chahs GRAH-syahs!',
            tip: 'Warm gratitude after a meal.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Welcome! What can I get for you?',
            native: '¡Bienvenidos! ¿Qué les puedo servir?',
            phonetic: 'byen-veh-NEE-dohs! keh lehs PWEH-doh ser-VEER?',
          },
          {
            speaker: 'you',
            english: 'What is your specialty? Not spicy for the kids please!',
            native: '¿Cuál es su especialidad? ¡Sin picante para los niños, por favor!',
            phonetic: 'kwahl es soo es-peh-syah-lee-DAHD? seen pee-KAHN-teh PAH-rah lohs NEEN-yohs!',
          },
          {
            speaker: 'local',
            english: 'Of course! You will love our freshly made dishes.',
            native: '¡Claro que sí! Les va a encantar nuestra comida.',
            phonetic: 'KLAH-roh keh see! lehs vah ah en-kahn-TAR NWES-trah koh-MEE-dah.',
          },
        ],
      },
    },

    market: {
      th: {
        contextSummary: 'Friendly, respectful chatting with local market vendors.',
        phrases: [
          {
            id: 'dyn-mkt-th-1',
            english: 'This looks so nice! Did you make it yourself?',
            native: `สวยจังเลย${p} ทำเองหรือเปล่า${p}`,
            phonetic: `suai jang loei ${pp}! tham eng rue plao ${pp}?`,
            tip: 'Shows appreciation for their craft.',
          },
          {
            id: 'dyn-mkt-th-2',
            english: 'How much is this, please?',
            native: `อันนี้ราคาเท่าไหร่${p}`,
            phonetic: `an-nee raa-khaa thao-rai ${pp}?`,
            tip: 'Polite and clear.',
          },
          {
            id: 'dyn-mkt-th-3',
            english: 'Thank you! Wishing you good sales today!',
            native: `ขอบคุณ${p} ขอให้ขายดีๆ นะ${p}`,
            phonetic: `khop-khun ${pp}, khor hai khaai dee-dee na ${pp}!`,
            tip: '"Khor hai khaai dee-dee" (wish you good sales) is a beloved Thai blessing.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Feel free to take a look!',
            native: 'สวัสดีค่ะ ดูได้เลยนะคะ',
            phonetic: 'sa-wat-dee kha, doo dai loei na kha!',
          },
          {
            speaker: 'you',
            english: 'So lovely! How much is this one?',
            native: `สวยจังเลย${p} อันนี้เท่าไหร่${p}`,
            phonetic: `suai jang loei ${pp}! an-nee thao-rai ${pp}?`,
          },
          {
            speaker: 'local',
            english: 'One hundred baht — I can give you a friendly price!',
            native: 'ร้อยบาทค่ะ ลดให้พิเศษเลยค่ะ',
            phonetic: 'roi baat kha, lot hai phi-set loei kha!',
          },
        ],
      },
      id: {
        contextSummary: 'Warm market banter in Indonesia.',
        phrases: [
          {
            id: 'dyn-mkt-id-1',
            english: 'This is very beautiful!',
            native: 'Ini bagus sekali!',
            phonetic: 'EE-nee BAH-goos seh-KAH-lee!',
            tip: 'Friendly compliment on their goods.',
          },
          {
            id: 'dyn-mkt-id-2',
            english: 'How much is this?',
            native: 'Ini harganya berapa?',
            phonetic: 'EE-nee har-GAH-nyah beh-RAH-pah?',
            tip: 'Simple and polite.',
          },
          {
            speaker: undefined,
            id: 'dyn-mkt-id-3',
            english: 'Thank you, hope your shop does well today!',
            native: 'Terima kasih, semoga laris ya!',
            phonetic: 'teh-ree-mah KAH-see, seh-MOH-gah LAH-rees yah!',
            tip: '"Semoga laris" wishes a vendor brisk, blessed sales.',
          } as any,
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Please have a look! Looking for souvenirs?',
            native: 'Silakan lihat-lihat! Cari oleh-oleh?',
            phonetic: 'see-LAH-kahn LEE-haht LEE-haht! CHAH-ree oh-leh OH-leh?',
          },
          {
            speaker: 'you',
            english: 'Yes! This is very beautiful. How much is it?',
            native: 'Iya! Ini bagus sekali. Harganya berapa?',
            phonetic: 'EE-yah! EE-nee BAH-goos seh-KAH-lee. har-GAH-nyah beh-RAH-pah?',
          },
          {
            speaker: 'local',
            english: 'Special price for your family!',
            native: 'Harga spesial untuk keluarga Anda!',
            phonetic: 'HAR-gah speh-SYAHL oon-TOOK keh-loo-AR-gah AHN-dah!',
          },
        ],
      },
      it: {
        contextSummary: 'Friendly Italian market or boutique conversation.',
        phrases: [
          {
            id: 'dyn-mkt-it-1',
            english: 'Everything here is wonderful!',
            native: 'È tutto meraviglioso qui!',
            phonetic: 'eh TOOT-toh meh-rah-veel-YOH-zoh kwee!',
            tip: 'Warm appreciation.',
          },
          {
            id: 'dyn-mkt-it-2',
            english: 'Excuse me, how much does this cost?',
            native: 'Mi scusi, quanto costa questo?',
            phonetic: 'mee SKOO-zee, KWAHN-toh KOHS-tah KWEHS-toh?',
            tip: 'Polite and natural.',
          },
          {
            id: 'dyn-mkt-it-3',
            english: 'Thank you, have a lovely day!',
            native: 'Grazie mille, buona giornata!',
            phonetic: 'GRAHT-syeh MEEL-leh, BWOH-nah johr-NAH-tah!',
            tip: 'Always say goodbye warmly when leaving a small shop.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Good morning! Can I help you?',
            native: 'Buongiorno! Posso aiutarLa?',
            phonetic: 'bwohn-JOHR-noh! POHS-soh ah-yoo-TAR-lah?',
          },
          {
            speaker: 'you',
            english: 'Just looking, thank you! Everything is beautiful.',
            native: 'Sto solo guardando, grazie! È tutto bellissimo.',
            phonetic: 'stoh SOH-loh gwahr-DAHN-doh, GRAHT-syeh! eh TOOT-toh bel-LEES-see-moh.',
          },
          {
            speaker: 'local',
            english: 'Take your time! Let me know if you need anything.',
            native: 'Faccia pure con calma! Sono qui.',
            phonetic: 'FAHT-chah POO-reh kohn KAHL-mah! SOH-noh kwee.',
          },
        ],
      },
      es: {
        contextSummary: 'Warm market interaction in Spanish.',
        phrases: [
          {
            id: 'dyn-mkt-es-1',
            english: 'How beautiful! Did you make this?',
            native: '¡Qué bonito! ¿Lo hizo usted?',
            phonetic: 'keh boh-NEE-toh! loh EE-soh oos-TED?',
            tip: 'Great way to connect with artisans.',
          },
          {
            id: 'dyn-mkt-es-2',
            english: 'How much does this cost?',
            native: '¿Cuánto cuesta esto?',
            phonetic: 'KWAHN-toh KWES-tah ES-toh?',
            tip: 'Clear and polite.',
          },
          {
            id: 'dyn-mkt-es-3',
            english: 'Thank you very much, have a great day!',
            native: '¡Muchas gracias, que tenga buen día!',
            phonetic: 'MOO-chahs GRAH-syahs, keh TEN-gah bwen DEE-ah!',
            tip: 'Friendly farewell.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Come see what we have!',
            native: '¡Hola! ¡Pase a ver!',
            phonetic: 'OH-lah! PAH-seh ah ver!',
          },
          {
            speaker: 'you',
            english: 'Everything is so lovely! How much is this?',
            native: '¡Qué bonito todo! ¿Cuánto cuesta esto?',
            phonetic: 'keh boh-NEE-toh TOH-doh! KWAHN-toh KWES-tah ES-toh?',
          },
          {
            speaker: 'local',
            english: 'For you, a very good price!',
            native: '¡Para usted, muy buen precio!',
            phonetic: 'PAH-rah oos-TED, mwee bwen PREH-syoh!',
          },
        ],
      },
    },

    photo: {
      th: {
        contextSummary: 'Politely asking a friendly local to take a family photo.',
        phrases: [
          {
            id: 'dyn-pic-th-1',
            english: 'Excuse me, could you take a photo for our family?',
            native: `ขอโทษนะ${p} ช่วยถ่ายรูปให้ครอบครัวเราหน่อยได้ไหม${p}`,
            phonetic: `khor-thot na ${pp}, chuai thaai roop hai khrop-khrua rao noi dai mai ${pp}?`,
            tip: 'Hand over your phone gently with a smile.',
          },
          {
            id: 'dyn-pic-th-2',
            english: 'Just press this button!',
            native: `กดปุ่มนี้เลย${p}`,
            phonetic: `got pum nee loei ${pp}`,
            tip: 'Super helpful and quick.',
          },
          {
            id: 'dyn-pic-th-3',
            english: 'Thank you so much! It looks great!',
            native: `ขอบคุณมาก${p} รูปสวยมากเลย${p}`,
            phonetic: `khop-khun maak ${pp}, roop suai maak loei ${pp}!`,
            tip: 'Tell them the photo came out great!',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, could you take a family photo for us?',
            native: `ขอโทษนะ${p} ช่วยถ่ายรูปให้หน่อยได้ไหม${p}`,
            phonetic: `khor-thot na ${pp}, chuai thaai roop hai noi dai mai ${pp}?`,
          },
          {
            speaker: 'local',
            english: 'Of course! Everyone smile — 1, 2, 3!',
            native: 'ได้เลยครับ ยิ้มนะครับ หนึ่ง สอง ซั่ม!',
            phonetic: 'dai loei khrap! yim na khrap, nueng, song, sam!',
          },
          {
            speaker: 'you',
            english: 'Thank you! You are so kind!',
            native: `ขอบคุณมาก${p} คุณใจดีมาก${p}`,
            phonetic: `khop-khun maak ${pp}! khun jai-dee maak ${pp}!`,
          },
        ],
      },
      id: {
        contextSummary: 'Politely asking someone to take a family photo in Indonesia.',
        phrases: [
          {
            id: 'dyn-pic-id-1',
            english: 'Excuse me, could you help take a photo of us?',
            native: 'Permisi, boleh minta tolong fotokan kami?',
            phonetic: 'per-MEE-see, BOH-leh MEEN-tah TOH-long foh-TOH-kahn KAH-mee?',
            tip: '"Minta tolong" means "ask for help" politely.',
          },
          {
            id: 'dyn-pic-id-2',
            english: 'Just press here!',
            native: 'Tekan di sini saja!',
            phonetic: 'teh-KAHN dee SEE-nee SAH-jah!',
            tip: 'Clear and simple.',
          },
          {
            id: 'dyn-pic-id-3',
            english: 'Thank you so much, great photo!',
            native: 'Terima kasih banyak, fotonya bagus!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk, foh-TOH-nyah BAH-goos!',
            tip: 'Warm appreciation.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, could you help take our family photo?',
            native: 'Permisi, boleh minta tolong fotokan kami?',
            phonetic: 'per-MEE-see, BOH-leh MEEN-tah TOH-long foh-TOH-kahn KAH-mee?',
          },
          {
            speaker: 'local',
            english: 'Sure! Ready? One, two, three!',
            native: 'Boleh! Siap? Satu, dua, tiga!',
            phonetic: 'BOH-leh! SEE-ahp? SAH-too, DOO-ah, TEE-gah!',
          },
          {
            speaker: 'you',
            english: 'Thank you so much! You are very kind!',
            native: 'Terima kasih banyak! Anda baik sekali!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk! AHN-dah bah-eek seh-KAH-lee!',
          },
        ],
      },
      it: {
        contextSummary: 'Asking someone to take a family photo in Italy.',
        phrases: [
          {
            id: 'dyn-pic-it-1',
            english: 'Excuse me, could you take a photo of us?',
            native: 'Mi scusi, potrebbe farci una foto?',
            phonetic: 'mee SKOO-zee, poh-TREB-beh FAR-chee OO-nah FOH-toh?',
            tip: 'Polite and commonly used.',
          },
          {
            id: 'dyn-pic-it-2',
            english: 'Just press right here.',
            native: 'Basta premere qui.',
            phonetic: 'BAHS-tah preh-MEH-reh kwee.',
            tip: 'Easy instruction.',
          },
          {
            id: 'dyn-pic-it-3',
            english: 'Thank you, it is wonderful!',
            native: 'Grazie mille, è bellissima!',
            phonetic: 'GRAHT-syeh MEEL-leh, eh bel-LEES-see-mah!',
            tip: 'Warm gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, could you take a photo of us?',
            native: 'Mi scusi, potrebbe farci una foto?',
            phonetic: 'mee SKOO-zee, poh-TREB-beh FAR-chee OO-nah FOH-toh?',
          },
          {
            speaker: 'local',
            english: 'Of course! Smile!',
            native: 'Certo, volentieri! Sorridete!',
            phonetic: 'CHER-toh, voh-len-TYEH-ree! soh-ree-DEH-teh!',
          },
          {
            speaker: 'you',
            english: 'Thank you so much!',
            native: 'Grazie mille, è gentilissimo!',
            phonetic: 'GRAHT-syeh MEEL-leh, eh jen-tee-LEES-see-moh!',
          },
        ],
      },
      es: {
        contextSummary: 'Asking someone to take a family photo in Spanish.',
        phrases: [
          {
            id: 'dyn-pic-es-1',
            english: 'Excuse me, could you take a photo of us?',
            native: 'Disculpe, ¿nos puede tomar una foto?',
            phonetic: 'dees-KOOL-peh, nohs PWEH-deh toh-MAR OO-nah FOH-toh?',
            tip: 'Polite and friendly.',
          },
          {
            id: 'dyn-pic-es-2',
            english: 'Just press here, please.',
            native: 'Solo presione aquí, por favor.',
            phonetic: 'SOH-loh preh-SYOH-neh ah-KEE, por fah-VOR.',
            tip: 'Simple.',
          },
          {
            id: 'dyn-pic-es-3',
            english: 'Thank you! It turned out great!',
            native: '¡Muchas gracias! ¡Salió genial!',
            phonetic: 'MOO-chahs GRAH-syahs! sah-LYOH heh-NYAHL!',
            tip: 'Shows appreciation.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, could you take a photo of our family?',
            native: 'Disculpe, ¿nos puede tomar una foto?',
            phonetic: 'dees-KOOL-peh, nohs PWEH-deh toh-MAR OO-nah FOH-toh?',
          },
          {
            speaker: 'local',
            english: 'With pleasure! Smile!',
            native: '¡Con gusto! ¡Sonrían!',
            phonetic: 'kohn GOOS-toh! sohn-REE-ahn!',
          },
          {
            speaker: 'you',
            english: 'Thank you so much, how kind!',
            native: '¡Muchas gracias, qué amable!',
            phonetic: 'MOO-chahs GRAH-syahs, keh ah-MAH-bleh!',
          },
        ],
      },
    },

    directions: {
      th: {
        contextSummary: 'Politely asking for directions, transit, or the nearest restroom.',
        phrases: [
          {
            id: 'dyn-dir-th-1',
            english: 'Excuse me, where is the bathroom?',
            native: `ขอโทษนะ${p} ห้องน้ำอยู่ทางไหน${p}`,
            phonetic: `khor-thot na ${pp}, hong-naam yoo thaang nai ${pp}?`,
            tip: '"Hong-naam" = bathroom. Very polite and clear.',
          },
          {
            id: 'dyn-dir-th-2',
            english: 'Is the train station far from here?',
            native: `สถานีรถไฟไกลจากที่นี่ไหม${p}`,
            phonetic: `sa-thaa-nee rot-fai glai jaak tee-nee mai ${pp}?`,
            tip: 'Locals often point and tell you how many minutes it takes.',
          },
          {
            id: 'dyn-dir-th-3',
            english: 'Thank you so much for your help!',
            native: `ขอบคุณมากนะ${p} ช่วยได้มากเลย${p}`,
            phonetic: `khop-khun maak na ${pp}, chuai dai maak loei ${pp}!`,
            tip: 'Warm thanks.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, where is the nearest train station?',
            native: `ขอโทษนะ${p} สถานีรถไฟอยู่ทางไหน${p}`,
            phonetic: `khor-thot na ${pp}, sa-thaa-nee rot-fai yoo thaang nai ${pp}?`,
          },
          {
            speaker: 'local',
            english: 'Walk straight ahead, then turn left!',
            native: 'เดินตรงไปแล้วเลี้ยวซ้ายครับ',
            phonetic: 'doen trong pai laeo liao saai khrap!',
          },
          {
            speaker: 'you',
            english: 'Thank you so much! You are very kind.',
            native: `ขอบคุณมาก${p} คุณใจดีมาก${p}`,
            phonetic: `khop-khun maak ${pp}, khun jai-dee maak ${pp}!`,
          },
        ],
      },
      id: {
        contextSummary: 'Asking for directions, transit, or the restroom in Indonesian.',
        phrases: [
          {
            id: 'dyn-dir-id-1',
            english: 'Excuse me, where is the restroom?',
            native: 'Permisi, toiletnya di sebelah mana ya?',
            phonetic: 'per-MEE-see, toy-LET-nyah dee seh-beh-LAH MAH-nah yah?',
            tip: 'Polite and easy to understand everywhere.',
          },
          {
            id: 'dyn-dir-id-2',
            english: 'Is it far to walk from here?',
            native: 'Kalau jalan kaki dari sini jauh ya?',
            phonetic: 'KAH-low JAH-lahn KAH-kee DAH-ree SEE-nee JOW yah?',
            tip: '"Jalan kaki" means walking on foot.',
          },
          {
            id: 'dyn-dir-id-3',
            english: 'Thank you very much!',
            native: 'Terima kasih banyak!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk!',
            tip: 'Warm gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, which way to the station?',
            native: 'Permisi, stasiunnya di sebelah mana ya?',
            phonetic: 'per-MEE-see, stah-see-OON-nyah dee seh-beh-LAH MAH-nah yah?',
          },
          {
            speaker: 'local',
            english: 'Go straight ahead, it is very close!',
            native: 'Lurus saja, dekat kok!',
            phonetic: 'LOO-roos SAH-jah, deh-KAHT kohk!',
          },
          {
            speaker: 'you',
            english: 'Thank you so much, you are very kind!',
            native: 'Terima kasih banyak, Anda baik sekali!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk, AHN-dah bah-eek seh-KAH-lee!',
          },
        ],
      },
      it: {
        contextSummary: 'Asking politely for directions or a restroom in Italian.',
        phrases: [
          {
            id: 'dyn-dir-it-1',
            english: 'Excuse me, where is the restroom?',
            native: 'Mi scusi, dov’è il bagno?',
            phonetic: 'mee SKOO-zee, doh-VEH eel BAHN-yoh?',
            tip: 'Essential phrase in cafés and stations.',
          },
          {
            id: 'dyn-dir-it-2',
            english: 'Is the station far from here?',
            native: 'La stazione è lontana da qui?',
            phonetic: 'lah stah-TSYOH-neh eh lohn-TAH-nah dah kwee?',
            tip: 'Clear and polite.',
          },
          {
            id: 'dyn-dir-it-3',
            english: 'Thank you so much for your help!',
            native: 'Grazie mille per l’aiuto!',
            phonetic: 'GRAHT-syeh MEEL-leh per lah-YOO-toh!',
            tip: 'Warm thanks.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, where is the train station?',
            native: 'Mi scusi, dov’è la stazione?',
            phonetic: 'mee SKOO-zee, doh-VEH lah stah-TSYOH-neh?',
          },
          {
            speaker: 'local',
            english: 'Always straight ahead, five minutes on foot!',
            native: 'Sempre dritto, cinque minuti a piedi!',
            phonetic: 'SEM-preh DREET-toh, CHEEN-kweh mee-NOO-tee ah PYEH-dee!',
          },
          {
            speaker: 'you',
            english: 'Thank you, you are very kind!',
            native: 'Grazie mille, è davvero gentile!',
            phonetic: 'GRAHT-syeh MEEL-leh, eh dahv-VEH-roh jen-TEE-leh!',
          },
        ],
      },
      es: {
        contextSummary: 'Asking politely for directions or a restroom in Spanish.',
        phrases: [
          {
            id: 'dyn-dir-es-1',
            english: 'Excuse me, where is the bathroom?',
            native: 'Disculpe, ¿dónde está el baño?',
            phonetic: 'dees-KOOL-peh, DOHN-deh es-TAH el BAHN-yoh?',
            tip: 'Clear and polite everywhere.',
          },
          {
            id: 'dyn-dir-es-2',
            english: 'Is the station far from here?',
            native: '¿La estación está lejos de aquí?',
            phonetic: 'lah es-tah-SYOHN es-TAH LEH-hohs deh ah-KEE?',
            tip: 'Useful when walking with kids.',
          },
          {
            id: 'dyn-dir-es-3',
            english: 'Thank you very much for your help!',
            native: '¡Muchas gracias por su ayuda!',
            phonetic: 'MOO-chahs GRAH-syahs por soo ah-YOO-dah!',
            tip: 'Warm gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'you',
            english: 'Excuse me, where is the train station?',
            native: 'Disculpe, ¿dónde está la estación?',
            phonetic: 'dees-KOOL-peh, DOHN-deh es-TAH lah es-tah-SYOHN?',
          },
          {
            speaker: 'local',
            english: 'Walk straight ahead and turn right.',
            native: 'Camine derecho y doble a la derecha.',
            phonetic: 'kah-MEE-neh deh-REH-choh ee DOH-bleh ah lah deh-REH-chah.',
          },
          {
            speaker: 'you',
            english: 'Thank you so much, how kind!',
            native: '¡Muchas gracias, qué amable!',
            phonetic: 'MOO-chahs GRAH-syahs, keh ah-MAH-bleh!',
          },
        ],
      },
    },

    health: {
      th: {
        contextSummary: 'Getting help at a pharmacy or for a family member who feels unwell.',
        phrases: [
          {
            id: 'dyn-hlth-th-1',
            english: 'Excuse me, where is the nearest pharmacy?',
            native: `ขอโทษนะ${p} ร้านขายยาที่ใกล้ที่สุดอยู่ไหน${p}`,
            phonetic: `khor-thot na ${pp}, raan khaai yaa tee glai tee-sut yoo nai ${pp}?`,
            tip: '"Raan khaai yaa" = pharmacy.',
          },
          {
            id: 'dyn-hlth-th-2',
            english: 'Do you have medicine for a child’s fever / stomachache?',
            native: `มียาแก้ไข้ / ปวดท้องสำหรับเด็กไหม${p}`,
            phonetic: `mee yaa gae khai / puat thong sam-rap dek mai ${pp}?`,
            tip: 'Use "Show Screen" if needed so the pharmacist can read it clearly.',
          },
          {
            id: 'dyn-hlth-th-3',
            english: 'Thank you so much for helping our family.',
            native: `ขอบคุณมากๆ ที่ช่วยครอบครัวเรานะ${p}`,
            phonetic: `khop-khun maak-maak tee chuai khrop-khrua rao na ${pp}`,
            tip: 'Heartfelt gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello, how can I help you today?',
            native: 'สวัสดีค่ะ มีอะไรให้ช่วยคะ',
            phonetic: 'sa-wat-dee kha, mee a-rai hai chuai kha?',
          },
          {
            speaker: 'you',
            english: 'Our child has a mild fever. Do you have medicine for kids?',
            native: `ลูกมีไข้นิดหน่อย มียาสำหรับเด็กไหม${p}`,
            phonetic: `look mee khai nit-noi, mee yaa sam-rap dek mai ${pp}?`,
          },
          {
            speaker: 'local',
            english: 'Yes, let me get the gentle children’s syrup for you.',
            native: 'มีค่ะ เดี๋ยวจัดยาน้ำสำหรับเด็กให้นะคะ',
            phonetic: 'mee kha, diao jat yaa-naam sam-rap dek hai na kha.',
          },
        ],
      },
      id: {
        contextSummary: 'Asking at an Indonesian pharmacy ("Apotek") for family care.',
        phrases: [
          {
            id: 'dyn-hlth-id-1',
            english: 'Excuse me, where is the nearest pharmacy?',
            native: 'Permisi, apotek terdekat di mana ya?',
            phonetic: 'per-MEE-see, ah-poh-TEK ter-deh-KAHT dee MAH-nah yah?',
            tip: '"Apotek" = pharmacy.',
          },
          {
            id: 'dyn-hlth-id-2',
            english: 'Do you have fever / stomach medicine for children?',
            native: 'Ada obat demam atau sakit perut untuk anak-anak?',
            phonetic: 'AH-dah OH-baht deh-MAHM ah-TOW SAH-kit peh-ROOT oon-TOOK AH-nahk-AH-nahk?',
            tip: '"Obat" = medicine, "demam" = fever.',
          },
          {
            id: 'dyn-hlth-id-3',
            english: 'Thank you very much for your help.',
            native: 'Terima kasih banyak atas bantuannya!',
            phonetic: 'teh-ree-mah KAH-see BAHN-yahk AH-tahs bahn-too-AHN-nyah!',
            tip: 'Warm thanks.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello, what medicine are you looking for?',
            native: 'Halo, cari obat apa?',
            phonetic: 'HAH-loh, CHAH-ree OH-baht AH-pah?',
          },
          {
            speaker: 'you',
            english: 'Do you have gentle fever medicine for our child?',
            native: 'Ada obat demam untuk anak-anak?',
            phonetic: 'AH-dah OH-baht deh-MAHM oon-TOOK AH-nahk-AH-nahk?',
          },
          {
            speaker: 'local',
            english: 'Yes, we have children’s syrup right here.',
            native: 'Ada, ini sirup untuk anak.',
            phonetic: 'AH-dah, EE-nee SEE-roop oon-TOOK AH-nahk.',
          },
        ],
      },
      it: {
        contextSummary: 'Speaking with an Italian pharmacist ("Farmacia") for family health.',
        phrases: [
          {
            id: 'dyn-hlth-it-1',
            english: 'Excuse me, where is the nearest pharmacy?',
            native: 'Mi scusi, dov’è la farmacia più vicina?',
            phonetic: 'mee SKOO-zee, doh-VEH lah far-mah-CHEE-ah pyoo vee-CHEE-nah?',
            tip: 'Look for the glowing green cross in Italy.',
          },
          {
            id: 'dyn-hlth-it-2',
            english: 'Do you have something for a child’s fever?',
            native: 'Ha qualcosa per la febbre di un bambino?',
            phonetic: 'ah kwahl-KOH-zah per lah FEB-breh dee oon bahm-BEE-noh?',
            tip: 'Italian pharmacists are very knowledgeable and helpful.',
          },
          {
            id: 'dyn-hlth-it-3',
            english: 'Thank you so much for your help!',
            native: 'Grazie mille per il suo aiuto!',
            phonetic: 'GRAHT-syeh MEEL-leh per eel SOO-oh ah-YOO-toh!',
            tip: 'Warm gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Good morning, how can I help you?',
            native: 'Buongiorno, come posso aiutarLa?',
            phonetic: 'bwohn-JOHR-noh, KOH-meh POHS-soh ah-yoo-TAR-lah?',
          },
          {
            speaker: 'you',
            english: 'Do you have medicine for a child’s mild fever?',
            native: 'Ha qualcosa per la febbre di un bambino?',
            phonetic: 'ah kwahl-KOH-zah per lah FEB-breh dee oon bahm-BEE-noh?',
          },
          {
            speaker: 'local',
            english: 'Of course, this one is gentle for children.',
            native: 'Certamente, questo è adatto ai bambini.',
            phonetic: 'cher-tah-MEN-teh, KWEHS-toh eh ah-DAHT-toh eye bahm-BEE-nee.',
          },
        ],
      },
      es: {
        contextSummary: 'Asking at a Spanish pharmacy ("Farmacia") for family care.',
        phrases: [
          {
            id: 'dyn-hlth-es-1',
            english: 'Excuse me, where is the nearest pharmacy?',
            native: 'Disculpe, ¿dónde está la farmacia más cercana?',
            phonetic: 'dees-KOOL-peh, DOHN-deh es-TAH lah far-MAH-syah mahs ser-KAH-nah?',
            tip: '"Farmacia" = pharmacy.',
          },
          {
            id: 'dyn-hlth-es-2',
            english: 'Do you have medicine for a child’s fever?',
            native: '¿Tiene medicina para la fiebre de un niño?',
            phonetic: 'TYEH-neh meh-dee-SEE-nah PAH-rah lah FYEH-breh deh oon NEEN-yoh?',
            tip: 'Clear and polite.',
          },
          {
            id: 'dyn-hlth-es-3',
            english: 'Thank you very much for helping us!',
            native: '¡Muchas gracias por ayudarnos!',
            phonetic: 'MOO-chahs GRAH-syahs por ah-yoo-DAR-nohs!',
            tip: 'Warm gratitude.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello, how can I help you?',
            native: '¡Hola! ¿En qué le puedo ayudar?',
            phonetic: 'OH-lah! en keh leh PWEH-doh ah-yoo-DAR?',
          },
          {
            speaker: 'you',
            english: 'Do you have fever medicine for a child?',
            native: '¿Tiene medicina para la fiebre de un niño?',
            phonetic: 'TYEH-neh meh-dee-SEE-nah PAH-rah lah FYEH-breh deh oon NEEN-yoh?',
          },
          {
            speaker: 'local',
            english: 'Yes, here is a gentle syrup for children.',
            native: 'Sí, aquí tiene un jarabe para niños.',
            phonetic: 'see, ah-KEE TYEH-neh oon hah-RAH-beh PAH-rah NEEN-yohs.',
          },
        ],
      },
    },

    general: {
      th: {
        contextSummary: `Custom connection guide for: "${cleanTitle}"`,
        phrases: [
          {
            id: 'dyn-gen-th-1',
            english: 'Hello! I am still learning Thai, nice to meet you!',
            native: `สวัสดี${p} กำลังหัดพูดไทยอยู่ ยินดีที่ได้รู้จัก${p}`,
            phonetic: `sa-wat-dee ${pp}, gam-lang hat phoot Thai yoo, yin-dee tee dai roo-jak ${pp}`,
            tip: 'Opens any conversation with humility and warmth.',
          },
          {
            id: 'dyn-gen-th-2',
            english: 'We are here with our family — everyone is so friendly!',
            native: `เรามากับครอบครัว คนที่นี่ใจดีมากเลย${p}`,
            phonetic: `rao maa gap khrop-khrua, khon tee-nee jai-dee maak loei ${pp}`,
            tip: 'A genuine compliment that sparks conversation.',
          },
          {
            id: 'dyn-gen-th-3',
            english: 'Thank you for chatting with us! Have a wonderful day.',
            native: `ขอบคุณที่คุยด้วยนะ${p} ขอให้มีความสุข${p}`,
            phonetic: `khop-khun tee khui duai na ${pp}, khor hai mee khwaam-suk ${pp}!`,
            tip: 'Gracious closing.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Where are you visiting from?',
            native: 'สวัสดีครับ มาเที่ยวจากที่ไหนครับ',
            phonetic: 'sa-wat-dee khrap, maa thiao jaak tee-nai khrap?',
          },
          {
            speaker: 'you',
            english: 'We are from Singapore, visiting with family! I only speak a little Thai.',
            native: `มาจากสิงคโปร์กับครอบครัว${p} พูดไทยได้นิดหน่อย${p}`,
            phonetic: `maa jaak Sing-kha-poh gap khrop-khrua ${pp}, phoot Thai dai nit-noi ${pp}`,
          },
          {
            speaker: 'local',
            english: 'You speak very well! Welcome to Thailand!',
            native: 'พูดเก่งมากครับ ยินดีต้อนรับสู่เมืองไทยครับ',
            phonetic: 'phoot geng maak khrap! yin-dee ton-rap soo Mueang Thai khrap!',
          },
        ],
      },
      id: {
        contextSummary: `Custom connection guide for: "${cleanTitle}"`,
        phrases: [
          {
            id: 'dyn-gen-id-1',
            english: 'Hello! I am learning Indonesian, nice to meet you!',
            native: 'Halo! Saya sedang belajar bahasa Indonesia, senang bertemu!',
            phonetic: 'HAH-loh! SAH-yah seh-dahng beh-LAH-jar bah-HAH-sah In-doh-NEH-syah, seh-NAHNG ber-teh-MOO!',
            tip: 'Breaks the ice immediately.',
          },
          {
            id: 'dyn-gen-id-2',
            english: 'We are here with family and love the hospitality!',
            native: 'Kami bersama keluarga, orang di sini sangat ramah!',
            phonetic: 'KAH-mee ber-SAH-mah keh-loo-AR-gah, OH-rahng dee SEE-nee SAHNG-aht RAH-mah!',
            tip: 'Sincere and warm.',
          },
          {
            id: 'dyn-gen-id-3',
            english: 'Thank you for chatting with us!',
            native: 'Terima kasih sudah mengobrol dengan kami!',
            phonetic: 'teh-ree-mah KAH-see SOO-dah meng-OH-brohl deng-ahn KAH-mee!',
            tip: '"Mengobrol" means chatting casually.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! How long are you staying?',
            native: 'Halo! Berapa lama di sini?',
            phonetic: 'HAH-loh! beh-RAH-pah LAH-mah dee SEE-nee?',
          },
          {
            speaker: 'you',
            english: 'A few days with family! Everyone here is so kind.',
            native: 'Beberapa hari bersama keluarga! Orang di sini ramah sekali.',
            phonetic: 'beh-beh-RAH-pah HAH-ree ber-SAH-mah keh-loo-AR-gah! OH-rahng dee SEE-nee RAH-mah seh-KAH-lee.',
          },
          {
            speaker: 'local',
            english: 'Hope you have a wonderful time!',
            native: 'Semoga liburan Anda menyenangkan!',
            phonetic: 'seh-MOH-gah lee-BOO-rahn AHN-dah meh-nyen-AHNG-kahn!',
          },
        ],
      },
      it: {
        contextSummary: `Custom connection guide for: "${cleanTitle}"`,
        phrases: [
          {
            id: 'dyn-gen-it-1',
            english: 'Hello! I am learning Italian, nice to meet you!',
            native: 'Ciao! Sto imparando l’italiano, piacere di conoscerLa!',
            phonetic: 'CHOW! stoh eem-pah-RAHN-doh lee-tah-LYAH-noh, pyah-CHEH-reh dee koh-noh-SHER-lah!',
            tip: 'Friendly and humble.',
          },
          {
            id: 'dyn-gen-it-2',
            english: 'We are traveling as a family and loving every moment!',
            native: 'Viaggiamo in famiglia e ci piace tantissimo!',
            phonetic: 'vyahd-JAH-moh een fah-MEEL-yah eh chee PYAH-cheh tahn-TEES-see-moh!',
            tip: 'Warm connection.',
          },
          {
            id: 'dyn-gen-it-3',
            english: 'Thank you for your kindness, have a great day!',
            native: 'Grazie per la sua gentilezza, buona giornata!',
            phonetic: 'GRAHT-syeh per lah SOO-ah jen-tee-LET-sah, BWOH-nah johr-NAH-tah!',
            tip: 'Polite farewell.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! Are you enjoying your visit?',
            native: 'Buongiorno! Vi state divertendo?',
            phonetic: 'bwohn-JOHR-noh! vee STAH-teh dee-ver-TEN-doh?',
          },
          {
            speaker: 'you',
            english: 'Yes, very much! I am practicing my Italian too.',
            native: 'Sì, moltissimo! Sto anche praticando il mio italiano.',
            phonetic: 'see, mohl-TEES-see-moh! stoh AHN-keh prah-tee-KAHN-doh eel MEE-oh ee-tah-LYAH-noh.',
          },
          {
            speaker: 'local',
            english: 'Bravo! You are doing great!',
            native: 'Bravo! Parla già benissimo!',
            phonetic: 'BRAH-voh! PAR-lah jah beh-NEES-see-moh!',
          },
        ],
      },
      es: {
        contextSummary: `Custom connection guide for: "${cleanTitle}"`,
        phrases: [
          {
            id: 'dyn-gen-es-1',
            english: 'Hello! I am learning Spanish, nice to meet you!',
            native: '¡Hola! Estoy aprendiendo español, ¡mucho gusto!',
            phonetic: 'OH-lah! es-TOY ah-pren-DYEN-doh es-pah-NYOL, MOO-choh GOOS-toh!',
            tip: 'Invites encouragement.',
          },
          {
            id: 'dyn-gen-es-2',
            english: 'We are visiting with family and loving the culture!',
            native: 'Estamos de visita en familia y nos encanta su cultura.',
            phonetic: 'es-TAH-mohs deh vee-SEE-tah en fah-MEE-lyah ee nohs en-KAHN-tah soo kool-TOO-rah.',
            tip: 'Warm and sincere.',
          },
          {
            id: 'dyn-gen-es-3',
            english: 'Thank you for chatting with us!',
            native: '¡Muchas gracias por conversar con nosotros!',
            phonetic: 'MOO-chahs GRAH-syahs por kohn-ver-SAR kohn noh-SOH-trohs!',
            tip: 'Friendly closing.',
          },
        ],
        dialogue: [
          {
            speaker: 'local',
            english: 'Hello! How are you enjoying your trip?',
            native: '¡Hola! ¿Cómo la están pasando?',
            phonetic: 'OH-lah! KOH-moh lah es-TAHN pah-SAHN-doh?',
          },
          {
            speaker: 'you',
            english: 'Wonderful! Everyone is so warm and welcoming.',
            native: '¡De maravilla! Todos aquí son muy amables.',
            phonetic: 'deh mah-rah-VEE-yah! TOH-dohs ah-KEE sohn mwee ah-MAH-blehs.',
          },
          {
            speaker: 'local',
            english: 'Welcome anytime!',
            native: '¡Siempre bienvenidos!',
            phonetic: 'SYEM-preh byen-veh-NEE-dohs!',
          },
        ],
      },
    },
  };

  const chosen = templates[intent][language];
  return {
    id: `dyn-${intent}-${language}-${Date.now()}`,
    title: cleanTitle,
    ...chosen,
  };
}

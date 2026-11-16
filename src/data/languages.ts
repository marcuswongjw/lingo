import type { CategoryMeta, LanguageMeta, ReactionItem } from '../types';

export const LANGUAGES: LanguageMeta[] = [
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ภาษาไทย',
    flag: '🇹🇭',
    bcp47: 'th-TH',
    regionNote: 'Polite particles: ครับ (khrap) / ค่ะ (kha)',
    accentColor: '#C85A32',
    accentSoft: '#FBF0EB',
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    bcp47: 'id-ID',
    regionNote: 'Phonetic spelling — spoken warmly & directly',
    accentColor: '#B8433E',
    accentSoft: '#FCEEEE',
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    bcp47: 'it-IT',
    regionNote: 'Expressive, warm & welcoming',
    accentColor: '#2E6F5E',
    accentSoft: '#ECF5F2',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    bcp47: 'es-ES',
    regionNote: 'Friendly, rhythmic & widely understood',
    accentColor: '#C47D1A',
    accentSoft: '#FCF4E6',
  },
];

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'greetings',
    step: 1,
    title: 'Warm Greetings',
    subtitle: 'Open the door with respect and a smile',
    iconName: 'Smile',
  },
  {
    id: 'intro',
    step: 2,
    title: 'You & Your Family',
    subtitle: 'Share who you are and who you are with',
    iconName: 'Users',
  },
  {
    id: 'curiosity',
    step: 3,
    title: 'Genuine Curiosity',
    subtitle: 'Ask about them, their hometown & favorites',
    iconName: 'Compass',
  },
  {
    id: 'repair',
    step: 4,
    title: 'Humble Learner Kit',
    subtitle: 'Stay relaxed when you don’t catch everything',
    iconName: 'LifeBuoy',
  },
  {
    id: 'appreciation',
    step: 5,
    title: 'Warmth & Food Praise',
    subtitle: 'Compliments that brighten anyone’s day',
    iconName: 'Heart',
  },
  {
    id: 'goodbyes',
    step: 6,
    title: 'Kind Goodbyes',
    subtitle: 'Leave a warm, memorable impression',
    iconName: 'Sparkles',
  },
];

export const REACTIONS: ReactionItem[] = [
  {
    id: 'react-really',
    english: 'Really?!',
    emotion: 'Surprised & engaged',
    translations: {
      th: {
        native: 'จริงเหรอ{polite}',
        phonetic: 'jing ror {polite}?',
      },
      id: {
        native: 'Masa sih?! / Serius?',
        phonetic: 'mah-sah see / seh-ree-us?',
      },
      it: {
        native: 'Davvero?!',
        phonetic: 'dahv-VEH-roh?!',
      },
      es: {
        native: '¿De verdad? / ¿En serio?',
        phonetic: 'deh vehr-DAHD / en SEH-ryoh?',
      },
    },
  },
  {
    id: 'react-amazing',
    english: 'So wonderful / Cool!',
    emotion: 'Enthusiastic',
    translations: {
      th: {
        native: 'สุดยอดเลย{polite}',
        phonetic: 'sut yot loei {polite}!',
      },
      id: {
        native: 'Wah, keren sekali!',
        phonetic: 'wah, keh-ren seh-kah-lee!',
      },
      it: {
        native: 'Che bello! Fantastico!',
        phonetic: 'keh BEL-loh! fahn-TAHS-tee-koh!',
      },
      es: {
        native: '¡Qué maravilla! / ¡Genial!',
        phonetic: 'keh mah-rah-VEE-yah / heh-NYAHL!',
      },
    },
  },
  {
    id: 'react-delicious',
    english: 'So delicious!',
    emotion: 'Complimenting food',
    translations: {
      th: {
        native: 'อร่อยมาก{polite}',
        phonetic: 'a-roi maak {polite}!',
      },
      id: {
        native: 'Enak sekali!',
        phonetic: 'eh-nahk seh-kah-lee!',
      },
      it: {
        native: 'Buonissimo!',
        phonetic: 'bwoh-NEES-see-moh!',
      },
      es: {
        native: '¡Qué rico! ¡Delicioso!',
        phonetic: 'keh REE-koh! deh-lee-SYOH-soh!',
      },
    },
  },
  {
    id: 'react-kind',
    english: 'You are so kind!',
    emotion: 'Grateful',
    translations: {
      th: {
        native: 'คุณใจดีมากเลย{polite}',
        phonetic: 'khun jai dee maak loei {polite}',
      },
      id: {
        native: 'Anda baik sekali!',
        phonetic: 'ahn-dah bah-eek seh-kah-lee!',
      },
      it: {
        native: 'Sei gentilissimo!',
        nativeFemale: 'Sei gentilissima!',
        phonetic: 'say jen-tee-LEES-see-moh',
        phoneticFemale: 'say jen-tee-LEES-see-mah',
      },
      es: {
        native: '¡Qué amable es usted!',
        phonetic: 'keh ah-MAH-bleh es oos-TED!',
      },
    },
  },
  {
    id: 'react-thankyou',
    english: 'Thank you so much!',
    emotion: 'Warm thanks',
    translations: {
      th: {
        native: 'ขอบคุณมาก{polite}',
        phonetic: 'khop khun maak {polite}',
      },
      id: {
        native: 'Terima kasih banyak!',
        phonetic: 'teh-ree-mah kah-see bahn-yahk!',
      },
      it: {
        native: 'Grazie mille!',
        phonetic: 'GRAHT-syeh MEEL-leh!',
      },
      es: {
        native: '¡Muchas gracias!',
        phonetic: 'MOO-chahs GRAH-syahs!',
      },
    },
  },
  {
    id: 'react-understand',
    english: 'I see / Got it!',
    emotion: 'Following along',
    translations: {
      th: {
        native: 'เข้าใจแล้ว{polite}',
        phonetic: 'khao jai laeo {polite}',
      },
      id: {
        native: 'Oh, begitu! Mengerti.',
        phonetic: 'oh, beh-gee-too! meng-er-tee.',
      },
      it: {
        native: 'Ho capito!',
        phonetic: 'oh kah-PEE-toh!',
      },
      es: {
        native: '¡Ya entiendo!',
        phonetic: 'yah en-TYEN-doh!',
      },
    },
  },
];

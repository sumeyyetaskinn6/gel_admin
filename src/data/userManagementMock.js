/** Belge önizlemeleri için yer tutucu (gerçek API’de yükleme URL’leri kullanılır) */
export const MOCK_DOCUMENT_PLACEHOLDER = '/favicon.svg'

function baseUser(id, firstName, lastName, phone, email, gsm, gender, registeredAt) {
  return {
    id,
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    phone,
    email,
    gsm,
    gender,
    registeredAt,
  }
}

function driverProfile(base, vehicle) {
  return {
    ...base,
    iban: vehicle.iban,
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    vehicleYear: vehicle.year,
    vehicleColor: vehicle.color,
    plate: vehicle.plate,
    licenseFrontUrl: MOCK_DOCUMENT_PLACEHOLDER,
    licenseBackUrl: MOCK_DOCUMENT_PLACEHOLDER,
    registrationFrontUrl: MOCK_DOCUMENT_PLACEHOLDER,
    registrationBackUrl: MOCK_DOCUMENT_PLACEHOLDER,
    criminalRecordUrl: MOCK_DOCUMENT_PLACEHOLDER,
  }
}

function courierProfile(base, vehicle) {
  return {
    ...base,
    iban: vehicle.iban,
    vehicleType: vehicle.vehicleType,
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    vehicleYear: vehicle.year,
    vehicleColor: vehicle.color,
    licenseFrontUrl: MOCK_DOCUMENT_PLACEHOLDER,
    licenseBackUrl: MOCK_DOCUMENT_PLACEHOLDER,
    registrationFrontUrl: MOCK_DOCUMENT_PLACEHOLDER,
    registrationBackUrl: MOCK_DOCUMENT_PLACEHOLDER,
    criminalRecordUrl: MOCK_DOCUMENT_PLACEHOLDER,
    p1DocumentUrl: MOCK_DOCUMENT_PLACEHOLDER,
  }
}

export const MOCK_BY_ROLE = {
  driver: [
    driverProfile(
      baseUser('d1', 'Ahmet', 'Yılmaz', '+90 532 111 2233', 'ahmet.yilmaz@ornek.com', '+90 532 111 2233', 'Erkek', '2025-11-03'),
      {
        iban: 'TR12 0006 1000 0000 1234 56 78',
        brand: 'Ford',
        model: 'Focus',
        year: 2019,
        color: 'Gri',
        plate: '34 ABC 112',
      },
    ),
    driverProfile(
      baseUser('d2', 'Mehmet', 'Kaya', '+90 533 444 5566', 'mehmet.kaya@ornek.com', '+90 533 444 5566', 'Erkek', '2026-01-18'),
      {
        iban: 'TR33 0006 4000 1122 3344 55 66',
        brand: 'Renault',
        model: 'Clio',
        year: 2021,
        color: 'Beyaz',
        plate: '06 DEF 445',
      },
    ),
    driverProfile(
      baseUser('d3', 'Can', 'Öztürk', '+90 534 777 8899', 'can.ozturk@ornek.com', '+90 534 888 8899', 'Erkek', '2025-08-22'),
      {
        iban: 'TR45 0006 7011 8899 0012 34 56',
        brand: 'Volkswagen',
        model: 'Polo',
        year: 2020,
        color: 'Lacivert',
        plate: '34 GH 9012',
      },
    ),
    driverProfile(
      baseUser('d4', 'Burak', 'Şen', '+90 535 000 1122', 'burak.sen@ornek.com', '+90 535 000 1122', 'Erkek', '2024-12-09'),
      {
        iban: 'TR78 0006 2000 5566 7788 99 00',
        brand: 'Hyundai',
        model: 'i20',
        year: 2022,
        color: 'Kırmızı',
        plate: '41 JK 3344',
      },
    ),
    driverProfile(
      baseUser('d5', 'Emre', 'Polat', '+90 536 333 4455', 'emre.polat@ornek.com', '+90 536 333 4455', 'Erkek', '2026-03-01'),
      {
        iban: 'TR90 0006 3000 9988 7766 55 44',
        brand: 'Fiat',
        model: 'Egea',
        year: 2018,
        color: 'Siyah',
        plate: '35 LM 7788',
      },
    ),
    driverProfile(
      baseUser('d6', 'Kerem', 'Ak', '+90 537 666 7788', 'kerem.ak@ornek.com', '+90 537 666 7788', 'Erkek', '2025-05-14'),
      {
        iban: 'TR11 0006 5000 4433 2211 00 99',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        color: 'Gümüş',
        plate: '34 NP 5566',
      },
    ),
    driverProfile(
      baseUser('d7', 'Onur', 'Çelik', '+90 538 999 0011', 'onur.celik@ornek.com', '+90 538 999 0011', 'Erkek', '2026-02-27'),
      {
        iban: 'TR22 0006 8000 1122 3344 55 66',
        brand: 'Opel',
        model: 'Corsa',
        year: 2017,
        color: 'Turuncu',
        plate: '16 QR 9900',
      },
    ),
  ],
  courier: [
    courierProfile(
      baseUser('c1', 'Ali', 'Veli', '+90 541 222 3344', 'ali.veli@ornek.com', '+90 541 222 3344', 'Erkek', '2025-10-11'),
      {
        iban: 'TR44 0006 9000 8877 6655 44 33',
        vehicleType: 'Motosiklet',
        brand: 'Yamaha',
        model: 'NMAX',
        year: 2022,
        color: 'Mavi',
      },
    ),
    courierProfile(
      baseUser('c2', 'Veli', 'Demir', '+90 542 555 6677', 'veli.demir@ornek.com', '+90 542 555 6677', 'Erkek', '2026-01-05'),
      {
        iban: 'TR55 0006 1001 2233 4455 66 77',
        vehicleType: 'Scooter',
        brand: 'Honda',
        model: 'PCX 125',
        year: 2021,
        color: 'Beyaz',
      },
    ),
    courierProfile(
      baseUser('c3', 'Zeki', 'Koç', '+90 543 888 9900', 'zeki.koc@ornek.com', '+90 543 888 9900', 'Erkek', '2024-07-30'),
      {
        iban: 'TR66 0006 2002 3344 5566 77 88',
        vehicleType: 'Motosiklet',
        brand: 'Kymco',
        model: 'Agility 125',
        year: 2020,
        color: 'Siyah',
      },
    ),
  ],
  passenger: [
    baseUser('p1', 'Ayşe', 'Yıldız', '+90 551 111 2233', 'ayse.yildiz@ornek.com', '+90 551 111 2233', 'Kadın', '2025-09-02'),
    baseUser('p2', 'Fatma', 'Arslan', '+90 552 444 5566', 'fatma.arslan@ornek.com', '+90 552 444 5566', 'Kadın', '2026-02-14'),
    baseUser('p3', 'Zeynep', 'Güneş', '+90 553 777 8899', 'zeynep.gunes@ornek.com', '+90 553 777 8899', 'Kadın', '2025-12-20'),
    baseUser('p4', 'Elif', 'Kara', '+90 554 000 1122', 'elif.kara@ornek.com', '+90 554 000 1122', 'Kadın', '2026-03-28'),
  ],
}

const DEFAULT_LOC = { lat: 41.0082, lng: 28.9784 }

/** Canlı konum (mock): kullanıcı kimliğine göre harita merkezi */
export const MOCK_LIVE_LOCATION_BY_USER_ID = {
  d1: { lat: 41.0369, lng: 29.003 },
  d2: { lat: 41.0512, lng: 28.986 },
  d3: { lat: 40.992, lng: 29.028 },
  d4: { lat: 41.042, lng: 29.008 },
  d5: { lat: 41.015, lng: 28.96 },
  d6: { lat: 41.06, lng: 29.02 },
  d7: { lat: 40.98, lng: 28.97 },
  c1: { lat: 41.025, lng: 29.012 },
  c2: { lat: 41.048, lng: 28.995 },
  c3: { lat: 41.002, lng: 29.04 },
  p1: { lat: 41.033, lng: 29.001 },
  p2: { lat: 41.018, lng: 28.972 },
  p3: { lat: 41.055, lng: 29.018 },
  p4: { lat: 40.995, lng: 29.015 },
}

export function getMockLiveLocation(userId) {
  return MOCK_LIVE_LOCATION_BY_USER_ID[userId] ?? DEFAULT_LOC
}

/** Sürücü: geçmiş yolculuklar */
export const MOCK_DRIVER_TRIPS_BY_USER_ID = {
  d1: [
    { id: 't1', date: '2026-03-28', route: 'Kadıköy → Beşiktaş', amount: '185 ₺' },
    { id: 't2', date: '2026-03-27', route: 'Ataşehir → Sabiha Gökçen', amount: '420 ₺' },
    { id: 't3', date: '2026-03-25', route: 'Üsküdar → Taksim', amount: '210 ₺' },
  ],
  d2: [
    { id: 't1', date: '2026-03-29', route: 'Bakırköy → Fatih', amount: '165 ₺' },
    { id: 't2', date: '2026-03-26', route: 'Şişli → Kadıköy', amount: '240 ₺' },
  ],
  d3: [{ id: 't1', date: '2026-03-20', route: 'Maltepe → Kartal', amount: '95 ₺' }],
  d4: [
    { id: 't1', date: '2026-03-15', route: 'Sarıyer → Levent', amount: '320 ₺' },
    { id: 't2', date: '2026-03-10', route: 'Pendik → Kadıköy', amount: '275 ₺' },
  ],
  d5: [{ id: 't1', date: '2026-03-29', route: 'Zeytinburnu → Mecidiyeköy', amount: '198 ₺' }],
  d6: [
    { id: 't1', date: '2026-03-22', route: 'Beylikdüzü → Avcılar', amount: '120 ₺' },
    { id: 't2', date: '2026-03-18', route: 'Avcılar → Taksim', amount: '310 ₺' },
  ],
  d7: [{ id: 't1', date: '2026-03-12', route: 'Çatalca → Halkalı', amount: '450 ₺' }],
}

/** Kurye: geçmiş teslimatlar */
export const MOCK_COURIER_DELIVERIES_BY_USER_ID = {
  c1: [
    { id: 'del1', date: '2026-03-29', address: 'Moda, Caferağa Mah. No: 12', status: 'Teslim edildi' },
    { id: 'del2', date: '2026-03-28', address: 'Fenerbahçe, Bağdat Cad.', status: 'Teslim edildi' },
    { id: 'del3', date: '2026-03-27', address: 'Göztepe, Merdivenköy', status: 'Teslim edildi' },
  ],
  c2: [
    { id: 'del1', date: '2026-03-29', address: 'Beşiktaş, Abbasağa', status: 'Teslim edildi' },
    { id: 'del2', date: '2026-03-26', address: 'Ortaköy, Dereboyu', status: 'Teslim edildi' },
  ],
  c3: [{ id: 'del1', date: '2026-03-20', address: 'Ümraniye, Site Mah.', status: 'Teslim edildi' }],
}

/** Yolcu: kurye gönderileri */
export const MOCK_PASSENGER_SENDS_BY_USER_ID = {
  p1: [
    { id: 's1', date: '2026-03-25', item: 'Paket (küçük)', address: 'Kadıköy → Karaköy', status: 'Teslim edildi' },
    { id: 's2', date: '2026-03-18', item: 'Evrak', address: 'Acıbadem → Levent', status: 'Teslim edildi' },
  ],
  p2: [{ id: 's1', date: '2026-03-22', item: 'Yemek', address: 'Nişantaşı → Bebek', status: 'Teslim edildi' }],
  p3: [
    { id: 's1', date: '2026-03-28', item: 'Paket', address: 'Ataşehir → Üsküdar', status: 'Teslim edildi' },
    { id: 's2', date: '2026-03-01', item: 'Koli', address: 'Maltepe → Kadıköy', status: 'Teslim edildi' },
  ],
  p4: [],
}

/** Yolcu: yolculuklar */
export const MOCK_PASSENGER_RIDES_BY_USER_ID = {
  p1: [
    { id: 'r1', date: '2026-03-29', route: 'Bostancı → Kadıköy İskelesi', amount: '95 ₺' },
    { id: 'r2', date: '2026-03-24', route: 'Kadıköy → Sabiha Gökçen', amount: '380 ₺' },
  ],
  p2: [
    { id: 'r1', date: '2026-03-27', route: 'Taksim → Şişli', amount: '75 ₺' },
    { id: 'r2', date: '2026-03-15', route: 'Fatih → Zeytinburnu', amount: '110 ₺' },
  ],
  p3: [{ id: 'r1', date: '2026-03-28', route: 'Üsküdar → Çamlıca', amount: '120 ₺' }],
  p4: [
    { id: 'r1', date: '2026-03-26', route: 'Beyoğlu → Kadıköy', amount: '195 ₺' },
    { id: 'r2', date: '2026-03-10', route: 'Kadıköy → Maltepe', amount: '85 ₺' },
  ],
}

export const VALID_ROLES = ['driver', 'courier', 'passenger']

export function findUser(role, userId) {
  const list = MOCK_BY_ROLE[role]
  if (!list) return null
  return list.find((u) => u.id === userId) ?? null
}

export function formatKayitTarihi(isoDate) {
  const d = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return d.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

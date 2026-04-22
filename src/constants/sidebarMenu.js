/**
 * Sidebar bölümleri. `title: null` olan bölüm başlıksız ana menüdür.
 * Mobil uygulama altındaki öğeler ileride genişletilebilir.
 */
export const sidebarSections = [
  {
    title: null,
    items: [
      { label: 'Bölgesel dağılım', path: '/dashboard/regional-distribution' },
      { label: 'Anasayfa', path: '/dashboard/transactions' },
      { label: 'Sürücü / Kurye Onayı', path: '/dashboard/driver-courier-approval' },
      { label: 'Yolculuk / Teslimat Takibi', path: '/dashboard/delivery-tracking' },
      { label: 'Geçmiş Yolculuk / Teslimat Kayıtları', path: '/dashboard/history-records' },
      { label: 'Kullanıcı Yönetimi', path: '/dashboard/user-management' },
      { label: 'Puan & Şikayet Yönetimi', path: '/dashboard/rating-complaint' },
    ],
  },
  {
    title: 'Mobil uygulama',
    items: [
      { label: 'SSS yönetimi', path: '/dashboard/app/faq' },
      { label: 'Araç bilgileri', path: '/dashboard/app/vehicles' },
      { label: 'Sözleşmeler', path: '/dashboard/app/contracts' },
      { label: 'Ücret & indirim ayarları', path: '/dashboard/app/pricing-settings' },
    ],
  },
]

/** Tüm rotalar (geriye dönük kullanım için) */
export const sidebarMenu = sidebarSections.flatMap((s) => s.items)

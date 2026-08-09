import type { Language, LocalizedText } from "@/lib/types";

const t = (en: string, ru: string, id: string, ar: string, tr: string): LocalizedText => ({ en, ru, id, ar, tr });

export const UI_COPY = {
  chooseLanguage: t("Choose your language", "Выбери язык", "Pilih bahasamu", "اختاري لغتك", "Dilini seç"),
  languageHint: t("You can change it later without losing your answers.", "Его можно изменить позже без потери ответов.", "Kamu bisa menggantinya nanti tanpa kehilangan jawaban.", "يمكنك تغييره لاحقاً من دون فقدان الإجابات.", "Cevaplarını kaybetmeden daha sonra değiştirebilirsin."),
  welcomeEyebrow: t("A private invitation", "Личное приглашение", "Undangan pribadi", "دعوة خاصة", "Özel bir davet"),
  welcomeTitle: t("Hi, {name}.", "Привет, {name}.", "Hai, {name}.", "مرحباً، {name}.", "Merhaba, {name}."),
  welcomeBody: t(
    "Naim likes talking to you. He also takes relationships seriously. This small experience helps both of you understand whether your values, communication styles, and future plans fit before either person gets attached. There is no automatic pass or fail. Naim reads your answers himself.",
    "Наиму нравится общаться с тобой. Он также серьёзно относится к отношениям. Этот небольшой опыт поможет вам понять, совпадают ли ваши ценности, стиль общения и планы на будущее, прежде чем появится сильная привязанность. Автоматического результата нет. Наим читает ответы сам.",
    "Naim senang berbicara denganmu. Dia juga serius tentang hubungan. Pengalaman singkat ini membantu kalian memahami apakah nilai, gaya komunikasi, dan rencana masa depan cocok sebelum salah satu terlalu terikat. Tidak ada lulus atau gagal otomatis. Naim membaca jawabanmu sendiri.",
    "يحب نعيم الحديث معك، كما أنه يتعامل مع العلاقات بجدية. تساعدكما هذه التجربة القصيرة على فهم مدى توافق القيم وأسلوب التواصل وخطط المستقبل قبل التعلق. لا توجد نتيجة تلقائية. يقرأ نعيم إجاباتك بنفسه.",
    "Naim seninle konuşmayı seviyor ve ilişkilere ciddi yaklaşıyor. Bu kısa deneyim, fazla bağlanmadan önce değerlerinizin, iletişim tarzınızın ve gelecek planlarınızın uyup uymadığını anlamanıza yardımcı olur. Otomatik geçme veya kalma yoktur. Cevaplarını Naim kendisi okur.",
  ),
  honestBeats: t("Honest answers are more useful than impressive ones.", "Честные ответы полезнее впечатляющих.", "Jawaban jujur lebih berguna daripada jawaban yang mengesankan.", "الإجابات الصادقة أنفع من المبهرة.", "Dürüst cevaplar etkileyici cevaplardan daha değerlidir."),
  curious: t("I’m curious", "Мне интересно", "Aku penasaran", "أنا مهتمة", "Merak ediyorum"),
  notForMe: t("Not for me", "Это не для меня", "Bukan untukku", "هذا ليس لي", "Bana göre değil"),
  allGood: t("All good. Thank you for being clear. Take care.", "Всё в порядке. Спасибо за ясность. Береги себя.", "Tidak apa-apa. Terima kasih sudah jujur. Jaga dirimu.", "لا بأس. شكراً على الوضوح. اعتني بنفسك.", "Sorun değil. Açık olduğun için teşekkür ederim. Kendine iyi bak."),
  consentTitle: t("Before we begin", "Перед началом", "Sebelum mulai", "قبل أن نبدأ", "Başlamadan önce"),
  consentBody: t(
    "Your progress, saved answers, answer changes, and meaningful actions inside this experience are privately visible to Naim, even if you leave before finishing. The site does not record your keystrokes, passwords, private device data, mouse coordinates, or anything outside this page. You can return later or permanently delete your answers and activity.",
    "Твой прогресс, сохранённые ответы, изменения ответов и важные действия внутри этого опыта будут видны Наиму, даже если ты уйдёшь до завершения. Сайт не записывает нажатия клавиш, пароли, данные устройства, движения мыши или что-либо вне этой страницы. Ты можешь вернуться позже или навсегда удалить ответы и активность.",
    "Progres, jawaban tersimpan, perubahan jawaban, dan tindakan bermakna di dalam pengalaman ini terlihat secara pribadi oleh Naim, meski kamu keluar sebelum selesai. Situs ini tidak merekam tombol yang kamu tekan, kata sandi, data pribadi perangkat, koordinat mouse, atau apa pun di luar halaman ini. Kamu bisa kembali nanti atau menghapus jawaban dan aktivitas secara permanen.",
    "سيتمكن نعيم من رؤية تقدمك وإجاباتك المحفوظة وتغييرات الإجابات والإجراءات المهمة داخل هذه التجربة، حتى إن غادرت قبل الإكمال. لا يسجل الموقع ضغطات المفاتيح أو كلمات المرور أو بيانات الجهاز الخاصة أو حركة الفأرة أو أي شيء خارج هذه الصفحة. يمكنك العودة لاحقاً أو حذف إجاباتك ونشاطك نهائياً.",
    "Bu deneyimdeki ilerlemen, kaydedilmiş cevapların, cevap değişikliklerin ve anlamlı işlemlerin, bitirmeden ayrılsan bile Naim tarafından özel olarak görülebilir. Site tuş vuruşlarını, şifreleri, özel cihaz verilerini, fare koordinatlarını veya bu sayfanın dışındaki hiçbir şeyi kaydetmez. Daha sonra dönebilir veya cevaplarını ve etkinliğini kalıcı olarak silebilirsin.",
  ),
  consentAccept: t("I understand and want to continue", "Я понимаю и хочу продолжить", "Aku mengerti dan ingin melanjutkan", "أفهم وأريد المتابعة", "Anlıyorum ve devam etmek istiyorum"),
  consentDecline: t("Leave without starting", "Уйти, не начиная", "Keluar tanpa memulai", "المغادرة من دون البدء", "Başlamadan çık"),
  meetTitle: t("Meet Naim", "Познакомься с Наимом", "Kenali Naim", "تعرفي إلى نعيم", "Naim'i tanı"),
  knowTitle: t("What you should know", "Что тебе стоит знать", "Yang perlu kamu tahu", "ما ينبغي أن تعرفيه", "Bilmen gerekenler"),
  knowBody: t(
    "Naim gives a lot when he cares. He likes regular contact, direct answers, affection, and clear loyalty. Silence and uncertainty sometimes make him overthink. In past relationships, he sometimes responded with too many messages or questions. He is working on pausing, respecting space, asking once, and trusting consistent behavior instead of requesting immediate proof. He wants someone warm enough to reassure him and strong enough to tell him calmly when he is being unfair.",
    "Наим много отдаёт, когда ему не всё равно. Ему важны регулярный контакт, прямые ответы, нежность и ясная верность. Молчание и неопределённость иногда заставляют его слишком много думать. Раньше он порой отправлял слишком много сообщений или вопросов. Сейчас он учится делать паузу, уважать пространство, спрашивать один раз и доверять последовательному поведению вместо немедленных доказательств. Ему нужна женщина, достаточно тёплая для поддержки и достаточно сильная, чтобы спокойно сказать, когда он несправедлив.",
    "Naim memberi banyak saat dia peduli. Dia menyukai komunikasi teratur, jawaban langsung, kasih sayang, dan kesetiaan yang jelas. Diam dan ketidakpastian kadang membuatnya terlalu banyak berpikir. Dalam hubungan sebelumnya, dia terkadang merespons dengan terlalu banyak pesan atau pertanyaan. Dia sedang belajar berhenti sejenak, menghormati ruang, bertanya sekali, dan mempercayai perilaku yang konsisten daripada meminta bukti langsung. Dia ingin seseorang yang cukup hangat untuk menenangkannya dan cukup kuat untuk mengatakan dengan tenang saat dia tidak adil.",
    "يعطي نعيم كثيراً عندما يهتم. يحب التواصل المنتظم والإجابات المباشرة والمودة والوفاء الواضح. قد يدفعه الصمت وعدم اليقين إلى الإفراط في التفكير. في علاقات سابقة، كان يرسل أحياناً رسائل أو أسئلة كثيرة. يعمل الآن على التوقف واحترام المساحة والسؤال مرة واحدة والثقة بالسلوك المتسق بدلاً من طلب إثبات فوري. يريد امرأة دافئة بما يكفي لطمأنته وقوية بما يكفي لتخبره بهدوء عندما يكون غير منصف.",
    "Naim önemsediğinde çok şey verir. Düzenli iletişim, doğrudan cevaplar, sevgi ve açık sadakat ister. Sessizlik ve belirsizlik bazen fazla düşünmesine yol açar. Geçmiş ilişkilerinde bazen çok fazla mesaj veya soru gönderdi. Şimdi durmayı, alana saygı duymayı, bir kez sormayı ve anlık kanıt yerine tutarlı davranışa güvenmeyi öğreniyor. Onu sakinleştirecek kadar sıcak, haksız olduğunda sakince söyleyecek kadar güçlü birini istiyor.",
  ),
  continue: t("Continue", "Продолжить", "Lanjutkan", "متابعة", "Devam et"),
  back: t("Back", "Назад", "Kembali", "رجوع", "Geri"),
  next: t("Next", "Дальше", "Berikutnya", "التالي", "İleri"),
  saveStatus: t("Saved privately", "Сохранено приватно", "Tersimpan secara pribadi", "محفوظ بشكل خاص", "Özel olarak kaydedildi"),
  saving: t("Saving...", "Сохранение...", "Menyimpan...", "جارٍ الحفظ...", "Kaydediliyor..."),
  required: t("Please answer before continuing.", "Ответь, пожалуйста, прежде чем продолжить.", "Silakan jawab sebelum melanjutkan.", "يرجى الإجابة قبل المتابعة.", "Devam etmeden önce cevapla."),
  tooShort: t("A little more detail would help.", "Добавь немного деталей.", "Sedikit lebih banyak detail akan membantu.", "المزيد من التفاصيل سيكون مفيداً.", "Biraz daha ayrıntı yardımcı olur."),
  submit: t("Send my answers", "Отправить мои ответы", "Kirim jawabanku", "إرسال إجاباتي", "Cevaplarımı gönder"),
  submittedTitle: t("Thank you for being honest.", "Спасибо за честность.", "Terima kasih sudah jujur.", "شكراً على صراحتك.", "Dürüst olduğun için teşekkür ederim."),
  submittedBody: t(
    "There is no automatic result here. Naim will read your answers himself and speak with you directly. Nothing here creates a promise or relationship. It gives both of you a clearer place to start.",
    "Здесь нет автоматического результата. Наим сам прочитает ответы и поговорит с тобой напрямую. Это не создаёт обещаний или отношений. Это лишь даёт вам более ясную точку для начала.",
    "Tidak ada hasil otomatis. Naim akan membaca jawabanmu sendiri dan berbicara langsung denganmu. Ini tidak menciptakan janji atau hubungan. Ini memberi kalian titik awal yang lebih jelas.",
    "لا توجد نتيجة تلقائية. سيقرأ نعيم إجاباتك بنفسه ويتحدث معك مباشرة. لا ينشئ هذا وعداً أو علاقة، بل يمنحكما نقطة بداية أوضح.",
    "Burada otomatik sonuç yok. Naim cevaplarını kendisi okuyacak ve seninle doğrudan konuşacak. Bu, bir söz veya ilişki oluşturmaz. Yalnızca daha net bir başlangıç noktası verir.",
  ),
  delete: t("Delete my answers", "Удалить мои ответы", "Hapus jawabanku", "حذف إجاباتي", "Cevaplarımı sil"),
  deleteTitle: t("Delete everything?", "Удалить всё?", "Hapus semuanya?", "حذف كل شيء؟", "Her şeyi sil?"),
  deleteBody: t("This permanently removes your answers and activity from Naim’s dashboard. This cannot be undone.", "Это навсегда удалит твои ответы и активность из панели Наима. Отменить действие нельзя.", "Ini menghapus jawaban dan aktivitasmu secara permanen dari dasbor Naim. Tindakan ini tidak bisa dibatalkan.", "سيؤدي هذا إلى إزالة إجاباتك ونشاطك نهائياً من لوحة نعيم. لا يمكن التراجع.", "Bu işlem cevaplarını ve etkinliğini Naim'in panelinden kalıcı olarak siler. Geri alınamaz."),
  confirmDelete: t("Permanently delete", "Удалить навсегда", "Hapus permanen", "حذف نهائي", "Kalıcı olarak sil"),
  cancel: t("Cancel", "Отмена", "Batal", "إلغاء", "İptal"),
  deletedTitle: t("Your information was deleted.", "Твоя информация удалена.", "Informasimu sudah dihapus.", "تم حذف معلوماتك.", "Bilgilerin silindi."),
  expired: t("This private invitation has expired.", "Это личное приглашение истекло.", "Undangan pribadi ini sudah kedaluwarsa.", "انتهت صلاحية هذه الدعوة الخاصة.", "Bu özel davetin süresi doldu."),
  invalid: t("This invitation is invalid or no longer available.", "Это приглашение недействительно или больше недоступно.", "Undangan ini tidak valid atau sudah tidak tersedia.", "هذه الدعوة غير صالحة أو لم تعد متاحة.", "Bu davet geçersiz veya artık kullanılamıyor."),
  retry: t("Try again", "Попробовать снова", "Coba lagi", "حاولي مجدداً", "Tekrar dene"),
  changeLanguage: t("Language", "Язык", "Bahasa", "اللغة", "Dil"),
  progress: t("Your progress", "Твой прогресс", "Progresmu", "تقدمك", "İlerlemen"),
};

export const PROFILE_TRAITS: LocalizedText[] = [
  t("Serious about relationships", "Серьёзно относится к отношениям", "Serius tentang hubungan", "جاد في العلاقات", "İlişkiler konusunda ciddi"),
  t("Affectionate and expressive", "Нежный и открытый", "Penyayang dan ekspresif", "حنون ومعبّر", "Sevecen ve duygularını gösteren"),
  t("Muslim and faith-centered", "Мусульманин, вера важна", "Muslim dan berpusat pada iman", "مسلم ومحوره الدين", "Müslüman ve inanç odaklı"),
  t("Ambitious and future-focused", "Амбициозный и думает о будущем", "Ambisius dan fokus pada masa depan", "طموح ويركز على المستقبل", "Hırslı ve gelecek odaklı"),
  t("Values loyalty and regular communication", "Ценит верность и регулярное общение", "Menghargai kesetiaan dan komunikasi teratur", "يقدر الوفاء والتواصل المنتظم", "Sadakati ve düzenli iletişimi önemser"),
  t("Wants marriage and family if compatibility grows", "Хочет брака и семьи при совместимости", "Menginginkan pernikahan dan keluarga jika cocok", "يريد الزواج والأسرة إذا وجد التوافق", "Uyum gelişirse evlilik ve aile ister"),
];

export function uiText(value: LocalizedText, language: Language, replacements?: Record<string, string>) {
  let result = value[language] || value.en;
  if (replacements) {
    for (const [key, replacement] of Object.entries(replacements)) {
      result = result.replaceAll(`{${key}}`, replacement);
    }
  }
  return result;
}

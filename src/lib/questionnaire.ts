import type {
  AnswerValue,
  ChapterDefinition,
  Language,
  LocalizedText,
  QuestionDefinition,
  QuestionOption,
  StoredAnswer,
} from "@/lib/types";

const t = (en: string, ru: string, id: string, ar: string, tr: string): LocalizedText => ({ en, ru, id, ar, tr });

const option = (
  id: string,
  label: LocalizedText,
  config: Omit<QuestionOption, "id" | "label"> = {},
): QuestionOption => ({ id, label, ...config });

export const CHAPTERS: ChapterDefinition[] = [
  {
    id: "intent",
    eyebrow: t("Part 1", "Часть 1", "Bagian 1", "الجزء 1", "Bölüm 1"),
    title: t("What are we looking for?", "Чего мы ищем?", "Apa yang kita cari?", "ماذا نبحث عنه؟", "Ne arıyoruz?"),
    description: t(
      "Intent, pace, and what commitment means before promises get big.",
      "Намерения, темп и смысл обязательств до серьёзных обещаний.",
      "Niat, tempo, dan arti komitmen sebelum janji menjadi besar.",
      "النية والوتيرة ومعنى الالتزام قبل أن تكبر الوعود.",
      "Niyet, tempo ve büyük sözlerden önce bağlılığın anlamı.",
    ),
  },
  {
    id: "connection",
    eyebrow: t("Part 2", "Часть 2", "Bagian 2", "الجزء 2", "Bölüm 2"),
    title: t("How do you stay close?", "Как вы сохраняете близость?", "Bagaimana kamu menjaga kedekatan?", "كيف تحافظين على القرب؟", "Yakınlığı nasıl korursun?"),
    description: t(
      "Affection, independence, calls, and the everyday rhythm of a relationship.",
      "Нежность, самостоятельность, звонки и повседневный ритм отношений.",
      "Kasih sayang, kemandirian, telepon, dan ritme hubungan sehari-hari.",
      "المودة والاستقلال والمكالمات وإيقاع العلاقة اليومي.",
      "Sevgi, bağımsızlık, aramalar ve ilişkinin günlük ritmi.",
    ),
  },
  {
    id: "conflict",
    eyebrow: t("Part 3", "Часть 3", "Bagian 3", "الجزء 3", "Bölüm 3"),
    title: t("When the vibe is off", "Когда что-то не так", "Saat suasana terasa salah", "عندما لا تكون الأمور بخير", "Bir şeyler ters gittiğinde"),
    description: t(
      "How you protect respect while hurt, afraid, tired, or angry.",
      "Как сохранить уважение, когда больно, страшно, тяжело или обидно.",
      "Cara menjaga rasa hormat saat terluka, takut, lelah, atau marah.",
      "كيف تحافظين على الاحترام عند الألم أو الخوف أو التعب أو الغضب.",
      "Kırgın, korkmuş, yorgun veya öfkeliyken saygıyı nasıl korursun.",
    ),
  },
  {
    id: "faith",
    eyebrow: t("Part 4", "Часть 4", "Bagian 4", "الجزء 4", "Bölüm 4"),
    title: t("Faith and boundaries", "Вера и границы", "Iman dan batasan", "الدين والحدود", "İnanç ve sınırlar"),
    description: t(
      "Shared principles around Islam, loyalty, friendships, and social media.",
      "Общие принципы веры, верности, дружбы и социальных сетей.",
      "Prinsip bersama tentang Islam, kesetiaan, pertemanan, dan media sosial.",
      "المبادئ المشتركة حول الإسلام والوفاء والصداقات ووسائل التواصل.",
      "İslam, sadakat, arkadaşlıklar ve sosyal medya hakkındaki ortak ilkeler.",
    ),
  },
  {
    id: "future",
    eyebrow: t("Part 5", "Часть 5", "Bagian 5", "الجزء 5", "Bölüm 5"),
    title: t("Real life together", "Настоящая совместная жизнь", "Kehidupan nyata bersama", "الحياة الحقيقية معاً", "Birlikte gerçek hayat"),
    description: t(
      "Work, country, children, money, parents, and the shape of daily life.",
      "Работа, страна, дети, деньги, родители и устройство повседневной жизни.",
      "Pekerjaan, negara, anak, uang, orang tua, dan bentuk kehidupan sehari-hari.",
      "العمل والبلد والأطفال والمال والوالدان وشكل الحياة اليومية.",
      "İş, ülke, çocuklar, para, aile ve günlük hayatın yapısı.",
    ),
  },
  {
    id: "honesty",
    eyebrow: t("Part 6", "Часть 6", "Bagian 6", "الجزء 6", "Bölüm 6"),
    title: t("Your honest answer", "Твой честный ответ", "Jawaban jujurmu", "إجابتك الصادقة", "Dürüst cevabın"),
    description: t(
      "No plot twist. Say what feels easy, difficult, and worth discussing.",
      "Без сюрпризов. Скажи, что кажется лёгким, трудным и достойным обсуждения.",
      "Tidak ada kejutan. Katakan apa yang terasa mudah, sulit, dan perlu dibicarakan.",
      "لا مفاجآت. قولي ما يبدو سهلاً وصعباً وما يستحق النقاش.",
      "Sürpriz yok. Kolay, zor ve konuşmaya değer gelen şeyleri söyle.",
    ),
  },
];

export const QUESTIONS: QuestionDefinition[] = [
  {
    id: "gate_age",
    chapter: "gate",
    type: "single",
    gate: true,
    required: true,
    prompt: t("Are you at least 18 years old?", "Тебе уже исполнилось 18 лет?", "Apakah kamu sudah berusia setidaknya 18 tahun?", "هل عمرك 18 سنة على الأقل؟", "En az 18 yaşında mısın?"),
    options: [
      option("yes", t("Yes", "Да", "Ya", "نعم", "Evet"), { scores: { honesty_self_awareness: 100 } }),
      option("no", t("No", "Нет", "Tidak", "لا", "Hayır"), { hardStop: "underage", flags: ["hard:underage"] }),
    ],
  },
  {
    id: "gate_interest",
    chapter: "gate",
    type: "single",
    gate: true,
    required: true,
    prompt: t("Do you want to continue getting to know Naim?", "Ты хочешь продолжить узнавать Наима?", "Apakah kamu ingin terus mengenal Naim?", "هل تريدين الاستمرار في التعرف إلى نعيم؟", "Naim'i tanımaya devam etmek istiyor musun?"),
    options: [
      option("serious", t("Yes, I am interested", "Да, мне интересно", "Ya, aku tertarik", "نعم، أنا مهتمة", "Evet, ilgileniyorum"), { scores: { intent_pace: 100 } }),
      option("slow", t("I am interested, but I want to move slowly", "Мне интересно, но я хочу двигаться медленно", "Aku tertarik, tetapi ingin berjalan pelan", "أنا مهتمة، لكن أريد التقدم ببطء", "İlgileniyorum ama yavaş ilerlemek istiyorum"), { scores: { intent_pace: 100, honesty_self_awareness: 100 } }),
      option("friendship", t("I only want friendship", "Я хочу только дружбу", "Aku hanya ingin berteman", "أريد الصداقة فقط", "Yalnızca arkadaşlık istiyorum"), { hardStop: "friendship", flags: ["hard:friendship_only"] }),
      option("casual", t("I only want something casual", "Я хочу только лёгкое общение", "Aku hanya ingin sesuatu yang santai", "أريد شيئاً عابراً فقط", "Yalnızca gündelik bir şey istiyorum"), { hardStop: "casual", flags: ["hard:casual_only"] }),
      option("no", t("No", "Нет", "Tidak", "لا", "Hayır"), { hardStop: "not_interested", flags: ["hard:not_interested"] }),
    ],
  },
  {
    id: "serious_outlook",
    chapter: "gate",
    type: "single",
    gate: true,
    required: true,
    prompt: t(
      "Based on what you know so far, are you open to exploring whether Naim could fit as a future husband and father, rather than only a fun person to talk to?",
      "С учётом того, что ты уже знаешь, готова ли ты понять, подходит ли Наим как будущий муж и отец, а не только как приятный собеседник?",
      "Berdasarkan yang kamu tahu sejauh ini, apakah kamu terbuka untuk melihat apakah Naim cocok sebagai calon suami dan ayah, bukan hanya teman mengobrol yang menyenangkan?",
      "بناءً على ما تعرفينه حتى الآن، هل أنت منفتحة على معرفة ما إذا كان نعيم مناسباً كزوج وأب مستقبلي، وليس مجرد شخص ممتع للحديث؟",
      "Şimdiye kadar bildiklerine göre Naim'in yalnızca keyifli bir sohbet arkadaşı değil, gelecekte eş ve baba olmaya uygun olup olmadığını görmeye açık mısın?",
    ),
    helper: t("No one is naming children today.", "Сегодня никто не выбирает имена детям.", "Hari ini belum ada yang memberi nama anak.", "لن نختار أسماء الأطفال اليوم.", "Bugün kimse çocuklara isim koymuyor."),
    options: [
      option("yes", t("Yes, I am open to exploring this seriously", "Да, я готова серьёзно это рассмотреть", "Ya, aku terbuka untuk menjajakinya dengan serius", "نعم، أنا منفتحة على استكشاف ذلك بجدية", "Evet, bunu ciddi biçimde değerlendirmeye açığım"), { scores: { intent_pace: 100, future_structure: 90 } }),
      option("slow", t("I am open, but I need time before thinking so far ahead", "Я открыта, но мне нужно время, прежде чем думать так далеко", "Aku terbuka, tetapi perlu waktu sebelum berpikir sejauh itu", "أنا منفتحة، لكنني أحتاج وقتاً قبل التفكير بهذا البعد", "Açığım ama bu kadar ileriyi düşünmeden önce zamana ihtiyacım var"), { scores: { intent_pace: 95, honesty_self_awareness: 100 } }),
      option("casual", t("I only see this as casual dating", "Я вижу это только как несерьёзные встречи", "Aku hanya melihat ini sebagai hubungan santai", "أرى الأمر كتعارف عابر فقط", "Bunu yalnızca gündelik flört olarak görüyorum"), { hardStop: "casual", flags: ["hard:casual_only"] }),
      option("no", t("I do not see him in this way", "Я не вижу его в таком качестве", "Aku tidak melihatnya seperti itu", "لا أراه بهذه الصورة", "Onu bu şekilde görmüyorum"), { hardStop: "not_marriage_open", flags: ["hard:not_marriage_open"] }),
    ],
  },
  {
    id: "q1",
    chapter: "intent",
    type: "single",
    required: true,
    prompt: t("What are you looking for during this stage of your life?", "Чего ты ищешь на этом этапе жизни?", "Apa yang kamu cari pada tahap hidupmu sekarang?", "ماذا تبحثين عنه في هذه المرحلة من حياتك؟", "Hayatının bu döneminde ne arıyorsun?"),
    options: [
      option("marriage", t("A serious relationship leading toward marriage", "Серьёзные отношения с перспективой брака", "Hubungan serius menuju pernikahan", "علاقة جادة تؤدي إلى الزواج", "Evliliğe giden ciddi bir ilişki"), { scores: { intent_pace: 100 } }),
      option("slow_serious", t("Getting to know someone slowly with serious potential", "Постепенно узнавать человека с серьёзной перспективой", "Mengenal seseorang perlahan dengan potensi serius", "التعرف ببطء مع احتمال جاد", "Ciddi potansiyelle birini yavaşça tanımak"), { scores: { intent_pace: 100, honesty_self_awareness: 100 } }),
      option("casual", t("Casual dating", "Несерьёзные встречи", "Kencan santai", "تعارف عابر", "Gündelik flört"), { scores: { intent_pace: 5 }, flags: ["hard:casual_intent"] }),
      option("friendship", t("Friendship", "Дружба", "Pertemanan", "صداقة", "Arkadaşlık"), { scores: { intent_pace: 5 }, flags: ["hard:friendship_intent"] }),
      option("unsure", t("I am still unsure", "Я пока не уверена", "Aku masih belum yakin", "ما زلت غير متأكدة", "Hâlâ emin değilim"), { scores: { intent_pace: 45, honesty_self_awareness: 85 }, flags: ["discussion:intent_unclear"] }),
    ],
  },
  {
    id: "q2",
    chapter: "intent",
    type: "single",
    required: true,
    prompt: t("How much time do you prefer before calling someone your partner?", "Сколько времени тебе обычно нужно, прежде чем назвать человека своим партнёром?", "Berapa lama waktu yang kamu sukai sebelum menyebut seseorang sebagai pasangan?", "كم من الوقت تفضلين قبل اعتبار شخص ما شريكاً؟", "Birine partnerim demeden önce ne kadar süreyi tercih edersin?"),
    options: [
      option("days", t("A few days", "Несколько дней", "Beberapa hari", "بضعة أيام", "Birkaç gün"), { scores: { intent_pace: 35 }, flags: ["discussion:very_fast_pace"] }),
      option("weeks", t("A few weeks", "Несколько недель", "Beberapa minggu", "بضعة أسابيع", "Birkaç hafta"), { scores: { intent_pace: 75 } }),
      option("one_three_months", t("One to three months", "От одного до трёх месяцев", "Satu sampai tiga bulan", "من شهر إلى ثلاثة أشهر", "Bir ila üç ay"), { scores: { intent_pace: 100 } }),
      option("months", t("Several months", "Несколько месяцев", "Beberapa bulan", "عدة أشهر", "Birkaç ay"), { scores: { intent_pace: 90 } }),
      option("depends", t("It depends on behavior and circumstances", "Это зависит от поведения и обстоятельств", "Tergantung perilaku dan keadaan", "يعتمد على السلوك والظروف", "Davranışa ve koşullara bağlı"), { scores: { intent_pace: 100, honesty_self_awareness: 100 } }),
    ],
  },
  {
    id: "q3",
    chapter: "intent",
    type: "single",
    required: true,
    prompt: t(
      "After two strong weeks, Naim says he sees potential but wants more time to observe consistency before making promises. How would you feel?",
      "После двух хороших недель Наим говорит, что видит потенциал, но хочет больше времени, чтобы увидеть постоянство до обещаний. Что ты почувствуешь?",
      "Setelah dua minggu yang kuat, Naim bilang dia melihat potensi tetapi ingin lebih banyak waktu untuk melihat konsistensi sebelum berjanji. Bagaimana perasaanmu?",
      "بعد أسبوعين جيدين، يقول نعيم إنه يرى احتمالاً جيداً لكنه يريد وقتاً لملاحظة الاستمرارية قبل الوعود. كيف ستشعرين؟",
      "İki güzel haftadan sonra Naim potansiyel gördüğünü ama söz vermeden önce tutarlılığı gözlemlemek istediğini söylüyor. Ne hissedersin?",
    ),
    options: [
      option("relieved", t("Relieved because he is taking it seriously", "Спокойно, потому что он относится к этому серьёзно", "Lega karena dia menanggapinya serius", "سأرتاح لأنه يتعامل بجدية", "Ciddi yaklaştığı için rahatlarım"), { scores: { intent_pace: 100, conflict_regulation: 100 } }),
      option("fine", t("Fine, consistency takes time", "Нормально, постоянство требует времени", "Tidak masalah, konsistensi butuh waktu", "لا بأس، فالاستمرارية تحتاج وقتاً", "Sorun değil, tutarlılık zaman ister"), { scores: { intent_pace: 100 } }),
      option("disappointed_respect", t("A little disappointed, but I would respect it", "Немного расстроюсь, но буду это уважать", "Sedikit kecewa, tetapi akan menghormatinya", "سأشعر بقليل من الخيبة لكنني سأحترم ذلك", "Biraz üzülürüm ama buna saygı duyarım"), { scores: { intent_pace: 90, honesty_self_awareness: 100 } }),
      option("rejected", t("Rejected and embarrassed", "Отвергнутой и смущённой", "Ditolak dan malu", "مرفوضة ومحرجة", "Reddedilmiş ve utanmış"), { scores: { intent_pace: 45, conflict_regulation: 55 }, flags: ["discussion:pace_feels_rejecting"] }),
      option("pressure", t("I would pressure him for certainty", "Я бы потребовала определённости", "Aku akan menekannya agar memberi kepastian", "سأضغط عليه للحصول على يقين", "Kesinlik vermesi için baskı yaparım"), { scores: { intent_pace: 10, conflict_regulation: 10 }, flags: ["concern:pressures_for_early_certainty"] }),
      option("lose_interest", t("I would lose interest immediately", "Я сразу потеряю интерес", "Aku langsung kehilangan minat", "سأفقد الاهتمام فوراً", "Hemen ilgimi kaybederim"), { scores: { intent_pace: 25 }, flags: ["discussion:low_patience_for_observation"] }),
    ],
  },
  {
    id: "q4",
    chapter: "intent",
    type: "text",
    required: true,
    minLength: 30,
    maxLength: 1200,
    prompt: t("What does commitment mean before exclusivity, and what changes after exclusivity?", "Что для тебя означает обязательство до эксклюзивности и что меняется после неё?", "Apa arti komitmen sebelum eksklusif, dan apa yang berubah setelah eksklusif?", "ماذا يعني الالتزام قبل الحصرية، وما الذي يتغير بعدها؟", "Özel bir ilişki başlamadan önce bağlılık ne demektir ve sonrasında ne değişir?"),
    placeholder: t("Answer in your own words...", "Ответь своими словами...", "Jawab dengan kata-katamu sendiri...", "أجيبي بكلماتك...", "Kendi sözlerinle cevapla..."),
  },
  {
    id: "q5",
    chapter: "connection",
    type: "single",
    required: true,
    prompt: t("What level of daily communication feels healthy to you?", "Какой уровень ежедневного общения кажется тебе здоровым?", "Seberapa banyak komunikasi harian yang terasa sehat bagimu?", "ما مقدار التواصل اليومي الصحي بالنسبة لك؟", "Günlük ne kadar iletişim sana sağlıklı gelir?"),
    options: [
      option("checkins", t("A few thoughtful check-ins", "Несколько внимательных сообщений", "Beberapa kabar singkat yang bermakna", "بضع رسائل قصيرة باهتمام", "Birkaç düşünceli kısa mesaj"), { scores: { affection_presence: 85 } }),
      option("long_conversation", t("One longer conversation each day", "Один длинный разговор в день", "Satu percakapan panjang setiap hari", "محادثة طويلة واحدة كل يوم", "Her gün bir uzun konuşma"), { scores: { affection_presence: 90 } }),
      option("throughout", t("Messages throughout the day", "Сообщения в течение дня", "Pesan sepanjang hari", "رسائل على مدار اليوم", "Gün boyunca mesajlaşmak"), { scores: { affection_presence: 100 } }),
      option("few_week", t("A few conversations each week", "Несколько разговоров в неделю", "Beberapa percakapan per minggu", "بضع محادثات في الأسبوع", "Haftada birkaç konuşma"), { scores: { affection_presence: 30 }, flags: ["hard:minimal_communication"] }),
      option("no_pattern", t("No fixed pattern", "Без определённого ритма", "Tanpa pola tetap", "من دون نمط ثابت", "Sabit bir düzen olmadan"), { scores: { affection_presence: 55 }, flags: ["discussion:communication_rhythm_unclear"] }),
      option("constant", t("I need near-constant contact", "Мне нужен почти постоянный контакт", "Aku butuh kontak hampir terus-menerus", "أحتاج تواصلاً شبه مستمر", "Neredeyse sürekli iletişime ihtiyacım var"), { scores: { affection_presence: 75, conflict_regulation: 35 }, flags: ["discussion:near_constant_contact"] }),
    ],
  },
  {
    id: "q6",
    chapter: "connection",
    type: "single",
    required: true,
    prompt: t("Good morning and good night messages feel...", "Сообщения «доброе утро» и «спокойной ночи» для тебя...", "Pesan selamat pagi dan selamat malam terasa...", "رسائل صباح الخير وتصبحين على خير تبدو...", "Günaydın ve iyi geceler mesajları sana..."),
    options: [
      option("important", t("Important and comforting", "Важными и успокаивающими", "Penting dan menenangkan", "مهمة ومطمئنة", "Önemli ve huzur verici"), { scores: { affection_presence: 100 } }),
      option("sweet", t("Sweet, but not necessary every day", "Милыми, но не обязательными каждый день", "Manis, tetapi tidak wajib setiap hari", "لطيفة، لكنها ليست ضرورية يومياً", "Tatlı ama her gün şart değil"), { scores: { affection_presence: 90 } }),
      option("spontaneous", t("Nice when spontaneous", "Приятными, когда они спонтанны", "Menyenangkan saat spontan", "جميلة عندما تكون عفوية", "Kendiliğinden olduğunda hoş"), { scores: { affection_presence: 75 } }),
      option("obligation", t("Like an obligation", "Как обязанность", "Seperti kewajiban", "كأنها واجب", "Bir zorunluluk gibi"), { scores: { affection_presence: 35 }, flags: ["discussion:greetings_feel_burdensome"] }),
      option("annoying", t("Annoying", "Раздражающими", "Mengganggu", "مزعجة", "Rahatsız edici"), { scores: { affection_presence: 5 }, flags: ["hard:affection_rhythm_mismatch"] }),
    ],
  },
  {
    id: "q7",
    chapter: "connection",
    type: "single",
    required: true,
    prompt: t("How often would you enjoy a planned voice or video call during a long-distance stage?", "Как часто тебе хотелось бы планировать голосовой или видеозвонок на расстоянии?", "Seberapa sering kamu menikmati panggilan suara atau video terjadwal saat menjalani jarak jauh?", "كم مرة تستمتعين بمكالمة صوتية أو مرئية مخططة أثناء البعد؟", "Uzak mesafe döneminde planlı sesli veya görüntülü aramayı ne sıklıkla istersin?"),
    options: [
      option("daily", t("Daily", "Каждый день", "Setiap hari", "يومياً", "Her gün"), { scores: { affection_presence: 100 } }),
      option("four_five", t("Four or five times each week", "Четыре-пять раз в неделю", "Empat atau lima kali per minggu", "أربع أو خمس مرات أسبوعياً", "Haftada dört veya beş kez"), { scores: { affection_presence: 100 } }),
      option("two_three", t("Two or three times each week", "Два-три раза в неделю", "Dua atau tiga kali per minggu", "مرتان أو ثلاث أسبوعياً", "Haftada iki veya üç kez"), { scores: { affection_presence: 95 } }),
      option("weekly", t("Once each week", "Раз в неделю", "Sekali per minggu", "مرة أسبوعياً", "Haftada bir"), { scores: { affection_presence: 55 }, flags: ["discussion:low_call_frequency"] }),
      option("rarely", t("Rarely", "Редко", "Jarang", "نادراً", "Nadiren"), { scores: { affection_presence: 15 }, flags: ["hard:call_frequency_mismatch"] }),
      option("dislike", t("I dislike video calls", "Я не люблю видеозвонки", "Aku tidak suka panggilan video", "لا أحب مكالمات الفيديو", "Görüntülü aramalardan hoşlanmam"), { scores: { affection_presence: 5 }, flags: ["hard:video_call_mismatch"] }),
    ],
  },
  {
    id: "q8",
    chapter: "connection",
    type: "text",
    required: true,
    minLength: 25,
    maxLength: 1000,
    prompt: t("What makes you feel loved without making you feel controlled?", "Что помогает тебе чувствовать любовь, но не контроль?", "Apa yang membuatmu merasa dicintai tanpa merasa dikendalikan?", "ما الذي يجعلك تشعرين بالحب من دون أن تشعري بالسيطرة؟", "Kontrol ediliyormuş gibi hissetmeden sevildiğini ne hissettirir?"),
    placeholder: t("The small things matter here...", "Здесь важны даже мелочи...", "Hal-hal kecil penting di sini...", "التفاصيل الصغيرة مهمة هنا...", "Burada küçük şeyler önemli..."),
  },
  {
    id: "q9",
    chapter: "connection",
    type: "single",
    required: true,
    prompt: t("What amount of independence should two committed partners have?", "Сколько самостоятельности должно быть у двух серьёзных партнёров?", "Seberapa besar kemandirian yang seharusnya dimiliki dua pasangan yang berkomitmen?", "ما مقدار الاستقلال الذي ينبغي أن يتمتع به الشريكان الملتزمان؟", "Bağlı iki partnerin ne kadar bağımsızlığı olmalı?"),
    options: [
      option("plenty", t("Plenty of independent time, with clear communication", "Достаточно личного времени при ясном общении", "Banyak waktu mandiri dengan komunikasi yang jelas", "وقت مستقل كافٍ مع تواصل واضح", "Açık iletişimle bolca kişisel zaman"), { scores: { affection_presence: 90, conflict_regulation: 100 } }),
      option("separate_updates", t("Separate activities, but frequent updates", "Отдельные занятия, но частые короткие новости", "Kegiatan terpisah, tetapi sering memberi kabar", "أنشطة منفصلة مع تحديثات متكررة", "Ayrı aktiviteler ama sık haberleşme"), { scores: { affection_presence: 100, conflict_regulation: 85 } }),
      option("most_shared", t("Most free time should be shared", "Большую часть свободного времени стоит проводить вместе", "Sebagian besar waktu luang sebaiknya bersama", "يفضل مشاركة معظم وقت الفراغ", "Boş zamanın çoğu birlikte geçirilmeli"), { scores: { affection_presence: 85, conflict_regulation: 65 }, flags: ["discussion:high_togetherness"] }),
      option("know_where", t("Partners should know where each other is at all times", "Партнёры всегда должны знать, где находится другой", "Pasangan harus selalu tahu keberadaan satu sama lain", "ينبغي أن يعرف كل شريك مكان الآخر دائماً", "Partnerler her an birbirinin nerede olduğunu bilmeli"), { scores: { affection_presence: 70, conflict_regulation: 25 }, flags: ["concern:constant_location_expectation"] }),
      option("rarely_apart", t("Partners should rarely spend time apart", "Партнёры почти не должны проводить время отдельно", "Pasangan sebaiknya jarang berpisah", "ينبغي ألا يقضي الشريكان وقتاً منفصلين إلا نادراً", "Partnerler nadiren ayrı zaman geçirmeli"), { scores: { affection_presence: 65, conflict_regulation: 20 }, flags: ["concern:low_independence"] }),
    ],
  },
  {
    id: "q10",
    chapter: "connection",
    type: "single",
    required: true,
    prompt: t("Naim spends one evening with trusted friends. He tells you where he is and says he will message afterward. What best describes your response?", "Наим проводит вечер с близкими друзьями. Он говорит, где находится, и обещает написать после. Какая реакция ближе тебе?", "Naim menghabiskan satu malam bersama teman tepercaya. Dia memberi tahu lokasinya dan akan mengabari setelahnya. Respons mana yang paling menggambarkanmu?", "يقضي نعيم مساءً مع أصدقاء موثوقين، ويخبرك بمكانه وأنه سيراسلك بعد ذلك. ما أقرب رد لك؟", "Naim güvendiği arkadaşlarıyla bir akşam geçiriyor, nerede olduğunu söylüyor ve sonra yazacağını belirtiyor. Tepkin hangisine yakın?"),
    options: [
      option("have_fun", t("I hope you have fun. Talk later.", "Надеюсь, хорошо проведёшь время. Поговорим позже.", "Semoga kamu bersenang-senang. Bicara nanti.", "أتمنى أن تستمتع. نتحدث لاحقاً.", "İyi eğlenceler. Sonra konuşuruz."), { scores: { affection_presence: 95, conflict_regulation: 100 } }),
      option("say_insecurity", t("I feel a little insecure, so I say it once and continue my evening.", "Мне немного тревожно, поэтому я скажу об этом один раз и продолжу свой вечер.", "Aku sedikit tidak aman, jadi aku mengatakannya sekali lalu melanjutkan malamku.", "أشعر بقليل من عدم الأمان، فأقوله مرة وأكمل مساءي.", "Biraz güvensiz hissederim, bir kez söyler ve akşamıma devam ederim."), { scores: { affection_presence: 100, conflict_regulation: 95, honesty_self_awareness: 100 } }),
      option("updates", t("I ask for regular updates during the evening.", "Я прошу регулярно сообщать новости весь вечер.", "Aku meminta kabar secara teratur sepanjang malam.", "أطلب تحديثات منتظمة خلال المساء.", "Akşam boyunca düzenli haber isterim."), { scores: { affection_presence: 85, conflict_regulation: 55 }, flags: ["discussion:frequent_updates_expected"] }),
      option("cold", t("I become cold so he understands I am upset.", "Я становлюсь холодной, чтобы он понял, что я расстроена.", "Aku menjadi dingin agar dia tahu aku kesal.", "أصبح باردة ليفهم أنني منزعجة.", "Üzgün olduğumu anlaması için soğuk davranırım."), { scores: { conflict_regulation: 5 }, flags: ["concern:silent_punishment"] }),
      option("jealous", t("I post something to make him jealous.", "Я публикую что-то, чтобы вызвать ревность.", "Aku mengunggah sesuatu untuk membuatnya cemburu.", "أنشر شيئاً لأجعله يغار.", "Onu kıskandırmak için bir şey paylaşırım."), { scores: { conflict_regulation: 0, honesty_self_awareness: 10 }, flags: ["concern:jealousy_provocation"] }),
      option("forbid", t("I tell him he should not go.", "Я говорю, что ему не стоит идти.", "Aku bilang dia tidak boleh pergi.", "أقول له ألا يذهب.", "Gitmemesi gerektiğini söylerim."), { scores: { conflict_regulation: 10 }, flags: ["concern:forbids_normal_social_time"] }),
    ],
  },
  {
    id: "q11",
    chapter: "conflict",
    type: "single",
    required: true,
    prompt: t("You feel hurt and need space. What happens next?", "Тебе больно и нужно пространство. Что ты делаешь дальше?", "Kamu terluka dan butuh ruang. Apa yang terjadi selanjutnya?", "تشعرين بالأذى وتحتاجين مساحة. ماذا يحدث بعد ذلك؟", "Kırıldın ve alana ihtiyacın var. Sonra ne olur?"),
    options: [
      option("space_return", t("I say I am upset, ask for space, and give a time when we will talk.", "Я говорю, что расстроена, прошу время и называю, когда мы поговорим.", "Aku bilang sedang kesal, meminta ruang, dan memberi waktu kapan kami bicara.", "أقول إنني منزعجة، وأطلب مساحة، وأحدد وقتاً للحديث.", "Üzgün olduğumu söyler, alan ister ve ne zaman konuşacağımızı belirtirim."), { scores: { conflict_regulation: 100, honesty_self_awareness: 100 } }),
      option("disappear", t("I stop answering until I feel better.", "Я перестаю отвечать, пока не станет лучше.", "Aku berhenti menjawab sampai merasa lebih baik.", "أتوقف عن الرد حتى أشعر بتحسن.", "Kendimi daha iyi hissedene kadar cevap vermem."), { scores: { conflict_regulation: 10 }, flags: ["concern:silent_punishment"] }),
      option("keep_arguing", t("I keep arguing until everything is solved.", "Я продолжаю спорить, пока всё не решится.", "Aku terus berdebat sampai semuanya selesai.", "أواصل الجدال حتى يُحل كل شيء.", "Her şey çözülene kadar tartışmaya devam ederim."), { scores: { conflict_regulation: 35 }, flags: ["discussion:cannot_pause_conflict"] }),
      option("breakup", t("I threaten to end the relationship.", "Я угрожаю закончить отношения.", "Aku mengancam mengakhiri hubungan.", "أهدد بإنهاء العلاقة.", "İlişkiyi bitirmekle tehdit ederim."), { scores: { conflict_regulation: 0 }, flags: ["concern:breakup_threats"] }),
      option("chase", t("I expect him to chase me.", "Я ожидаю, что он будет добиваться меня.", "Aku berharap dia mengejarku.", "أتوقع منه أن يلاحقني.", "Beni kovalamasını beklerim."), { scores: { conflict_regulation: 5, honesty_self_awareness: 30 }, flags: ["concern:expects_chasing"] }),
      option("explain_then_space", t("I explain what hurt me before taking space.", "Я объясняю, что меня задело, прежде чем взять паузу.", "Aku menjelaskan apa yang menyakitiku sebelum mengambil ruang.", "أشرح ما آلمني قبل أخذ مساحة.", "Alan almadan önce neyin incittiğini açıklarım."), { scores: { conflict_regulation: 95, honesty_self_awareness: 100 } }),
    ],
  },
  {
    id: "q12",
    chapter: "conflict",
    type: "single",
    required: true,
    prompt: t("Your partner asks for reassurance several times about the same fear. What would you do?", "Партнёр несколько раз просит уверенности из-за одного и того же страха. Что ты сделаешь?", "Pasanganmu meminta kepastian beberapa kali tentang ketakutan yang sama. Apa yang kamu lakukan?", "يطلب شريكك الطمأنة عدة مرات بشأن الخوف نفسه. ماذا تفعلين؟", "Partnerin aynı korku hakkında birkaç kez güvence istiyor. Ne yaparsın?"),
    options: [
      option("reassure_limit", t("Reassure him calmly, then explain my limit.", "Спокойно поддержу, затем объясню свой предел.", "Menenangkannya dengan tenang lalu menjelaskan batasku.", "أطمئنه بهدوء ثم أوضح حدودي.", "Sakin biçimde güvence verir, sonra sınırımı açıklarım."), { scores: { conflict_regulation: 100, affection_presence: 100 } }),
      option("repair_action", t("Ask what action would help repair trust.", "Спрошу, какое действие поможет восстановить доверие.", "Bertanya tindakan apa yang membantu memperbaiki kepercayaan.", "أسأل عن الفعل الذي يساعد على إصلاح الثقة.", "Güveni onarmaya hangi davranışın yardımcı olacağını sorarım."), { scores: { conflict_regulation: 100, affection_presence: 95 } }),
      option("all_passwords", t("Give him every password and constant proof.", "Дам все пароли и постоянные доказательства.", "Memberikan semua kata sandi dan bukti terus-menerus.", "أعطيه كل كلمات المرور وإثباتاً دائماً.", "Tüm şifreleri ve sürekli kanıt veririm."), { scores: { conflict_regulation: 25, affection_presence: 60 }, flags: ["concern:surveillance_as_trust"] }),
      option("insult", t("Become angry and insult him.", "Разозлюсь и оскорблю его.", "Marah dan menghinanya.", "أغضب وأهينه.", "Öfkelenir ve hakaret ederim."), { scores: { conflict_regulation: 0 }, flags: ["concern:insults_under_stress"] }),
      option("stop_replying", t("Stop replying.", "Перестану отвечать.", "Berhenti menjawab.", "أتوقف عن الرد.", "Cevap vermeyi bırakırım."), { scores: { conflict_regulation: 0 }, flags: ["concern:silent_punishment"] }),
      option("break_return", t("Suggest a break, then return to the topic calmly.", "Предложу паузу и позже спокойно вернусь к теме.", "Menyarankan jeda lalu kembali ke topik dengan tenang.", "أقترح استراحة ثم أعود للموضوع بهدوء.", "Ara vermeyi önerir, sonra konuya sakin biçimde dönerim."), { scores: { conflict_regulation: 90 } }),
      option("his_problem", t("Tell him his fear is his problem.", "Скажу, что его страх — только его проблема.", "Mengatakan bahwa ketakutannya adalah masalahnya sendiri.", "أقول إن خوفه مشكلته وحده.", "Korkusunun yalnızca onun sorunu olduğunu söylerim."), { scores: { conflict_regulation: 20, affection_presence: 10 }, flags: ["discussion:low_reassurance"] }),
    ],
  },
  {
    id: "q13",
    chapter: "conflict",
    type: "multi",
    required: true,
    prompt: t("Which behaviors are unacceptable during an argument? Select all that apply.", "Какое поведение недопустимо во время ссоры? Выбери всё подходящее.", "Perilaku apa yang tidak dapat diterima saat bertengkar? Pilih semua yang sesuai.", "ما السلوكيات غير المقبولة أثناء الخلاف؟ اختاري كل ما ينطبق.", "Tartışma sırasında hangi davranışlar kabul edilemez? Uygun olanların tümünü seç."),
    options: [
      option("insults", t("Insults", "Оскорбления", "Hinaan", "الإهانات", "Hakaret"), { scores: { conflict_regulation: 100 } }),
      option("yelling", t("Yelling", "Крик", "Membentak", "الصراخ", "Bağırmak"), { scores: { conflict_regulation: 100 } }),
      option("breakup_threat", t("Threatening a breakup", "Угрозы расставанием", "Mengancam putus", "التهديد بالانفصال", "Ayrılıkla tehdit"), { scores: { conflict_regulation: 100 } }),
      option("blocking", t("Blocking without explanation", "Блокировка без объяснения", "Memblokir tanpa penjelasan", "الحظر دون تفسير", "Açıklama olmadan engellemek"), { scores: { conflict_regulation: 100 } }),
      option("silent", t("Silent punishment", "Наказание молчанием", "Hukuman diam", "العقاب بالصمت", "Sessizlikle cezalandırmak"), { scores: { conflict_regulation: 100 } }),
      option("public", t("Public embarrassment", "Публичное унижение", "Mempermalukan di depan umum", "الإحراج أمام الناس", "Toplum içinde küçük düşürmek"), { scores: { conflict_regulation: 100 } }),
      option("weakness", t("Bringing up private weaknesses", "Использование личных слабостей", "Mengungkit kelemahan pribadi", "استخدام نقاط الضعف الخاصة", "Özel zayıflıkları kullanmak"), { scores: { conflict_regulation: 100 } }),
      option("physical", t("Physical intimidation", "Физическое запугивание", "Intimidasi fisik", "الترهيب الجسدي", "Fiziksel korkutma"), { scores: { conflict_regulation: 100 } }),
      option("cooling", t("Leaving for a planned cooling-off period", "Уход на заранее обозначенную паузу", "Pergi untuk jeda tenang yang disepakati", "الابتعاد لفترة تهدئة متفق عليها", "Planlı sakinleşme molası vermek"), { scores: { conflict_regulation: 15 }, flags: ["discussion:sees_planned_pause_as_unacceptable"] }),
      option("respectful_no", t("Saying no respectfully", "Уважительное «нет»", "Mengatakan tidak dengan hormat", "قول لا باحترام", "Saygılı biçimde hayır demek"), { scores: { conflict_regulation: 0 }, flags: ["concern:rejects_respectful_no"] }),
    ],
  },
  {
    id: "q14",
    chapter: "conflict",
    type: "multi",
    required: true,
    prompt: t("What helps you trust an apology? Select what matters.", "Что помогает тебе поверить в извинение? Выбери важное.", "Apa yang membantumu mempercayai permintaan maaf? Pilih yang penting.", "ما الذي يساعدك على تصديق الاعتذار؟ اختاري ما يهم.", "Bir özre güvenmene ne yardımcı olur? Önemli olanları seç."),
    options: [
      option("words", t("Words", "Слова", "Kata-kata", "الكلمات", "Sözler"), { scores: { conflict_regulation: 65 } }),
      option("changed_behavior", t("Changed behavior over time", "Изменившееся поведение со временем", "Perubahan perilaku dari waktu ke waktu", "تغير السلوك مع الوقت", "Zaman içinde değişen davranış"), { scores: { conflict_regulation: 100 } }),
      option("phone_access", t("Immediate access to phones and accounts", "Немедленный доступ к телефонам и аккаунтам", "Akses langsung ke ponsel dan akun", "وصول فوري للهواتف والحسابات", "Telefon ve hesaplara anında erişim"), { scores: { conflict_regulation: 20 }, flags: ["concern:surveillance_as_trust"] }),
      option("explanation", t("A detailed explanation", "Подробное объяснение", "Penjelasan terperinci", "شرح مفصل", "Ayrıntılı açıklama"), { scores: { conflict_regulation: 85 } }),
      option("time", t("Time and consistency", "Время и постоянство", "Waktu dan konsistensi", "الوقت والاستمرارية", "Zaman ve tutarlılık"), { scores: { conflict_regulation: 100 } }),
      option("gift", t("A gift or romantic gesture", "Подарок или романтический жест", "Hadiah atau gestur romantis", "هدية أو لفتة رومانسية", "Hediye veya romantik jest"), { scores: { conflict_regulation: 45 } }),
      option("mutual", t("Forgiveness from both sides", "Прощение с обеих сторон", "Saling memaafkan", "التسامح من الطرفين", "İki taraflı affetmek"), { scores: { conflict_regulation: 85 } }),
    ],
  },
  {
    id: "q15",
    chapter: "conflict",
    type: "text",
    required: true,
    minLength: 35,
    maxLength: 1200,
    prompt: t("What is the difference between privacy and secrecy in a relationship?", "В чём разница между личным пространством и секретностью в отношениях?", "Apa perbedaan antara privasi dan kerahasiaan dalam hubungan?", "ما الفرق بين الخصوصية والإخفاء في العلاقة؟", "Bir ilişkide mahremiyet ile gizlilik arasındaki fark nedir?"),
  },
  {
    id: "q16",
    chapter: "conflict",
    type: "text",
    required: true,
    minLength: 45,
    maxLength: 1500,
    prompt: t("Tell Naim about a recent time when you were wrong. What happened after you understood your mistake?", "Расскажи Наиму о недавней ситуации, когда ты была неправа. Что произошло после того, как ты поняла ошибку?", "Ceritakan kepada Naim tentang saat baru-baru ini kamu salah. Apa yang terjadi setelah kamu menyadari kesalahanmu?", "أخبري نعيم عن موقف حديث كنت مخطئة فيه. ماذا حدث بعد أن أدركت خطأك؟", "Naim'e yakın zamanda haksız olduğun bir anı anlat. Hatanı fark ettikten sonra ne oldu?"),
    helper: t("Specific examples are more useful than perfect answers.", "Конкретный пример полезнее идеального ответа.", "Contoh nyata lebih berguna daripada jawaban sempurna.", "المثال المحدد أنفع من الإجابة المثالية.", "Somut bir örnek kusursuz cevaptan daha değerlidir."),
  },
  {
    id: "q17",
    chapter: "faith",
    type: "single",
    required: true,
    prompt: t("What role does Islam have in your daily life and future marriage?", "Какую роль ислам играет в твоей повседневной жизни и будущем браке?", "Apa peran Islam dalam kehidupan sehari-hari dan pernikahanmu di masa depan?", "ما دور الإسلام في حياتك اليومية وزواجك المستقبلي؟", "İslam günlük hayatında ve gelecekteki evliliğinde nasıl bir yere sahip?"),
    options: [
      option("guides", t("It guides my daily choices", "Он направляет мои ежедневные решения", "Islam membimbing pilihan harianku", "يوجه اختياراتي اليومية", "Günlük seçimlerime yön verir"), { scores: { faith_boundaries: 100 } }),
      option("deep_growing", t("It matters deeply, and I am still growing", "Он очень важен, и я продолжаю расти", "Islam sangat penting dan aku masih bertumbuh", "هو مهم جداً وما زلت أتطور", "Benim için çok önemli ve gelişmeye devam ediyorum"), { scores: { faith_boundaries: 100, honesty_self_awareness: 100 } }),
      option("cultural", t("It matters more culturally than practically", "Он важнее культурно, чем практически", "Lebih penting secara budaya daripada praktik", "أهم ثقافياً منه عملياً", "Pratikten çok kültürel olarak önemli"), { scores: { faith_boundaries: 30 }, flags: ["hard:faith_framework_mismatch"] }),
      option("exploring", t("I am still exploring my faith", "Я ещё изучаю свою веру", "Aku masih menjelajahi imanku", "ما زلت أستكشف إيماني", "İnancımı hâlâ araştırıyorum"), { scores: { faith_boundaries: 55, honesty_self_awareness: 95 }, flags: ["discussion:faith_still_forming"] }),
      option("not_central", t("It is not central to my life", "Это не центр моей жизни", "Islam bukan pusat hidupku", "ليس محور حياتي", "Hayatımın merkezinde değil"), { scores: { faith_boundaries: 0 }, flags: ["hard:faith_not_central"] }),
    ],
  },
  {
    id: "q18",
    chapter: "faith",
    type: "single",
    required: true,
    prompt: t("What type of boundaries feel right with friends of the opposite sex during a committed relationship?", "Какие границы с друзьями противоположного пола кажутся тебе правильными в серьёзных отношениях?", "Batasan seperti apa yang terasa tepat dengan teman lawan jenis saat hubungan berkomitmen?", "ما الحدود المناسبة مع أصدقاء الجنس الآخر أثناء علاقة ملتزمة؟", "Ciddi bir ilişkide karşı cins arkadaşlarla hangi sınırlar sana doğru gelir?"),
    options: [
      option("close_private", t("Close private friendships are fine", "Близкая личная дружба допустима", "Pertemanan dekat dan pribadi tidak masalah", "الصداقات الخاصة القريبة مقبولة", "Yakın özel arkadaşlıklar uygundur"), { scores: { faith_boundaries: 5 }, flags: ["hard:close_private_opposite_sex_friendships"] }),
      option("group_only", t("Group friendships are fine, private emotional chats are not", "Дружба в компании допустима, личные эмоциональные разговоры — нет", "Pertemanan kelompok tidak masalah, obrolan emosional pribadi tidak", "صداقات المجموعة مقبولة، أما الأحاديث العاطفية الخاصة فلا", "Grup arkadaşlığı olur, özel duygusal konuşmalar olmaz"), { scores: { faith_boundaries: 75 }, flags: ["discussion:group_friendships"] }),
      option("necessity", t("Necessary school or work contact only", "Только необходимое общение по учёбе или работе", "Hanya kontak yang perlu untuk sekolah atau pekerjaan", "التواصل الضروري للدراسة أو العمل فقط", "Yalnızca gerekli okul veya iş iletişimi"), { scores: { faith_boundaries: 100 } }),
      option("no_private", t("No private contact beyond necessity", "Без личного общения за пределами необходимости", "Tidak ada kontak pribadi di luar kebutuhan", "لا تواصل خاص خارج الضرورة", "Zorunluluk dışında özel iletişim yok"), { scores: { faith_boundaries: 100 } }),
      option("separate", t("Each partner decides separately", "Каждый партнёр решает отдельно", "Setiap pasangan memutuskan sendiri", "يقرر كل شريك منفرداً", "Her partner kendi karar verir"), { scores: { faith_boundaries: 20 }, flags: ["concern:separate_boundary_standards"] }),
      option("unconsidered", t("I have not thought about this", "Я об этом не думала", "Aku belum pernah memikirkan ini", "لم أفكر في ذلك", "Bunu düşünmedim"), { scores: { faith_boundaries: 45, honesty_self_awareness: 90 }, flags: ["discussion:boundaries_unformed"] }),
    ],
  },
  {
    id: "q19",
    chapter: "faith",
    type: "single",
    required: true,
    prompt: t("An old male friend sends a casual message after you enter an exclusive relationship. What happens?", "Старый друг-мужчина пишет обычное сообщение после начала эксклюзивных отношений. Что ты делаешь?", "Teman pria lama mengirim pesan santai setelah kamu masuk hubungan eksklusif. Apa yang terjadi?", "يرسل صديق قديم رسالة عادية بعد دخولك علاقة حصرية. ماذا تفعلين؟", "Özel bir ilişkiye başladıktan sonra eski bir erkek arkadaşın sıradan bir mesaj gönderiyor. Ne olur?"),
    options: [
      option("normal", t("I speak normally for as long as the conversation continues", "Общаюсь обычно столько, сколько длится разговор", "Aku mengobrol biasa selama percakapan berlanjut", "أتحدث بصورة عادية ما دام الحوار مستمراً", "Konuşma sürdüğü kadar normal şekilde konuşurum"), { scores: { faith_boundaries: 10 }, flags: ["hard:ongoing_private_male_chat"] }),
      option("brief_mention", t("I answer briefly and mention my relationship", "Кратко отвечаю и упоминаю отношения", "Aku menjawab singkat dan menyebut hubunganku", "أجيب باختصار وأذكر علاقتي", "Kısa cevap verir ve ilişkimi söylerim"), { scores: { faith_boundaries: 80 } }),
      option("agreed_boundary", t("I follow the boundary my partner and I already agreed on", "Следую границе, о которой мы договорились", "Aku mengikuti batasan yang sudah disepakati bersama pasangan", "أتبع الحد الذي اتفقت عليه مع شريكي", "Partnerimle önceden anlaştığımız sınıra uyarım"), { scores: { faith_boundaries: 100, conflict_regulation: 95 } }),
      option("hide", t("I hide the conversation to avoid conflict", "Скрываю разговор, чтобы избежать конфликта", "Aku menyembunyikan percakapan untuk menghindari konflik", "أخفي المحادثة لتجنب الخلاف", "Tartışmadan kaçınmak için konuşmayı gizlerim"), { scores: { faith_boundaries: 0, honesty_self_awareness: 0 }, flags: ["concern:hides_contact_to_avoid_conflict"] }),
      option("ask", t("I ask my partner before replying", "Спрашиваю партнёра перед ответом", "Aku bertanya kepada pasangan sebelum menjawab", "أسأل شريكي قبل الرد", "Cevap vermeden önce partnerime sorarım"), { scores: { faith_boundaries: 95 } }),
      option("block", t("I block every man automatically", "Автоматически блокирую любого мужчину", "Aku otomatis memblokir setiap pria", "أحظر كل رجل تلقائياً", "Her erkeği otomatik olarak engellerim"), { scores: { faith_boundaries: 85, conflict_regulation: 55 }, flags: ["discussion:automatic_blocking"] }),
    ],
  },
  {
    id: "q20",
    chapter: "faith",
    type: "single",
    required: true,
    prompt: t("Should both partners follow the same standards?", "Должны ли оба партнёра соблюдать одинаковые принципы?", "Apakah kedua pasangan harus mengikuti standar yang sama?", "هل ينبغي للطرفين اتباع المعايير نفسها؟", "İki partner de aynı standartlara uymalı mı?"),
    options: [
      option("same", t("Yes, the same principle should apply to both", "Да, один принцип должен действовать для обоих", "Ya, prinsip yang sama berlaku untuk keduanya", "نعم، ينبغي أن ينطبق المبدأ نفسه على الطرفين", "Evet, aynı ilke iki taraf için de geçerli olmalı"), { scores: { faith_boundaries: 100, honesty_self_awareness: 100 } }),
      option("practical", t("Mostly, with practical differences", "В основном да, с практическими различиями", "Sebagian besar, dengan perbedaan praktis", "غالباً، مع فروق عملية", "Çoğunlukla, pratik farklarla"), { scores: { faith_boundaries: 90 } }),
      option("different", t("No, men and women should receive completely different freedom", "Нет, у мужчин и женщин должна быть совершенно разная свобода", "Tidak, pria dan wanita harus memiliki kebebasan yang sepenuhnya berbeda", "لا، ينبغي أن تكون حرية الرجل والمرأة مختلفة تماماً", "Hayır, kadın ve erkeğin özgürlüğü tamamen farklı olmalı"), { scores: { faith_boundaries: 25, honesty_self_awareness: 35 }, flags: ["concern:one_sided_standards"] }),
      option("depends", t("It depends on the situation", "Зависит от ситуации", "Tergantung situasinya", "يعتمد على الموقف", "Duruma bağlı"), { scores: { faith_boundaries: 65 }, flags: ["discussion:standards_contextual"] }),
    ],
  },
  {
    id: "q21",
    chapter: "faith",
    type: "text",
    required: true,
    minLength: 35,
    maxLength: 1200,
    prompt: t("What type of social media behavior feels respectful during a serious relationship?", "Какое поведение в социальных сетях кажется тебе уважительным в серьёзных отношениях?", "Perilaku media sosial seperti apa yang terasa menghormati hubungan serius?", "ما السلوك المحترم على وسائل التواصل أثناء علاقة جادة؟", "Ciddi bir ilişkide hangi sosyal medya davranışları saygılı gelir?"),
  },
  {
    id: "q21b",
    chapter: "faith",
    type: "multi",
    required: true,
    prompt: t("Which topics should a couple discuss clearly?", "Какие темы паре стоит заранее обсудить?", "Topik apa yang harus dibicarakan pasangan dengan jelas?", "ما الموضوعات التي ينبغي للزوجين مناقشتها بوضوح؟", "Bir çift hangi konuları açıkça konuşmalı?"),
    options: [
      option("photos", t("Photos and stories", "Фото и истории", "Foto dan cerita", "الصور والقصص", "Fotoğraflar ve hikâyeler"), { scores: { faith_boundaries: 80 } }),
      option("private_messages", t("Private messages", "Личные сообщения", "Pesan pribadi", "الرسائل الخاصة", "Özel mesajlar"), { scores: { faith_boundaries: 100 } }),
      option("exes", t("Exes and old romantic contacts", "Бывшие и старые романтические контакты", "Mantan dan kontak romantis lama", "العلاقات السابقة والاتصالات القديمة", "Eski sevgililer ve eski romantik kişiler"), { scores: { faith_boundaries: 100 } }),
      option("public_status", t("Public relationship status", "Публичность отношений", "Status hubungan di publik", "إظهار حالة العلاقة", "İlişkinin kamusal görünürlüğü"), { scores: { faith_boundaries: 75 } }),
      option("followers", t("Followers and new connections", "Подписчики и новые знакомства", "Pengikut dan koneksi baru", "المتابعون والعلاقات الجديدة", "Takipçiler ve yeni bağlantılar"), { scores: { faith_boundaries: 75 } }),
      option("none", t("None. Each person should do whatever they want", "Никакие. Каждый делает что хочет", "Tidak ada. Setiap orang bebas melakukan apa pun", "لا شيء. لكل شخص أن يفعل ما يريد", "Hiçbiri. Herkes istediğini yapmalı"), { scores: { faith_boundaries: 10 }, flags: ["hard:no_shared_social_boundaries"] }),
    ],
  },
  {
    id: "q22",
    chapter: "future",
    type: "single",
    required: true,
    prompt: t("What life do you currently want after marriage?", "Какую жизнь ты сейчас хочешь после брака?", "Kehidupan seperti apa yang kamu inginkan setelah menikah?", "ما الحياة التي تريدينها بعد الزواج؟", "Evlilikten sonra nasıl bir hayat istiyorsun?"),
    options: [
      option("career", t("Full-time career", "Полная карьера", "Karier penuh waktu", "مسيرة مهنية بدوام كامل", "Tam zamanlı kariyer"), { scores: { future_structure: 45 }, flags: ["discussion:full_time_career"] }),
      option("part_time", t("Part-time work", "Частичная занятость", "Kerja paruh waktu", "عمل بدوام جزئي", "Yarı zamanlı çalışma"), { scores: { future_structure: 85 } }),
      option("study", t("Study or university", "Учёба или университет", "Belajar atau universitas", "الدراسة أو الجامعة", "Eğitim veya üniversite"), { scores: { future_structure: 80 } }),
      option("business", t("Build a business", "Развивать бизнес", "Membangun bisnis", "بناء مشروع", "İş kurmak"), { scores: { future_structure: 75 } }),
      option("home", t("Focus mainly on home and children", "В основном сосредоточиться на доме и детях", "Fokus terutama pada rumah dan anak", "التركيز أساساً على البيت والأطفال", "Ağırlıklı olarak ev ve çocuklara odaklanmak"), { scores: { future_structure: 100 } }),
      option("mix", t("A mix depending on finances and children", "Сочетание в зависимости от финансов и детей", "Campuran tergantung keuangan dan anak", "مزيج يعتمد على المال والأطفال", "Maddi durum ve çocuklara göre bir karışım"), { scores: { future_structure: 100, honesty_self_awareness: 95 } }),
      option("unsure", t("I am unsure", "Я не уверена", "Aku belum yakin", "لست متأكدة", "Emin değilim"), { scores: { future_structure: 50, honesty_self_awareness: 85 }, flags: ["discussion:marriage_role_unclear"] }),
    ],
  },
  {
    id: "q23",
    chapter: "future",
    type: "single",
    required: true,
    prompt: t("Where do you want to live long term?", "Где ты хочешь жить в долгосрочной перспективе?", "Di mana kamu ingin tinggal dalam jangka panjang?", "أين تريدين العيش على المدى البعيد؟", "Uzun vadede nerede yaşamak istiyorsun?"),
    options: [
      option("us", t("United States", "США", "Amerika Serikat", "الولايات المتحدة", "Amerika Birleşik Devletleri"), { scores: { future_structure: 100 } }),
      option("turkiye", t("Türkiye", "Турция", "Türkiye", "تركيا", "Türkiye"), { scores: { future_structure: 95 } }),
      option("current", t("My current country", "Моя нынешняя страна", "Negaraku saat ini", "بلدي الحالي", "Şu an yaşadığım ülke"), { scores: { future_structure: 35 }, flags: ["discussion:prefers_current_country"] }),
      option("other", t("Another country", "Другая страна", "Negara lain", "بلد آخر", "Başka bir ülke"), { scores: { future_structure: 50 }, flags: ["discussion:other_country"] }),
      option("flexible", t("I am flexible", "Я гибко к этому отношусь", "Aku fleksibel", "أنا مرنة", "Esneğim"), { scores: { future_structure: 100 } }),
      option("no_relocate", t("I do not want to relocate", "Я не хочу переезжать", "Aku tidak ingin pindah negara", "لا أريد الانتقال", "Taşınmak istemiyorum"), { scores: { future_structure: 5 }, flags: ["hard:no_relocation"] }),
    ],
  },
  {
    id: "q23b",
    chapter: "future",
    type: "text",
    required: true,
    minLength: 25,
    maxLength: 1000,
    condition: { questionId: "q23", values: ["us", "turkiye", "current", "other", "flexible"] },
    prompt: t("What would make relocation feel safe and fair?", "Что сделало бы переезд безопасным и справедливым для тебя?", "Apa yang membuat relokasi terasa aman dan adil?", "ما الذي يجعل الانتقال آمناً وعادلاً بالنسبة لك؟", "Taşınmayı güvenli ve adil hissettirecek şeyler neler?"),
  },
  {
    id: "q24",
    chapter: "future",
    type: "single",
    required: true,
    prompt: t("Do you want children?", "Ты хочешь детей?", "Apakah kamu ingin punya anak?", "هل تريدين أطفالاً؟", "Çocuk istiyor musun?"),
    options: [
      option("yes", t("Yes", "Да", "Ya", "نعم", "Evet"), { scores: { future_structure: 100 } }),
      option("no", t("No", "Нет", "Tidak", "لا", "Hayır"), { scores: { future_structure: 0 }, flags: ["hard:no_children"] }),
      option("unsure", t("Unsure", "Не уверена", "Belum yakin", "غير متأكدة", "Emin değilim"), { scores: { future_structure: 45, honesty_self_awareness: 90 }, flags: ["discussion:children_uncertain"] }),
    ],
  },
  {
    id: "q24b",
    chapter: "future",
    type: "single",
    required: true,
    condition: { questionId: "q24", values: ["yes"] },
    prompt: t("When would you prefer to start trying for children after marriage?", "Когда после брака ты хотела бы начать планировать детей?", "Kapan kamu ingin mulai merencanakan anak setelah menikah?", "متى تفضلين البدء في محاولة الإنجاب بعد الزواج؟", "Evlilikten sonra çocuk için ne zaman başlamayı tercih edersin?"),
    options: [
      option("first_year", t("Within the first year", "В первый год", "Dalam tahun pertama", "خلال السنة الأولى", "İlk yıl içinde"), { scores: { future_structure: 85 } }),
      option("one_two", t("After one or two years", "Через один-два года", "Setelah satu atau dua tahun", "بعد سنة أو سنتين", "Bir veya iki yıl sonra"), { scores: { future_structure: 100 } }),
      option("three_plus", t("After three or more years", "Через три года или позже", "Setelah tiga tahun atau lebih", "بعد ثلاث سنوات أو أكثر", "Üç yıl veya daha sonra"), { scores: { future_structure: 70 }, flags: ["discussion:later_children_timeline"] }),
      option("depends", t("It depends on health, stability, and circumstances", "Зависит от здоровья, стабильности и обстоятельств", "Tergantung kesehatan, stabilitas, dan keadaan", "يعتمد على الصحة والاستقرار والظروف", "Sağlık, istikrar ve koşullara bağlı"), { scores: { future_structure: 100, honesty_self_awareness: 100 } }),
    ],
  },
  {
    id: "q25",
    chapter: "future",
    type: "single",
    required: true,
    prompt: t("Which financial structure feels healthiest?", "Какая финансовая модель кажется тебе самой здоровой?", "Struktur keuangan mana yang terasa paling sehat?", "أي هيكل مالي يبدو أكثر صحة؟", "Hangi mali düzen sana en sağlıklı gelir?"),
    options: [
      option("husband_provider", t("Husband as primary provider", "Муж — основной обеспечивающий", "Suami sebagai pencari nafkah utama", "الزوج هو المعيل الأساسي", "Kocanın ana sağlayıcı olması"), { scores: { future_structure: 100 } }),
      option("equal", t("Both contribute equally", "Оба вкладываются поровну", "Keduanya berkontribusi sama", "يساهم الطرفان بالتساوي", "İkisinin eşit katkı sağlaması"), { scores: { future_structure: 45 }, flags: ["discussion:equal_financial_contribution"] }),
      option("income", t("Contribution depends on income and circumstances", "Вклад зависит от дохода и обстоятельств", "Kontribusi tergantung penghasilan dan keadaan", "المساهمة حسب الدخل والظروف", "Katkının gelir ve koşullara bağlı olması"), { scores: { future_structure: 85 } }),
      option("shared_personal", t("Shared finances with personal spending accounts", "Общий бюджет с личными счетами на расходы", "Keuangan bersama dengan akun belanja pribadi", "أموال مشتركة مع حسابات إنفاق شخصية", "Ortak bütçe ve kişisel harcama hesapları"), { scores: { future_structure: 85 } }),
      option("separate", t("Mostly separate finances", "В основном раздельные финансы", "Sebagian besar keuangan terpisah", "أموال منفصلة في الغالب", "Mali durumun çoğunlukla ayrı olması"), { scores: { future_structure: 25 }, flags: ["discussion:mostly_separate_finances"] }),
      option("unconsidered", t("I have not thought about this", "Я об этом не думала", "Aku belum memikirkan ini", "لم أفكر في ذلك", "Bunu düşünmedim"), { scores: { future_structure: 45, honesty_self_awareness: 85 }, flags: ["discussion:financial_model_unformed"] }),
    ],
  },
  {
    id: "q26",
    chapter: "future",
    type: "single",
    required: true,
    prompt: t("How much influence should parents have after marriage?", "Какое влияние должны иметь родители после брака?", "Seberapa besar pengaruh orang tua setelah menikah?", "كم ينبغي أن يكون تأثير الوالدين بعد الزواج؟", "Evlilikten sonra ailelerin ne kadar etkisi olmalı?"),
    options: [
      option("advice", t("They give advice, while the couple decides", "Они советуют, а решение принимает пара", "Mereka memberi nasihat, pasangan yang memutuskan", "يقدمون النصيحة والزوجان يقرران", "Aileler tavsiye verir, çift karar verir"), { scores: { future_structure: 100 } }),
      option("approve", t("They should approve major decisions", "Они должны одобрять важные решения", "Mereka harus menyetujui keputusan besar", "ينبغي أن يوافقوا على القرارات الكبرى", "Büyük kararları onaylamalılar"), { scores: { future_structure: 45 }, flags: ["discussion:parental_approval_required"] }),
      option("parents_first", t("Their wishes should usually come first", "Их желания обычно должны быть на первом месте", "Keinginan mereka biasanya harus didahulukan", "غالباً ينبغي تقديم رغباتهم", "Onların istekleri çoğunlukla önce gelmeli"), { scores: { future_structure: 10 }, flags: ["hard:parents_control_marriage"] }),
      option("spouse_always", t("The spouse’s wishes should always come first", "Желания супруга всегда должны быть первыми", "Keinginan pasangan selalu harus didahulukan", "ينبغي تقديم رغبة الزوج دائماً", "Eşin isteği her zaman önce gelmeli"), { scores: { future_structure: 60 }, flags: ["discussion:spouse_always_first"] }),
      option("depends", t("It depends on the issue", "Зависит от вопроса", "Tergantung masalahnya", "يعتمد على الموضوع", "Konuya bağlı"), { scores: { future_structure: 75 } }),
    ],
  },
  {
    id: "q27",
    chapter: "future",
    type: "multi",
    required: true,
    prompt: t("Your family dislikes a marriage choice, but no abuse, dishonesty, or religious problem exists. What would you do? Select the steps you would take.", "Семье не нравится твой выбор брака, но нет насилия, лжи или религиозной проблемы. Что ты сделаешь? Выбери шаги.", "Keluargamu tidak menyukai pilihan pernikahan, tetapi tidak ada kekerasan, kebohongan, atau masalah agama. Apa yang kamu lakukan? Pilih langkahmu.", "لا تعجب عائلتك باختيار الزواج، من دون إساءة أو كذب أو مشكلة دينية. ماذا تفعلين؟ اختاري خطواتك.", "Ailen evlilik seçimini beğenmiyor ama istismar, yalan veya dini sorun yok. Ne yaparsın? Atacağın adımları seç."),
    options: [
      option("listen", t("Listen carefully and investigate their concerns", "Внимательно выслушать и проверить их опасения", "Mendengarkan dan menyelidiki kekhawatiran mereka", "أستمع جيداً وأتحقق من مخاوفهم", "Dikkatle dinleyip kaygılarını araştırırım"), { scores: { future_structure: 90, honesty_self_awareness: 100 } }),
      option("family_final", t("Let the family make the final decision", "Позволить семье принять окончательное решение", "Membiarkan keluarga mengambil keputusan akhir", "أدع العائلة تتخذ القرار النهائي", "Son kararı aileye bırakırım"), { scores: { future_structure: 5 }, flags: ["hard:family_final_decision"] }),
      option("secret", t("Continue secretly", "Продолжить тайно", "Melanjutkan secara diam-diam", "أستمر سراً", "Gizlice devam ederim"), { scores: { future_structure: 10, honesty_self_awareness: 15 }, flags: ["concern:secret_relationship_against_family"] }),
      option("cutoff", t("Cut off the family immediately", "Сразу прекратить общение с семьёй", "Langsung memutus hubungan dengan keluarga", "أقطع علاقتي بالعائلة فوراً", "Aileyle hemen ilişkiyi keserim"), { scores: { future_structure: 10, conflict_regulation: 10 }, flags: ["concern:immediate_family_cutoff"] }),
      option("mediator", t("Ask for a trusted mediator", "Обратиться к доверенному посреднику", "Meminta mediator yang tepercaya", "أطلب وسيطاً موثوقاً", "Güvenilir bir arabulucu isterim"), { scores: { future_structure: 100, conflict_regulation: 100 } }),
      option("couple_decide", t("Decide with my future spouse after considering the advice", "Решить с будущим супругом после учёта совета", "Memutuskan bersama calon pasangan setelah mempertimbangkan nasihat", "أقرر مع شريك حياتي بعد النظر في النصيحة", "Tavsiyeyi değerlendirdikten sonra gelecekteki eşimle karar veririm"), { scores: { future_structure: 100 } }),
    ],
  },
  {
    id: "q28",
    chapter: "honesty",
    type: "text",
    required: true,
    minLength: 20,
    maxLength: 1000,
    prompt: t("Which part of Naim’s personality sounds easiest for you?", "Какая часть характера Наима кажется тебе самой лёгкой для совместной жизни?", "Bagian mana dari kepribadian Naim yang terasa paling mudah bagimu?", "أي جانب من شخصية نعيم يبدو أسهل لك؟", "Naim'in kişiliğinin hangi yanı sana en kolay gelir?"),
  },
  {
    id: "q29",
    chapter: "honesty",
    type: "text",
    required: true,
    minLength: 20,
    maxLength: 1000,
    prompt: t("Which part worries you or feels difficult?", "Какая часть тревожит тебя или кажется трудной?", "Bagian mana yang membuatmu khawatir atau terasa sulit?", "أي جانب يقلقك أو يبدو صعباً؟", "Hangi yanı seni endişelendiriyor veya zor geliyor?"),
    helper: t("Every person has difficult parts. Please name at least one, even if it is small.", "У каждого есть сложные стороны. Назови хотя бы одну, даже небольшую.", "Setiap orang punya sisi sulit. Sebutkan setidaknya satu, meski kecil.", "لكل شخص جوانب صعبة. اذكري واحداً على الأقل ولو كان صغيراً.", "Herkesin zor yanları vardır. Küçük bile olsa en az birini söyle."),
  },
  {
    id: "q30",
    chapter: "honesty",
    type: "text",
    required: true,
    minLength: 30,
    maxLength: 1200,
    prompt: t("What would you need from Naim to feel safe, respected, and loved?", "Что тебе нужно от Наима, чтобы чувствовать безопасность, уважение и любовь?", "Apa yang kamu butuhkan dari Naim agar merasa aman, dihormati, dan dicintai?", "ماذا تحتاجين من نعيم لتشعري بالأمان والاحترام والحب؟", "Güvende, saygı görmüş ve sevilmiş hissetmek için Naim'den neye ihtiyacın olur?"),
  },
  {
    id: "q31",
    chapter: "honesty",
    type: "text",
    required: true,
    minLength: 30,
    maxLength: 1200,
    prompt: t("What would Naim need from you to feel safe, respected, and loved?", "Что Наиму нужно от тебя, чтобы чувствовать безопасность, уважение и любовь?", "Apa yang Naim butuhkan darimu agar merasa aman, dihormati, dan dicintai?", "ماذا يحتاج نعيم منك ليشعر بالأمان والاحترام والحب؟", "Naim'in güvende, saygı görmüş ve sevilmiş hissetmesi için senden neye ihtiyacı olur?"),
  },
  {
    id: "q32",
    chapter: "honesty",
    type: "single",
    required: true,
    prompt: t("Did you choose any answer because you thought Naim would prefer it?", "Ты выбрала какой-нибудь ответ, потому что думала, что Наим его предпочитает?", "Apakah kamu memilih jawaban karena merasa Naim akan menyukainya?", "هل اخترت إجابة لأنك ظننت أن نعيم يفضلها؟", "Naim'in tercih edeceğini düşündüğün için bir cevap seçtin mi?"),
    options: [
      option("no", t("No", "Нет", "Tidak", "لا", "Hayır"), { scores: { honesty_self_awareness: 100 } }),
      option("little", t("A little", "Немного", "Sedikit", "قليلاً", "Biraz"), { scores: { honesty_self_awareness: 75 }, flags: ["discussion:some_answer_performance"] }),
      option("yes", t("Yes", "Да", "Ya", "نعم", "Evet"), { scores: { honesty_self_awareness: 45 }, flags: ["discussion:answered_to_please"] }),
      option("unsure", t("I am unsure", "Не уверена", "Aku tidak yakin", "لست متأكدة", "Emin değilim"), { scores: { honesty_self_awareness: 65 }, flags: ["discussion:answer_performance_unclear"] }),
    ],
  },
  {
    id: "q32b",
    chapter: "honesty",
    type: "text",
    required: true,
    minLength: 20,
    maxLength: 1000,
    condition: { questionId: "q32", values: ["little", "yes", "unsure"] },
    prompt: t("Write the answer that feels more honest now.", "Напиши ответ, который сейчас кажется более честным.", "Tuliskan jawaban yang terasa lebih jujur sekarang.", "اكتبي الإجابة التي تبدو أكثر صدقاً الآن.", "Şimdi daha dürüst gelen cevabı yaz."),
  },
  {
    id: "q33",
    chapter: "honesty",
    type: "single",
    required: true,
    prompt: t("After reading everything, do you still want to continue talking?", "После всего прочитанного ты всё ещё хочешь продолжить общение?", "Setelah membaca semuanya, apakah kamu masih ingin terus berbicara?", "بعد قراءة كل شيء، هل ما زلت تريدين مواصلة الحديث؟", "Her şeyi okuduktan sonra hâlâ konuşmaya devam etmek istiyor musun?"),
    options: [
      option("yes", t("Yes", "Да", "Ya", "نعم", "Evet"), { scores: { intent_pace: 100 } }),
      option("slow", t("Yes, but slowly", "Да, но медленно", "Ya, tetapi perlahan", "نعم، لكن ببطء", "Evet ama yavaşça"), { scores: { intent_pace: 95, honesty_self_awareness: 100 } }),
      option("discuss", t("Yes, but we need to discuss a few things", "Да, но нам нужно кое-что обсудить", "Ya, tetapi kita perlu membicarakan beberapa hal", "نعم، لكن علينا مناقشة بعض الأمور", "Evet ama birkaç şeyi konuşmamız gerekiyor"), { scores: { intent_pace: 90, honesty_self_awareness: 100 } }),
      option("unsure", t("I am unsure", "Я не уверена", "Aku belum yakin", "لست متأكدة", "Emin değilim"), { scores: { intent_pace: 45, honesty_self_awareness: 90 }, flags: ["discussion:final_interest_unclear"] }),
      option("no", t("No", "Нет", "Tidak", "لا", "Hayır"), { scores: { intent_pace: 0 }, flags: ["hard:final_no"] }),
    ],
  },
  {
    id: "q34",
    chapter: "honesty",
    type: "text",
    required: false,
    minLength: 0,
    maxLength: 1200,
    prompt: t("What would you like to ask Naim before either of you decides anything?", "Что ты хочешь спросить у Наима до того, как кто-либо примет решение?", "Apa yang ingin kamu tanyakan kepada Naim sebelum kalian memutuskan apa pun?", "ماذا تريدين أن تسألي نعيم قبل أن يقرر أي منكما شيئاً؟", "İkiniz de bir karar vermeden önce Naim'e ne sormak istersin?"),
    placeholder: t("Ask anything. This is not a one-way interview.", "Спроси что угодно. Это не одностороннее собеседование.", "Tanyakan apa saja. Ini bukan wawancara satu arah.", "اسألي ما شئت. هذا ليس استجواباً من طرف واحد.", "İstediğini sor. Bu tek taraflı bir görüşme değil."),
  },
];

export const QUESTION_MAP = new Map(QUESTIONS.map((question) => [question.id, question]));

export function localize(value: LocalizedText | undefined, language: Language) {
  if (!value) return "";
  return value[language] || value.en;
}

export function answerMap(answers: StoredAnswer[] | Record<string, AnswerValue>) {
  if (Array.isArray(answers)) {
    return Object.fromEntries(answers.map((answer) => [answer.questionId, answer.value])) as Record<string, AnswerValue>;
  }
  return answers;
}

export function isQuestionVisible(question: QuestionDefinition, answers: StoredAnswer[] | Record<string, AnswerValue>) {
  if (!question.condition) return true;
  const values = answerMap(answers);
  const current = values[question.condition.questionId];
  if (Array.isArray(current)) return current.some((item) => question.condition?.values.includes(item));
  return typeof current === "string" && question.condition.values.includes(current);
}

export function questionsForChapter(chapterId: string, answers: StoredAnswer[] | Record<string, AnswerValue>) {
  return QUESTIONS.filter((question) => question.chapter === chapterId && isQuestionVisible(question, answers));
}

export function visibleMainQuestions(answers: StoredAnswer[] | Record<string, AnswerValue>) {
  return QUESTIONS.filter((question) => !question.gate && isQuestionVisible(question, answers));
}

export function validateAnswer(question: QuestionDefinition, value: AnswerValue | undefined) {
  if (!question.required && (value === undefined || value === "" || (Array.isArray(value) && value.length === 0))) return null;
  if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) return "required";
  if (question.type === "text" && typeof value === "string") {
    const length = value.trim().length;
    if (question.minLength && length < question.minLength) return "too_short";
    if (question.maxLength && length > question.maxLength) return "too_long";
  }
  return null;
}

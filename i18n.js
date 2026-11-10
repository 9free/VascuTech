/*
 * VascuTech website: language switcher (English / 简体中文 / 繁體中文).
 *
 * How it works
 *  - The HTML pages stay in English. They are the source text, what search engines
 *    index, and what shows if JavaScript is off.
 *  - On load this script finds every visible text node (and image alt text, page
 *    title and meta description), looks the English up in the TEXT table below, and
 *    swaps in the Chinese. Anything not in the table is left alone, so a missing
 *    translation falls back to English instead of breaking the page.
 *  - The chosen language is remembered in localStorage and is shared by all pages.
 *    A link such as  about.html?lang=zh-Hant  forces a language.
 *
 * Editing text
 *  - If you change English wording in an HTML file, change the matching key in TEXT
 *    (the key is the English text, with whitespace collapsed to single spaces).
 *  - Each value is [简体中文 (zh-Hans), 繁體中文 (zh-Hant, Hong Kong wording)].
 *  - References (<ol> lists of citations) are deliberately left in English.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'vt-lang';
  var LANGS = [
    { code: 'en',      htmlLang: 'en',        short: 'EN', label: 'English' },
    { code: 'zh-Hans', htmlLang: 'zh-Hans',   short: '简', label: '简体中文' },
    { code: 'zh-Hant', htmlLang: 'zh-Hant-HK', short: '繁', label: '繁體中文' }
  ];

  var TEXT = {
    /* ---------- page titles and descriptions ---------- */
    'VascuTech Medical | Safer vascular access starts with better training':
      ['VascuTech Medical | 更安全的血管通路，始于更好的培训', 'VascuTech Medical | 更安全的血管通路，始於更好的培訓'],
    'VascuTech Medical builds AI-guided practice tools and vein-imaging technology that help nursing and medical students learn IV cannulation.':
      ['VascuTech Medical 研发 AI 引导的练习工具和静脉成像技术，帮助护理和医学专业学生学习静脉置管。', 'VascuTech Medical 研發 AI 引導的練習工具及靜脈成像技術，幫助護理及醫學學生學習靜脈插管。'],
    'VascuAI is an AI-guided practice companion for IV cannulation, in closed preview.':
      ['VascuAI 是一款 AI 引导的静脉置管练习伙伴，目前处于封闭测试阶段。', 'VascuAI 是一款 AI 引導的靜脈插管練習夥伴，目前處於封閉測試階段。'],
    'DualVein is a near-infrared vein visualisation device for teaching labs and manikin practice.':
      ['DualVein 是一款近红外静脉显影设备，适用于教学实验室和模拟人练习。', 'DualVein 是一款近紅外線靜脈顯影設備，適用於教學實驗室及人體模型練習。'],
    'VascuTech Medical | About and collaborate':
      ['VascuTech Medical | 关于我们与合作', 'VascuTech Medical | 關於我們及合作'],
    'About VascuTech Medical, the team, milestones and how to collaborate with us.':
      ['了解 VascuTech Medical、团队、里程碑，以及如何与我们合作。', '了解 VascuTech Medical、團隊、里程碑，以及如何與我們合作。'],

    /* ---------- navigation and footer (all pages) ---------- */
    'Home': ['首页', '首頁'],
    'About': ['关于我们', '關於我們'],
    'Collaborate': ['合作', '合作'],
    'Contact': ['联系我们', '聯絡我們'],
    'VascuTech Medical Limited · Hong Kong': ['VascuTech Medical Limited · 香港', 'VascuTech Medical Limited · 香港'],
    '© 2026 VascuTech Medical Limited. VascuAI is an education and practice tool, and DualVein is a teaching device. Neither is a medical device for clinical use.':
      ['© 2026 VascuTech Medical Limited. VascuAI 是教育和练习工具，DualVein 是教学设备，两者均不是用于临床的医疗器械。', '© 2026 VascuTech Medical Limited. VascuAI 是教育及練習工具，DualVein 是教學設備，兩者均非作臨床用途的醫療器械。'],
    'VascuTech Medical Limited': ['VascuTech Medical Limited', 'VascuTech Medical Limited'],

    /* ---------- shared sections ---------- */
    'How it works': ['运作方式', '運作方式'],
    'References': ['参考文献', '參考文獻'],
    'Closed preview': ['封闭测试', '封閉測試'],
    'Prototype in development': ['原型开发中', '原型開發中'],
    'HKChallenge+ 2026, 12th Hong Kong University Student Innovation and Entrepreneurship Competition':
      ['HKChallenge+ 2026，第十二届香港大学生创新及创业大赛', 'HKChallenge+ 2026，第十二屆香港大學生創新及創業大賽'],
    'HSITP, Hong Kong-Shenzhen Innovation and Technology Park':
      ['HSITP，港深创新及科技园', 'HSITP，港深創新及科技園'],
    'The James Dyson Award': ['James Dyson 设计大奖', 'James Dyson 設計大獎'],
    'James Dyson Award': ['James Dyson 设计大奖', 'James Dyson 設計大獎'],
    'James Dyson Award 2026': ['James Dyson 设计大奖 2026', 'James Dyson 設計大獎 2026'],
    '2026 · Hong Kong national winner': ['2026 · 香港区冠军', '2026 · 香港區冠軍'],
    'SPIN · Life and Health Technology': ['SPIN · 生命健康科技', 'SPIN · 生命健康科技'],
    'Recognised and supported by': ['获以下机构认可与支持', '獲以下機構認可及支持'],
    'Help us build this properly.': ['与我们一起把它做好。', '與我們一起把它做好。'],
    'Hong Kong national winner.': ['香港区冠军。', '香港區冠軍。'],
    'DualVein presented in the competition': ['DualVein 于比赛中展示', 'DualVein 於比賽中展示'],
    'DualVein presented in the competition.': ['DualVein 于比赛中展示。', 'DualVein 於比賽中展示。'],

    /* ---------- home (index.html) ---------- */
    'Vascular access training · Hong Kong': ['血管通路培训 · 香港', '血管通路培訓 · 香港'],
    'Safer vascular access starts with': ['更安全的血管通路，始于', '更安全的血管通路，始於'],
    'better training.': ['更好的培训。', '更好的培訓。'],
    'We build AI-guided practice tools and vein-imaging technology that help nursing and medical students learn IV cannulation with confidence, before they reach a patient.':
      ['我们开发 AI 引导的练习工具和静脉成像技术，帮助护理和医学专业学生在接触真实患者之前，自信地学习静脉置管。', '我們開發 AI 引導的練習工具及靜脈成像技術，幫助護理及醫學學生在接觸真實病人之前，有信心地學習靜脈插管。'],
    'Why it matters': ['为什么重要', '為甚麼重要'],
    'Our products': ['我们的产品', '我們的產品'],
    'A trainee practising cannulation with the DualVein prototype, which projects a green vein map onto the hand':
      ['学员正在使用 DualVein 原型练习置管，原型将绿色静脉图投射到手上', '學員正使用 DualVein 原型練習插管，原型將綠色靜脈圖投影到手上'],
    'Working prototype · vein map projected on skin':
      ['可运作原型 · 静脉图投射于皮肤', '可運作原型 · 靜脈圖投影於皮膚'],
    'IV cannulation is learned by doing, and trainees get too little of it.':
      ['静脉置管要靠动手练习才能学会，而学员的练习机会太少。', '靜脈插管須靠動手練習才能掌握，而學員的練習機會太少。'],
    'of trainees surveyed get under 10 hours of dedicated IV instruction.':
      ['受访学员接受的静脉置管专门培训不足 10 小时。', '受訪學員接受的靜脈插管專門培訓不足 10 小時。'],
    'have no access to a simulation lab or task trainer.':
      ['没有机会使用模拟实验室或技能训练模型。', '沒有機會使用模擬實驗室或技能訓練模型。'],
    'have seen or caused a failed insertion that distressed a patient.':
      ['曾目睹或造成令患者痛苦的穿刺失败。', '曾目睹或造成令病人痛苦的穿刺失敗。'],
    'VascuTech trainee survey, 2026: nursing students, medical students, junior doctors and phlebotomists in Hong Kong, mainland China, the UK, Bangladesh, Thailand, Vietnam and the Philippines.':
      ['VascuTech 学员调查，2026 年：来自香港、中国内地、英国、孟加拉国、泰国、越南和菲律宾的护理学生、医学生、初级医生和采血员。', 'VascuTech 學員調查，2026 年：來自香港、中國內地、英國、孟加拉、泰國、越南及菲律賓的護理學生、醫科生、初級醫生及抽血員。'],
    'The evidence behind this': ['背后的证据', '背後的證據'],
    'Repeated attempts': ['多次尝试', '多次嘗試'],
    'In a cohort of 1,063 adults cannulated by experienced anaesthesia staff, 17% failed at the first attempt.':
      ['在一项由经验丰富的麻醉科人员为 1,063 名成人置管的队列研究中，17% 首次尝试失败。', '在一項由經驗豐富的麻醉科人員為 1,063 名成人插管的隊列研究中，17% 首次嘗試失敗。'],
    'Catheters that fail': ['失效的导管', '失效的導管'],
    'A literature review puts peripheral IV catheter failure at 35% to 50%.':
      ['一项文献综述指出，外周静脉导管的失败率为 35% 至 50%。', '一項文獻回顧指出，周邊靜脈導管的失敗率為 35% 至 50%。'],
    'An audit of 40,620 catheters in 51 countries found many symptomatic, idle or poorly dressed.':
      ['一项涵盖 51 个国家 40,620 条导管的审查发现，许多导管出现症状、闲置或敷料处理不当。', '一項涵蓋 51 個國家、40,620 條導管的審查發現，不少導管出現症狀、閒置或敷料處理欠佳。'],
    'Local complications': ['局部并发症', '局部併發症'],
    'Phlebitis and catheter-related infection are recognised risks of peripheral venous catheters.':
      ['静脉炎和导管相关感染是外周静脉导管公认的风险。', '靜脈炎及導管相關感染是周邊靜脈導管公認的風險。'],
    'Harder for some patients': ['对部分患者更困难', '對部分病人更困難'],
    'Veins that cannot be palpated or seen, a diameter of 2 mm or less, and a history of difficult access each predicted a failed first attempt.':
      ['摸不到或看不见的静脉、直径不超过 2 毫米，以及有穿刺困难史，均可预测首次尝试失败。', '摸不到或看不見的靜脈、直徑不超過 2 毫米，以及有穿刺困難病史，均可預測首次嘗試失敗。'],
    'The scale was later validated across several hospitals.':
      ['该量表后来在多家医院得到验证。', '該量表其後在多家醫院獲得驗證。'],
    'More from our trainee survey': ['学员调查的更多发现', '學員調查的更多發現'],
    '75% feel least prepared for needle insertion technique, and 56.3% rate their confidence 2 out of 5 or lower for a first unsupervised insertion. Obese patients with deeply buried veins were named hardest to cannulate by every respondent. Trainees most want real-time feedback on insertion (75%) and step-by-step procedural guidance (75%).':
      ['75% 的学员认为自己对进针技术准备最不足，56.3% 的学员对首次独立穿刺的信心评分为 2 分或以下（满分 5 分）。所有受访者都认为，静脉位置较深的肥胖患者最难置管。学员最希望获得穿刺过程中的实时反馈（75%）和逐步的操作指导（75%）。', '75% 的學員認為自己對進針技術準備最不足，56.3% 的學員對首次獨立穿刺的信心評分為 2 分或以下（滿分 5 分）。所有受訪者都認為，靜脈位置較深的肥胖病人最難插管。學員最希望獲得穿刺過程中的即時回饋（75%）及逐步的操作指導（75%）。'],
    'Two tools for one skill.': ['两种工具，一项技能。', '兩種工具，一項技能。'],
    'An AI-guided practice companion for IV cannulation: phase-by-phase feedback on recorded attempts, a clinical chatbot grounded in curated references, and a learning hub.':
      ['AI 引导的静脉置管练习伙伴：对录制的练习逐阶段给出反馈，配有基于精选参考资料的临床聊天机器人，以及学习中心。', 'AI 引導的靜脈插管練習夥伴：為錄影的練習逐階段提供回饋，配備以精選參考資料為依據的臨床聊天機械人，以及學習中心。'],
    'Explore VascuAI →': ['了解 VascuAI →', '了解 VascuAI →'],
    'A portable near-infrared vein visualiser with AI vein segmentation that projects the vein pattern onto the skin, built as a teaching aid for manikin and phantom practice.':
      ['便携式近红外静脉显影仪，配备 AI 静脉分割功能，可将静脉分布投射到皮肤上，作为模拟人和体模练习的教学辅助工具。', '便攜式近紅外線靜脈顯影儀，配備 AI 靜脈分割功能，可將靜脈分布投影到皮膚上，作為人體模型及仿體練習的教學輔助工具。'],
    'Explore DualVein →': ['了解 DualVein →', '了解 DualVein →'],
    'Working DualVein prototype with a hand resting on its base':
      ['可运作的 DualVein 原型，一只手放在底座上', '可運作的 DualVein 原型，一隻手放在底座上'],
    'How they fit together': ['两者如何配合', '兩者如何配合'],
    'Learn it. See it. Practise it.': ['学习，看见，练习。', '學習、看見、練習。'],
    'Learn': ['学习', '學習'],
    'Anatomy, technique and complications in the VascuAI learning hub, with a chatbot that answers from curated clinical references.':
      ['在 VascuAI 学习中心了解解剖、技术和并发症，并可向基于精选临床参考资料作答的聊天机器人提问。', '在 VascuAI 學習中心認識解剖、技術及併發症，並可向以精選臨床參考資料作答的聊天機械人提問。'],
    'See': ['看见', '看見'],
    'DualVein shows where the veins are in near-infrared light, so learners connect surface anatomy with what lies beneath.':
      ['DualVein 以近红外光显示静脉的位置，让学习者把体表解剖与皮下结构联系起来。', 'DualVein 以近紅外光顯示靜脈位置，讓學習者把體表解剖與皮下結構連繫起來。'],
    'Practise': ['练习', '練習'],
    'Record an attempt on a manikin and get phase-by-phase feedback to review and repeat, alongside an instructor.':
      ['在模拟人上录制一次练习，获得逐阶段反馈，并在导师指导下回顾和重复练习。', '在人體模型上錄影練習，獲得逐階段回饋，並在導師指導下回顧及重複練習。'],
    'Our tools support instructors and do not replace supervised clinical practice. They are for education and practice, not for clinical decisions.':
      ['我们的工具旨在辅助导师教学，不能取代在监督下进行的临床实践。它们仅用于教育和练习，不用于临床决策。', '我們的工具旨在輔助導師教學，不能取代有人督導的臨床實習。工具僅供教學及練習之用，不可用作臨床決策。'],
    'For educators and researchers': ['致教育工作者与研究人员', '致教育工作者及研究人員'],
    'We are looking for nursing educators, simulation experts and biomedical engineers to give feedback, run small pilots and shape how these tools are used in teaching.':
      ['我们正在寻找护理教育工作者、模拟教学专家和生物医学工程师，欢迎你们提供反馈、开展小规模试点，并共同塑造这些工具在教学中的使用方式。', '我們正在尋找護理教育工作者、模擬教學專家及生物醫學工程師，歡迎你們提供意見、進行小規模試行，並共同塑造這些工具在教學中的使用方式。'],
    'Start a conversation': ['开始交流', '展開交流'],

    /* ---------- VascuAI (vascuai.html) ---------- */
    'An AI-guided practice companion for IV cannulation.': ['AI 引导的静脉置管练习伙伴。', 'AI 引導的靜脈插管練習夥伴。'],
    'Record a practice attempt, get feedback on each phase of the technique, and revisit the fundamentals with a chatbot that answers from curated clinical references.':
      ['录制一次练习，获得每个操作阶段的反馈，并通过基于精选临床参考资料作答的聊天机器人温习基础知识。', '錄影一次練習，獲得每個操作階段的回饋，並透過以精選臨床參考資料作答的聊天機械人溫習基礎知識。'],
    'Request early access': ['申请抢先体验', '申請搶先體驗'],
    'Pilot with us': ['与我们一起试点', '與我們一起試行'],
    'Who it is for': ['适用对象', '適用對象'],
    'For people learning IV cannulation.': ['为学习静脉置管的人而设。', '為學習靜脈插管的人而設。'],
    'Nursing students': ['护理学生', '護理學生'],
    'Medical students': ['医学生', '醫科生'],
    'Junior doctors': ['初级医生', '初級醫生'],
    'Phlebotomists': ['采血员', '抽血員'],
    'Nurse educators and simulation teams': ['护理教师和模拟教学团队', '護理導師及模擬教學團隊'],
    'Built for the many trainees who get little supervised practice time. It adds repetitions and feedback between sessions with an instructor.':
      ['专为大量缺乏带教练习时间的学员打造。它在与导师的课程之间，增加练习次数和反馈。', '專為大量缺乏督導練習時間的學員而設。它在與導師的課堂之間，增加練習次數及回饋。'],
    'What it does': ['功能介绍', '功能介紹'],
    'Four tools in one app.': ['一个应用，四种工具。', '一個應用程式，四種工具。'],
    'Training Validator': ['训练验证器', '訓練驗證器'],
    'Record or upload a practice attempt on a manikin. The app breaks it into the phases of the procedure (needle preparation, site cleaning, vein location, insertion, suction and securing) and gives feedback on each.':
      ['在模拟人上录制或上传一次练习。应用会将其拆分为操作的各个阶段（准备针具、消毒穿刺部位、定位静脉、进针、回抽和固定），并对每个阶段给出反馈。', '在人體模型上錄影或上載一次練習。應用程式會將過程拆分為各個操作階段（準備針具、清潔穿刺部位、尋找靜脈、進針、回抽及固定），並就每個階段提供回饋。'],
    'Training Validator screen with phase-by-phase feedback':
      ['训练验证器界面，显示逐阶段反馈', '訓練驗證器介面，顯示逐階段回饋'],
    'Phase detection is under active development. We make no accuracy claims yet.':
      ['阶段识别功能仍在积极开发中，我们暂不声称任何准确率。', '階段偵測功能仍在積極開發中，我們暫不宣稱任何準確率。'],
    'Clinical Chatbot': ['临床聊天机器人', '臨床聊天機械人'],
    'Ask about IV insertion, complications and technique. Answers are retrieved from 107 curated clinical reference documents, and the chatbot says so when its references do not cover a question.':
      ['可咨询静脉穿刺、并发症和操作技术。答案检索自 107 份精选临床参考文献；若参考资料未涵盖某个问题，聊天机器人会如实说明。', '可查詢靜脈穿刺、併發症及操作技術。答案檢索自 107 份精選臨床參考文獻；若參考資料未涵蓋某個問題，聊天機械人會如實說明。'],
    'Scenario Library': ['情景库', '情境庫'],
    'Risk-tiered patient scenarios, from a practice mannequin to difficult-access adults, so learners meet variety before real patients.':
      ['按风险分级的患者情景，从练习用模拟人到穿刺困难的成人，让学习者在面对真实患者之前接触各种情况。', '按風險分級的病人情境，從練習用人體模型到穿刺困難的成人，讓學習者在面對真實病人之前接觸各種情況。'],
    'Learning Hub': ['学习中心', '學習中心'],
    'Vein anatomy guides, clinical guidelines and a self-assessment quiz to revise the foundations that trainees told us they most often forget. A session history lets learners review past chats and practice attempts.':
      ['静脉解剖指南、临床指引和自测题，帮助复习学员反映最容易遗忘的基础知识。会话记录让学习者回顾过往的聊天和练习。', '靜脈解剖指南、臨床指引及自我測驗，協助溫習學員表示最常遺忘的基礎知識。對話紀錄讓學習者回顧過往的聊天及練習。'],
    'VascuAI Learning Hub with navigation and a quiz question':
      ['VascuAI 学习中心，显示导航栏和一道测验题', 'VascuAI 學習中心，顯示導覽列及一道測驗題'],
    'Practise. Record. Improve.': ['练习，录制，改进。', '練習、錄影、改進。'],
    'Practise on a manikin': ['在模拟人上练习', '在人體模型上練習'],
    'Pick a scenario and follow the steps in the app.': ['选择一个情景，按照应用中的步骤操作。', '選擇一個情境，按照應用程式中的步驟操作。'],
    'Record or upload': ['录制或上传', '錄影或上載'],
    'Film the attempt on a phone and upload it.': ['用手机拍摄练习过程并上传。', '用手機拍攝練習過程並上載。'],
    'Review phase by phase': ['逐阶段回顾', '逐階段回顧'],
    'See how each phase went, then try again.': ['查看每个阶段的表现，然后再试一次。', '查看每個階段的表現，然後再試一次。'],
    'Ask and revise': ['提问与温习', '發問與溫習'],
    'Use the chatbot and learning hub to fill knowledge gaps.': ['借助聊天机器人和学习中心补足知识缺口。', '借助聊天機械人及學習中心補足知識缺口。'],
    'Where it stands': ['目前进度', '目前進度'],
    'In closed preview.': ['封闭测试中。', '封閉測試中。'],
    'Teach IV skills? Try VascuAI with your students.': ['教授静脉置管技能？与你的学生一起试用 VascuAI。', '教授靜脈插管技能？與你的學生一起試用 VascuAI。'],
    'We are running small pilots with nursing and simulation teams and want your feedback on how it fits your curriculum.':
      ['我们正与护理和模拟教学团队开展小规模试点，希望听取你对它如何融入课程的意见。', '我們正與護理及模擬教學團隊進行小規模試行，希望聽取你對它如何融入課程的意見。'],
    'Discuss a pilot': ['洽谈试点', '洽談試行'],

    /* ---------- DualVein (dualvein.html) ---------- */
    'James Dyson Award 2026 · Hong Kong national winner': ['James Dyson 设计大奖 2026 · 香港区冠军', 'James Dyson 設計大獎 2026 · 香港區冠軍'],
    'Portable AI guidance for vein injection learning.': ['便携式 AI 辅助，助力静脉注射学习。', '便攜式 AI 輔助，助力靜脈注射學習。'],
    'A near-infrared device that shows trainees where veins run and projects the vein map onto the skin, designed for teaching labs and practice on manikins and phantoms.':
      ['一款近红外设备，向学员显示静脉走向，并将静脉图投射到皮肤上，专为教学实验室以及在模拟人和体模上的练习而设计。', '一款近紅外線設備，向學員顯示靜脈走向，並將靜脈圖投影到皮膚上，專為教學實驗室以及在人體模型和仿體上的練習而設計。'],
    'Collaborate on DualVein': ['参与 DualVein 合作', '參與 DualVein 合作'],
    'See the evidence': ['查看证据', '查看證據'],
    'What it is': ['它是什么', '它是甚麼'],
    'See the vein before the needle.': ['进针之前，先看见静脉。', '入針之前，先看見靜脈。'],
    'DualVein lights the arm in near-infrared, outlines the veins with AI and projects the pattern onto the skin, so learners can connect what they see on the surface with the anatomy beneath.':
      ['DualVein 以近红外光照射手臂，通过 AI 勾勒出静脉轮廓，并将图案投射到皮肤上，让学习者把体表所见与皮下解剖联系起来。', 'DualVein 以近紅外光照射手臂，透過 AI 勾勒出靜脈輪廓，並將圖案投影到皮膚上，讓學習者把體表所見與皮下解剖連繫起來。'],
    'Illuminate, capture, segment, project.': ['照射、采集、分割、投射。', '照射、擷取、分割、投影。'],
    'Illuminate': ['照射', '照射'],
    'Near-infrared light shone on the arm.': ['近红外光照射手臂。', '近紅外光照射手臂。'],
    'Capture': ['采集', '擷取'],
    'A camera records the near-infrared image.': ['摄像头拍摄近红外图像。', '鏡頭拍攝近紅外圖像。'],
    'Segment': ['分割', '分割'],
    'AI outlines the vein pattern.': ['AI 勾勒出静脉分布。', 'AI 勾勒出靜脈分布。'],
    'Project': ['投射', '投影'],
    'The map is shown on the skin for the learner.': ['静脉图显示在皮肤上，供学习者参考。', '靜脈圖顯示在皮膚上，供學習者參考。'],
    'In use': ['实际使用', '實際使用'],
    'Practising with the vein map in view.': ['在静脉图的辅助下练习。', '在靜脈圖輔助下練習。'],
    'A trainee practising needle insertion on a manikin hand while the DualVein prototype projects the vein map; the desktop interface is open on the laptop':
      ['学员在模拟人手上练习进针，DualVein 原型投射出静脉图；笔记本电脑上打开着桌面界面', '學員在人體模型手上練習進針，DualVein 原型投影出靜脈圖；手提電腦上開啟了桌面介面'],
    'Needle practice with the projected vein map': ['借助投射的静脉图练习进针', '借助投影的靜脈圖練習進針'],
    'Prototype projecting a green vein map onto the back of a hand':
      ['原型将绿色静脉图投射到手背上', '原型將綠色靜脈圖投影到手背上'],
    'Vein map on skin': ['皮肤上的静脉图', '皮膚上的靜脈圖'],
    'Engineering': ['工程设计', '工程設計'],
    'Compact by design.': ['紧凑设计。', '緊湊設計。'],
    'Imaging, illumination and processing integrated into a single portable unit, built for the bench and the classroom.':
      ['成像、照明和处理集成于一个便携单元，适用于实验台和课堂。', '成像、照明及處理整合於一個便攜單元，適用於實驗工作枱和課堂。'],
    'Exploded render of the DualVein device showing its internal construction':
      ['DualVein 设备爆炸图，展示其内部结构', 'DualVein 設備爆炸圖，展示其內部結構'],
    'Evidence': ['证据', '證據'],
    'What published studies say about near-infrared vein visualisation.':
      ['已发表的研究如何评价近红外静脉显影。', '已發表的研究如何評價近紅外線靜脈顯影。'],
    'The evidence is encouraging for teaching and for older patients, and mixed in other clinical groups. That is why we build DualVein as a learning aid.':
      ['证据显示，该技术在教学和老年患者中前景可期，在其他临床群体中则结果不一。这正是我们把 DualVein 打造为学习辅助工具的原因。', '證據顯示，該技術在教學及年長病人身上前景可期，在其他臨床群組中則結果不一。這正是我們把 DualVein 打造為學習輔助工具的原因。'],
    'Encouraging:': ['令人鼓舞：', '令人鼓舞：'],
    'nursing education': ['护理教育', '護理教育'],
    'patients aged 65 and over': ['65 岁及以上患者', '65 歲或以上病人'],
    'Mixed:': ['结果不一：', '結果不一：'],
    'children with dark skin, sickle cell disease': ['深肤色儿童、镰状细胞病', '深膚色兒童、鐮狀細胞病'],
    'Read the studies and references': ['阅读研究与参考文献', '閱讀研究及參考文獻'],
    'In nursing education': ['护理教育方面', '護理教育方面'],
    'Faster site selection for nursing students.': ['护理学生选择穿刺部位更快。', '護理學生選擇穿刺部位更快。'],
    'Fukuroku and colleagues': ['Fukuroku 及其同事', 'Fukuroku 及同事'],
    'asked second-year nursing students to select forearm venipuncture sites on volunteers with a tourniquet only, with a near-infrared vein display only, and with both (52 trials). Site selection was significantly faster with the display, particularly at difficult sites. The quality of venipuncture did not differ significantly. The authors concluded that such equipment can help develop practical skills, especially for elderly patients.':
      ['邀请二年级护理学生在志愿者身上选择前臂静脉穿刺部位，分别在仅用止血带、仅用近红外静脉显示仪、两者并用的条件下进行（共 52 次试验）。使用显示仪时选择部位的速度明显更快，尤其是在困难部位。穿刺质量没有显著差异。作者认为，这类设备有助于培养实操技能，尤其适用于老年患者。', '邀請二年級護理學生在義工身上選擇前臂靜脈穿刺部位，分別在只用止血帶、只用近紅外靜脈顯示儀，以及兩者並用的條件下進行（共 52 次試驗）。使用顯示儀時選擇部位的速度明顯較快，尤其是在困難部位。穿刺質素沒有顯著差異。作者認為，這類設備有助培養實務技能，尤其適用於年長病人。'],
    'Older patients, pooled analysis': ['老年患者的汇总分析', '年長病人的匯總分析'],
    'Meta-analysis of eight studies in adults aged 65 and over: higher first-attempt success (odds ratio 2.36, 95% CI 1.73 to 3.21) and shorter procedures. The authors rate the certainty of evidence as limited by heterogeneity and risk of bias.':
      ['对 8 项针对 65 岁及以上成人的研究进行荟萃分析：首次尝试成功率更高（比值比 2.36，95% 置信区间 1.73 至 3.21），操作时间更短。作者指出，证据的确定性受异质性和偏倚风险所限。', '對 8 項針對 65 歲或以上成人的研究進行薈萃分析：首次嘗試成功率較高（比值比 2.36，95% 置信區間 1.73 至 3.21），操作時間較短。作者指出，證據的確定性受異質性及偏倚風險所限。'],
    'Finding more cannulation sites': ['发现更多置管部位', '找到更多插管位置'],
    'In 384 adults, an infrared vein finder increased the number of potential cannulation sites identified, compared with unaided eyesight, in all patient subgroups studied.':
      ['在 384 名成人中，与肉眼观察相比，红外静脉定位仪在所有研究的患者亚组中均增加了可识别的潜在置管部位数量。', '在 384 名成人中，與肉眼觀察相比，紅外線靜脈定位儀在所有研究的病人分組中，均增加了可識別的潛在插管位置數目。'],
    'Hospital quality improvement': ['医院质量改进项目', '醫院質素改善項目'],
    'After a near-infrared device was introduced on hospital wards, success rate, number of attempts and procedure time improved. The authors call for further evaluation.':
      ['在医院病房引入近红外设备后，成功率、穿刺次数和操作时间均有改善。作者呼吁开展进一步评估。', '在醫院病房引入近紅外線設備後，成功率、穿刺次數及操作時間均有改善。作者呼籲進行進一步評估。'],
    'Where it has not clearly helped': ['尚未显示明确帮助之处', '未見明顯幫助之處'],
    'We include these because researchers should see the full picture.':
      ['我们列出这些，是因为研究人员应当看到全貌。', '我們列出這些，是因為研究人員應當看到全貌。'],
    'Children with dark skin': ['深肤色儿童', '深膚色兒童'],
    ':': ['：', '：'],
    'first-attempt success of 63% with a near-infrared device against 51% without, not statistically significant.':
      ['使用近红外设备的首次成功率为 63%，未使用为 51%，差异无统计学意义。', '使用近紅外線設備的首次成功率為 63%，未使用則為 51%，差異沒有統計學意義。'],
    'Adults with sickle cell disease': ['镰状细胞病成人患者', '鐮狀細胞病成人病人'],
    'no reduction in venepuncture attempts, though patients reported less procedural pain.':
      ['静脉穿刺次数并未减少，但患者报告操作疼痛有所减轻。', '靜脈穿刺次數並未減少，但病人表示操作時的痛楚有所減輕。'],
    'We read this as support for vein visualisation as a learning aid, not as proof of clinical benefit. DualVein is a teaching device for manikin and phantom practice. It is not intended for use on patients.':
      ['我们将这些结果解读为对静脉显影作为学习辅助工具的支持，而非临床获益的证明。DualVein 是用于模拟人和体模练习的教学设备，不适用于患者。', '我們將這些結果解讀為對靜脈顯影作為學習輔助工具的支持，而非臨床益處的證明。DualVein 是用於人體模型及仿體練習的教學設備，不適用於病人。'],
    'References (6 sources)': ['参考文献（6 项来源）', '參考文獻（6 項來源）'],
    'Recognition': ['荣誉与认可', '榮譽與認可'],
    'Where DualVein has been noticed.': ['DualVein 获得关注之处。', 'DualVein 獲得關注之處。'],
    'National winner, Hong Kong.': ['香港区冠军。', '香港區冠軍。'],
    'Life and Health Technology programme': ['生命健康科技计划', '生命健康科技計劃'],
    'Work on optical imaging, vein segmentation or simulation training?':
      ['从事光学成像、静脉分割或模拟培训工作？', '從事光學成像、靜脈分割或模擬培訓工作？'],
    'We are looking for researchers and educators to test DualVein and give honest feedback.':
      ['我们正在寻找研究人员和教育工作者试用 DualVein 并给出坦率的反馈。', '我們正在尋找研究人員和教育工作者試用 DualVein 並給予坦率的回饋。'],
    'Get in touch': ['联系我们', '聯絡我們'],

    /* ---------- About (about.html) ---------- */
    'About VascuTech': ['关于 VascuTech', '關於 VascuTech'],
    'Making medical learning': ['让医学学习', '讓醫學學習'],
    'more accessible.': ['更加普及。', '更為普及。'],
    'We are a Hong Kong team building affordable, AI-supported tools that help healthcare students practise vascular access with more repetition, clearer feedback and less cost.':
      ['我们是一支来自香港的团队，致力开发价格实惠、由 AI 支持的工具，帮助医疗专业学生通过更多练习、更清晰的反馈和更低的成本掌握静脉穿刺技能。', '我們是一支來自香港的團隊，致力開發價格相宜、由 AI 支援的工具，幫助醫療專業學生透過更多練習、更清晰的回饋及更低的成本掌握靜脈穿刺技能。'],
    'Team': ['团队', '團隊'],
    'The people behind it.': ['背后的人。', '背後的人。'],
    'Co-founder and Chief Technical Officer': ['联合创始人兼首席技术官', '聯合創辦人兼首席技術官'],
    'Co-founder and CEO': ['联合创始人兼首席执行官', '聯合創辦人兼行政總裁'],
    'Chief Marketing Officer': ['首席营销官', '首席營銷官'],
    'Milestones': ['里程碑', '里程碑'],
    'Where we are.': ['我们的进展。', '我們的進展。'],
    'VascuAI closed preview': ['VascuAI 封闭测试', 'VascuAI 封閉測試'],
    'AI-guided IV practice companion in early testing.': ['AI 引导的静脉置管练习伙伴处于早期测试阶段。', 'AI 引導的靜脈插管練習夥伴處於早期測試階段。'],
    'HSITP SPIN Milestone 1': ['HSITP SPIN 里程碑一', 'HSITP SPIN 里程碑一'],
    'Completed. Milestone 2 follows in early 2027.': ['已完成。里程碑二将于 2027 年初展开。', '已完成。里程碑二將於 2027 年初展開。'],
    'In the news': ['媒体报道', '媒體報道'],
    'Coverage of DualVein.': ['DualVein 的相关报道。', 'DualVein 的相關報道。'],
    'Reports on DualVein winning the James Dyson Award in Hong Kong, in English and Chinese.':
      ['关于 DualVein 夺得香港 James Dyson 设计大奖的报道，包括英文和中文媒体。', '關於 DualVein 奪得香港 James Dyson 設計大獎的報道，包括英文及中文媒體。'],
    'Sep 2026': ['2026 年 9 月', '2026 年 9 月'],
    '16 Sep 2026': ['2026 年 9 月 16 日', '2026 年 9 月 16 日'],
    '27 Sep 2026': ['2026 年 9 月 27 日', '2026 年 9 月 27 日'],
    '26 Oct 2026': ['2026 年 10 月 26 日', '2026 年 10 月 26 日'],
    "2026 national winners announced, with DualVein as Hong Kong's winner":
      ['2026 年各地区冠军公布，DualVein 为香港区冠军', '2026 年各地區冠軍公佈，DualVein 為香港區冠軍'],
    'Official': ['官方', '官方'],
    '中文 · Print': ['中文 · 纸媒', '中文 · 印刷版'],
    'English': ['英文', '英文'],
    'Feature on DualVein and its Hong Kong win (US East edition, p. 33)':
      ['DualVein 及其夺得香港区冠军的专题报道（美东版，第 33 页）', 'DualVein 及其奪得香港區冠軍的專題報道（美東版，第 33 頁）'],
    'An affordable AI vein visualiser wins the Hong Kong James Dyson Award':
      ['价格实惠的 AI 静脉显影仪夺得香港 James Dyson 设计大奖', '價格相宜的 AI 靜脈顯影儀奪得香港 James Dyson 設計大獎'],
    'We are looking for honest feedback and research partners, not endorsements.':
      ['我们寻求的是坦率的反馈和研究伙伴，而非背书。', '我們尋求的是坦率的回饋及研究夥伴，而非背書。'],
    'Educators': ['教育工作者', '教育工作者'],
    'Nursing and medical educators who teach IV skills: try VascuAI and tell us where it fits your curriculum.':
      ['教授静脉置管技能的护理和医学教育工作者：试用 VascuAI，并告诉我们它适合课程的哪个环节。', '教授靜脈插管技能的護理及醫學教育工作者：試用 VascuAI，並告訴我們它適合課程的哪個環節。'],
    'Offer feedback →': ['提供反馈 →', '提供回饋 →'],
    'Researchers and engineers': ['研究人员和工程师', '研究人員及工程師'],
    'Experts in optical imaging, medical image segmentation or simulation-based education: help us design a fair validation.':
      ['光学成像、医学图像分割或模拟教学领域的专家：协助我们设计公正的验证方案。', '光學成像、醫學圖像分割或模擬教學領域的專家：協助我們設計公正的驗證方案。'],
    'Discuss research →': ['探讨研究 →', '探討研究 →'],
    'Institutions': ['院校与机构', '院校及機構'],
    'Schools and training centres interested in pilots or in being a site for testing.':
      ['有意开展试点或担任测试场地的学校和培训中心。', '有意進行試行或擔任測試場地的學校及培訓中心。'],
    'Explore a pilot →': ['了解试点 →', '了解試行 →'],
    'Contact us': ['联系我们', '聯絡我們'],
    'contact@vascu-tech.com · Hong Kong': ['contact@vascu-tech.com · 香港', 'contact@vascu-tech.com · 香港'],
    'Email us': ['电邮联系我们', '電郵聯絡我們']
  };

  /* ---------- engine ---------- */

  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  function idx(code) { return code === 'zh-Hans' ? 0 : 1; }
  function byCode(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i];
    return LANGS[0];
  }

  function fromTag(tag) {
    tag = String(tag || '').toLowerCase();
    if (/^zh(-|_)?(tw|hk|mo|hant)/.test(tag)) return 'zh-Hant';
    if (tag.indexOf('zh') === 0) return 'zh-Hans';
    if (tag.indexOf('en') === 0) return 'en';
    return null;
  }

  function initialLang() {
    var m = /[?&]lang=([^&#]+)/.exec(location.search);
    if (m) {
      var q = decodeURIComponent(m[1]).toLowerCase();
      var map = { en: 'en', 'zh-hans': 'zh-Hans', 'zh-cn': 'zh-Hans', sc: 'zh-Hans', zh: 'zh-Hans',
                  'zh-hant': 'zh-Hant', 'zh-hk': 'zh-Hant', 'zh-tw': 'zh-Hant', tc: 'zh-Hant' };
      if (map[q]) return map[q];
    }
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && /^(en|zh-Hans|zh-Hant)$/.test(saved)) return saved;
    } catch (e) { /* storage blocked: fall through */ }
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (var i = 0; i < prefs.length; i++) {
      var c = fromTag(prefs[i]);
      if (c) return c;
    }
    return 'en';
  }

  /* collect every translatable string once, remembering the English original */
  var items = [];

  function collect() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('ol, [data-no-i18n]')) return NodeFilter.FILTER_REJECT;   // citations stay English
        var k = norm(n.nodeValue);
        return k && TEXT[k] ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      items.push({ kind: 'text', node: n, orig: n.nodeValue, key: norm(n.nodeValue) });
    }
    Array.prototype.forEach.call(document.querySelectorAll('img[alt]'), function (el) {
      var k = norm(el.getAttribute('alt'));
      if (TEXT[k]) items.push({ kind: 'attr', node: el, attr: 'alt', orig: el.getAttribute('alt'), key: k });
    });
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      var mk = norm(meta.getAttribute('content') || '');
      if (TEXT[mk]) items.push({ kind: 'attr', node: meta, attr: 'content', orig: meta.getAttribute('content'), key: mk });
    }
    var tk = norm(document.title);
    if (TEXT[tk]) items.push({ kind: 'title', orig: document.title, key: tk });
  }

  function apply(code) {
    var lang = byCode(code), i = idx(code), it, v;
    for (var j = 0; j < items.length; j++) {
      it = items[j];
      v = code === 'en' ? it.orig : TEXT[it.key][i];
      if (it.kind === 'text') it.node.nodeValue = v;
      else if (it.kind === 'attr') it.node.setAttribute(it.attr, v);
      else document.title = v;
    }
    document.documentElement.lang = lang.htmlLang;
    Array.prototype.forEach.call(document.querySelectorAll('.lang-switch button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === code ? 'true' : 'false');
    });
    if (code !== 'en') loadCjkFont(code);
  }

  /* Chinese web fonts are fetched only when a Chinese language is chosen */
  var fontLoaded = {};
  function loadCjkFont(code) {
    var fam = code === 'zh-Hans' ? 'Noto+Sans+SC' : 'Noto+Sans+HK';
    if (fontLoaded[fam]) return;
    fontLoaded[fam] = true;
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + fam + ':wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  function setLang(code, persist) {
    apply(code);
    if (persist) { try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ } }
  }

  function buildSwitcher() {
    var nav = document.querySelector('header nav');
    if (!nav) return;
    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'Language / 语言 / 語言');
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = l.short;
      b.title = l.label;
      b.setAttribute('aria-label', l.label);
      b.setAttribute('lang', l.htmlLang);
      b.setAttribute('data-lang', l.code);
      b.addEventListener('click', function () { setLang(l.code, true); });
      wrap.appendChild(b);
    });
    nav.appendChild(wrap);
  }

  function init() {
    buildSwitcher();
    collect();
    setLang(initialLang(), false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

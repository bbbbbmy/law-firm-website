/**
 * 「加入我们」页面的内容契约。
 *
 * DB 优先（CareersContent / CareersCard / CareersJob），这里是唯一的默认值与
 * 归一化来源：公开页、后台编辑页、seed 三处都从这里取，保证三边不会漂移。
 *
 * 段落约定：长文用 \n\n 分段，渲染时拆成 <p>（首行缩进 2em）。
 */

import type { Language } from '@/types'

export interface CareersCardData {
  id: string
  title: string
  content: string
  sortOrder: number
}

export interface CareersJobData {
  id: string
  title: string
  tags: string
  requirements: string
  duties: string
  photoUrl: string | null
  sortOrder: number
}

export interface CareersContentData {
  language: Language
  // Banner
  bannerTitle: string
  bannerSubtitle: string
  bannerQuote: string
  // 开篇引言
  introTitle: string
  introContent: string
  // 板块 1 优渥环境
  environmentTitle: string
  environmentLabel: string
  environmentContent: string
  environmentImageUrl: string | null
  // 板块 2 重磅扶持
  supportTitle: string
  supportLabel: string
  supportLead: string
  // 板块 3 初心如磐
  creationTitle: string
  creationLabel: string
  creationContent: string
  // 板块 4 招募邀约
  invitationTitle: string
  invitationLabel: string
  invitationContent: string
  // 板块 5 热招岗位
  jobsTitle: string
  // 底部联系区
  contactTitle: string
}

export type CareersContentMap = Record<Language, CareersContentData>

/**
 * Banner 兜底图。正式图片走 SiteConfig `hero_bg_careers`，后台可传；
 * 这里只在后台没配时兜底，取不到时页面退化成品牌色渐变块。
 */
export const CAREERS_HERO_FALLBACK =
  'https://images.unsplash.com/photo-1521791055396-9459823f0dde?w=1920'

/** 环境板块配图兜底（未配图时同样退化成渐变块）。 */
export const CAREERS_ENV_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200'

/** 底部联系方式兜底：ContactInfo 表为空时用这份。 */
export const CAREERS_CONTACT_FALLBACK = {
  address: '江苏省新沂市公园南路河畔雅居商业街三楼',
  phone: '0516-81607188 ｜ 18626021515',
}

export const DEFAULT_CARDS: Record<Language, Omit<CareersCardData, 'id'>[]> = {
  zh: [
    {
      title: '低点位分成，收益归己',
      content:
        '青年独立律师自主承接所有案件业务，律所仅收取创收金额 10% 作为公共平台服务费，剩余九成业务收益全部归属承办律师本人，无阶梯扣费、无隐形抽成、无业绩捆绑要求，收益分配透明公开、有据可查。青年律师多劳多得，全部办案劳动所得切实落入自身囊中，无需为收益分配焦虑，专注深耕专业即可。',
      sortOrder: 0,
    },
    {
      title: '全包运营杂费，零成本执业',
      content:
        '除去 10% 案件点位之外，青年律师执业过程中产生的所有运营开支，均由律所统一承担。包含办公工位使用费、打印复印装订费、档案归档保管费、会议室与接待室使用费、财务记账对账服务费、公章管理、文书邮寄、案件立案辅助行政服务等全部费用，青年律师无需额外支出分毫杂费，彻底卸下各类运营开销负担，轻装上阵开启执业之路。',
      sortOrder: 1,
    },
    {
      title: '轻管理模式，自主发展',
      content:
        '律所实行轻管理、重赋能机制，不强制考勤坐班、不干涉青年律师案源拓展方向、不强行分派案源、不限制业务领域。青年律师可自由规划工作节奏、自主对接客户、自主定价服务、打造个人专业标签，律所只做后盾，不做束缚，充分保障独立律师的执业自主权，让每一位青年律师都能按照自身节奏成长发展。',
      sortOrder: 2,
    },
  ],
  en: [
    {
      title: 'Low Share, Earnings Yours',
      content:
        'An independent young lawyer handles all case business on their own. The firm takes only 10% of the revenue as a public platform service fee, and the remaining ninety percent belongs entirely to the lawyer handling the case — no tiered deductions, no hidden commissions, no performance tie-ins. Revenue allocation is transparent, public and fully auditable. The more you work, the more you earn: all of your labour income genuinely stays in your own hands, so you need never worry about how revenue is split and can simply focus on deepening your expertise.',
      sortOrder: 0,
    },
    {
      title: 'All Operating Costs Covered',
      content:
        'Apart from the 10% case share, every operating expense incurred in the course of practice is borne by the firm. This includes desk rental, printing, copying and binding, file archiving and storage, meeting room and reception room use, bookkeeping and reconciliation services, seal management, document mailing, case filing assistance and all other administrative services. Young lawyers incur no additional out-of-pocket costs, are fully relieved of operational overhead, and can start practising light and unencumbered.',
      sortOrder: 1,
    },
    {
      title: 'Light Management, Free Development',
      content:
        'The firm runs on a light-management, empowerment-first model: no mandatory attendance, no interference in how you develop your client base, no forced case allocation, no restriction on practice areas. Young lawyers set their own pace, approach clients on their own terms, price their services themselves, and build a personal professional brand. The firm serves as a backstop, never a restraint, fully safeguarding the autonomy of the independent lawyer so that everyone can grow at their own rhythm.',
      sortOrder: 2,
    },
  ],
}

export const DEFAULT_JOBS: Record<Language, Omit<CareersJobData, 'id'>[]> = {
  zh: [
    {
      title: '执业律师',
      tags: 'A 证｜诉讼 / 非诉讼｜独立办案能力｜提成制｜社会律师',
      requirements:
        '持有有效律师执业证，独立办案能力成熟；具备稳定案源渠道，能够独立对接客户、洽谈案件、全程跟进诉讼 / 非诉讼业务；遵守律所管理制度，无行业处罚、执业违规等不良记录。',
      duties: '',
      photoUrl: null,
      sortOrder: 0,
    },
    {
      title: '授薪律师',
      tags: 'A 证｜诉讼 / 非诉讼｜授薪制｜独立办案能力｜社会律师',
      requirements:
        '持有有效律师执业证书，可独立承担各类民商事、法律顾问等案件；熟练起草起诉状、代理词、合同、法律意见书等各类法律文书；能独立立案、开庭，跟进执行、具备完整办案流程实操经验。',
      duties: '',
      photoUrl: null,
      sortOrder: 1,
    },
    {
      title: '实习律师',
      tags: 'A 证｜实习培养｜诉讼 / 非诉讼',
      requirements:
        '全日制大学本科或以上学历，通过国家统一法律职业资格考试，并取得法律职业资格 A 证；良好的沟通能力和团队合作精神，熟练使用各类办公软件。',
      duties:
        '在指导下参与案件的调查和处理过程；负责日常的法律文件审核与修改；参与律师的日常工作，包括但不限于案件分析、法律意见书撰写；协助组织法律讲座和活动；执行律师安排的其他相关工作。',
      photoUrl: null,
      sortOrder: 2,
    },
    {
      title: '法务专员',
      tags: '法律职业资格｜合同管理｜合规管理｜诉讼仲裁',
      requirements:
        '全日制本科及以上学历，法学专业优先，具备扎实的法律基础知识；非法学专业需熟悉《民法典》《公司法》等常用法律法规，有相关法律工作经历优先。',
      duties:
        '驻点合作顾问单位，负责日常法律事务处理，包括但不限于合同审核、法律咨询解答、法律风险初步排查等工作。协助顾问单位对接外部法律资源，整理并归档相关法律文件，确保业务合规开展。',
      photoUrl: null,
      sortOrder: 3,
    },
  ],
  en: [
    {
      title: 'Practising Lawyer',
      tags: 'Certificate A｜Litigation / Non-litigation｜Independent case handling｜Commission-based｜Social lawyer',
      requirements:
        'Holds a valid lawyer practice certificate with mature independent case-handling ability; has stable sources of cases and can independently liaise with clients, negotiate cases and follow litigation / non-litigation matters end to end; complies with firm policies and has no record of industry penalties or practice violations.',
      duties: '',
      photoUrl: null,
      sortOrder: 0,
    },
    {
      title: 'Salaried Lawyer',
      tags: 'Certificate A｜Litigation / Non-litigation｜Salaried｜Independent case handling｜Social lawyer',
      requirements:
        'Holds a valid lawyer practice certificate and can independently take on civil, commercial and general counsel matters; is proficient in drafting complaints, submissions, contracts, legal opinions and other legal documents; can independently file cases and appear in court, follow up enforcement, and has hands-on experience of the complete case-handling process.',
      duties: '',
      photoUrl: null,
      sortOrder: 1,
    },
    {
      title: 'Trainee Lawyer',
      tags: 'Certificate A｜Trainee programme｜Litigation / Non-litigation',
      requirements:
        'Full-time undergraduate degree or above; has passed the national unified legal professional qualification examination and obtained a Legal Professional Qualification Certificate A; demonstrates good communication and teamwork skills and is proficient with office software.',
      duties:
        'Participates in the investigation and handling of cases under guidance; reviews and revises routine legal documents; assists with lawyers’ day-to-day work including but not limited to case analysis and drafting legal opinions; helps organise legal lectures and events; and carries out other related tasks assigned by lawyers.',
      photoUrl: null,
      sortOrder: 2,
    },
    {
      title: 'Legal Counsel',
      tags: 'Legal professional qualification｜Contract management｜Compliance management｜Litigation & arbitration',
      requirements:
        'Full-time undergraduate degree or above; law background preferred, with solid command of fundamental legal knowledge. Non-law majors should be familiar with commonly applied laws and regulations such as the Civil Code and the Company Law; prior relevant legal work experience is preferred.',
      duties:
        'Based at a partner client organisation, responsible for day-to-day legal affairs including but not limited to contract review, answering legal enquiries and preliminary legal risk assessment. Assists the client organisation in liaising with external legal resources, and organises and archives relevant legal documents to ensure compliant business operations.',
      photoUrl: null,
      sortOrder: 3,
    },
  ],
}

export const DEFAULT_CONTENT: CareersContentMap = {
  zh: {
    language: 'zh',
    bannerTitle: '加入我们',
    bannerSubtitle: '江苏德善（新沂）律师事务所・青年法律人培育计划',
    bannerQuote: '青年兴，则法治事业兴；青年强，则律所未来强。',
    introTitle: '党建引领・筑造纯粹执业温床',
    introContent:
      '作为新沂本土获评党员先锋律师事务所的精品法律服务机构，江苏德善（新沂）律师事务所始终以党建为引领，坚守 “培育青年法律人、深耕本土法治建设” 的初心，跳出传统律所盈利模式桎梏，在新沂律师行业开创全新培育先河。我们不愿赚取青年律师成长阶段的辛苦收益，立志打造一处纯粹温暖、全力赋能的执业温床，以颠覆性扶持政策、高标准办公配套、全维度资源加持，托举每一位怀揣法治理想的青年律师站稳行业赛道、实现事业腾飞。',
    environmentTitle: '优渥环境，筑牢成长根基',
    environmentLabel: 'ENVIRONMENT',
    environmentContent:
      '江苏德善（新沂）律师事务所立足青年律师成长需求，打造全方位、高品质的执业环境，摒弃行业内常见的粗放式运营模式，为青年律师提供专属成长空间。律所配置现代化独立办公工区、多功能案件研讨室、专属接待洽谈区、多媒体普法讲堂、休闲休憩空间，全域精装布局，办公环境整洁雅致、配套一应俱全。\n\n日常案件研讨、新法专题研学、党员资深律师师徒结对常态化开展，所内资深合伙人免费为青年律师复盘庭审思路、拆解办案难点、把控案件风控，从执业操守、庭审技巧、客户维系、合规风控全方位传道授业。在这里青年律师既能独享安静独立的办案空间，亦可随时借力全所资深律师团队的专业力量，在宽松纯粹的环境里沉淀专业能力、树立职业信仰。',
    environmentImageUrl: null,
    supportTitle: '重磅扶持：10% 点位，全包成本',
    supportLabel: 'SUPPORT',
    supportLead:
      '立足青年律师初执业阶段案源不稳、开支繁杂、生存压力大的普遍痛点，德善律所重磅推出全新独立律师合作模式，彻底颠覆本地行业传统扣费规则，在新沂法律服务领域首开让利青年的先河，真正做到律所不赚青年律师一分成长钱。',
    creationTitle: '初心如磐，打造执业温床',
    creationLabel: 'CREATION',
    creationContent:
      '纵观行业现状，不少律所依靠高额点位、多重杂费抽取青年律师收益，将新人视作盈利工具，致使无数青年法律人怀揣理想入行，却迫于生存压力选择转行。身为党员先锋律所，江苏德善（新沂）律师事务所始终秉持法治初心与社会责任，坚持 “成就青年，方能成就律所” 的共生理念。\n\n我们主动舍弃短期盈利空间，以 10% 超低点位 + 全包运营成本的模式反向扶持青年，本质是希望褪去行业功利化底色，搭建一方纯粹的法治沃土。在这里，律所的定位从来不是管理者、盈利方，而是青年律师的同行者、铺路石、避风港。我们期待每一位心怀法治热忱的青年律师，不必为房租杂费发愁、不必为高额抽成焦虑，安心深耕专业、专心打磨办案能力，循序渐进成长为独当一面的优秀法律从业者。\n\n未来，德善律所党支部将持续深化青年培育计划，不断升级扶持政策、扩充赋能资源，吸纳更多有志青年法律人同行，以青年蓬勃力量赋能新沂法治建设，以先锋律所担当守护地方公平正义。',
    invitationTitle: '招募邀约',
    invitationLabel: 'INVITATION',
    invitationContent:
      '以沃土孕育新芽，以匠心成就新锐。江苏德善（新沂）律师事务所青年律师培育计划开放入驻席位，诚邀持有律师执业证、怀揣法治理想的有志法律人加盟。\n\n我们以行业革新模式让利青年，以完备资源赋能成长，愿与所有青年法律人双向奔赴、彼此成就，共同在法治赛道步履不停，守护公平，践行初心。',
    jobsTitle: '热招岗位',
    contactTitle: '联系我们',
  },
  en: {
    language: 'en',
    bannerTitle: 'Join Us',
    bannerSubtitle: 'Jiangsu Deshan (Xinyi) Law Firm · Young Legal Professional Development Programme',
    bannerQuote: 'When the young flourish, the rule of law flourishes; when the young are strong, the future of the firm is strong.',
    introTitle: 'Party Leadership · Building a Pure Bed for Practice',
    introContent:
      'As a boutique legal service provider in Xinyi that has been recognised locally as a pioneering law firm led by Party members, Jiangsu Deshan (Xinyi) Law Firm has always placed Party building first, holding fast to its founding purpose of "nurturing young legal professionals and deepening local rule-of-law development". Breaking free of the constraints of the traditional law-firm profit model, it has opened an entirely new path for talent development in Xinyi’s legal profession. We are unwilling to profit from the hard-earned revenue of young lawyers at the formative stage of their careers. Instead, we aim to build a pure and warm practice environment that empowers in every respect — through breakthrough support policies, high-standard working facilities and comprehensive resources — to help every young lawyer with a legal ideal establish a firm footing in the industry and realise professional growth.',
    environmentTitle: 'A Superior Environment, A Solid Foundation for Growth',
    environmentLabel: 'ENVIRONMENT',
    environmentContent:
      'Jiangsu Deshan (Xinyi) Law Firm is designed around the growth needs of young lawyers, building an all-round, high-quality practice environment and rejecting the extensive operating model common in the industry, so that every young lawyer has a dedicated space in which to grow. The firm provides modern private workstations, multi-purpose case study rooms, a dedicated reception and consultation area, a multimedia public-law lecture hall, and rest areas — a fully fitted-out layout that is tidy, refined and complete in every respect.\n\nCase discussions, dedicated study sessions on new legislation, and mentor pairing between senior Party-member lawyers and young lawyers all run as regular activities. Senior partners review hearing strategy with young lawyers at no cost, break down the hard parts of cases and manage case risk, passing on expertise across professional ethics, hearing technique, client relations and compliance. Here a young lawyer can both enjoy a quiet, independent space for casework and draw at any time on the professional strength of the firm’s senior lawyers — settling technical ability and professional conviction in a relaxed, pure environment.',
    environmentImageUrl: null,
    supportTitle: 'Heavyweight Support: A 10% Share, All Costs Covered',
    supportLabel: 'SUPPORT',
    supportLead:
      'Addressing the common early-career difficulties of unstable case flow, heavy running costs and survival pressure, Deshan Law Firm has introduced an entirely new independent-lawyer collaboration model that overturns the industry’s traditional deduction rules, leading the way in giving back to young lawyers in Xinyi’s legal services market — so that the firm earns not a single yuan of a young lawyer’s growth-stage revenue.',
    creationTitle: 'Steadfast Purpose, A Warm Bed for Practice',
    creationLabel: 'CREATION',
    creationContent:
      'Across the industry today, many firms extract revenue from young lawyers through high percentage shares and multiple sundry fees, treating newcomers as profit tools — forcing countless young legal professionals, who enter the profession with ideals, to abandon it under survival pressure. As a pioneering Party-member law firm, Jiangsu Deshan (Xinyi) Law Firm has always upheld its legal purpose and social responsibility, holding to the shared ideal that "only by achieving the young can the firm achieve itself".\n\nWe give up short-term profit space of our own, and support young lawyers in the opposite direction through an ultra-low 10% share plus fully covered operating costs — in essence to strip away the industry’s utilitarian colouring and build a pure field for the rule of law. Here the firm has never positioned itself as manager or profit-taker, but as a companion, a paving stone and a safe harbour for young lawyers. We hope that every young lawyer with passion for the rule of law need never fret over rent and sundry costs or worry about heavy commission deductions, and can focus on deepening their expertise and honing their case-handling ability, growing steadily into accomplished legal professionals.\n\nIn future, the Party branch of Deshan Law Firm will continue to deepen the young lawyer development programme, further upgrading support policies and expanding empowerment resources, welcoming more ambitious young legal professionals to join us — bringing the vigour of youth to the rule-of-law development of Xinyi and safeguarding local fairness and justice as a pioneering firm.',
    invitationTitle: 'We Invite You',
    invitationLabel: 'INVITATION',
    invitationContent:
      'Fertile soil nurtures new shoots; craftsmanship produces new talent. The Young Lawyer Development Programme of Jiangsu Deshan (Xinyi) Law Firm now has places available, and we sincerely invite dedicated legal professionals who hold a lawyer practice certificate and harbour legal ideals to join us.\n\nWe give back to young lawyers through an industry-leading model and empower growth with complete resources, and we look forward to meeting you halfway, achieving together — moving steadily onward in the rule-of-law arena, safeguarding fairness and practising our original purpose.',
    jobsTitle: 'Open Positions',
    contactTitle: 'Contact Us',
  },
}

/**
 * 把长文按空行拆段。单行内的换行折叠成空格，避免后台手抖多敲的回车
 * 变成一个只有一两个字的段落。返回空数组表示没有正文。
 */
export function splitParagraphs(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\n\s*\n/)
    .map(p => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean)
}

/** 按 sortOrder 升序排；sortOrder 相同时保持稳定（DB 返回顺序）。 */
export function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}
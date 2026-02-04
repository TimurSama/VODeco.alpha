import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { username: 'testuser' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@vodeco.org',
      firstName: 'Test',
      lastName: 'User',
      verified: true,
      wallet: {
        create: {
          balance: "10000",
        },
      },
    },
  });

  // Create projects with full information and metadata
  const projects = [
    {
      name: 'Post-Quantum Blockchain Infrastructure',
      slug: 'post-quantum-blockchain',
      description: 'Разработка пост-квантовой блокчейн-технологии для безопасного управления водными ресурсами в эпоху квантовых вычислений',
      fullDescription: 'Проект направлен на создание пост-квантовой криптографической блокчейн-системы, которая обеспечит безопасность данных о водных ресурсах и транзакций в эпоху квантовых вычислений. Система использует алгоритмы криптографии, устойчивые к атакам квантовых компьютеров, обеспечивая долгосрочную защиту критически важных данных о водных ресурсах. Проект включает разработку смарт-контрактов, интеграцию с IoT-сенсорами и создание децентрализованной сети валидаторов. Технология протестирована на 12 водоподготовительных станциях в Центральной Азии, показав 99.9% целостности данных и прозрачность в реальном времени.',
      type: 'blockchain',
      status: 'active',
      targetAmount: "500000", // $500,000
      currentAmount: "125000", // 25% funded
      irr: "15.5",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'blockchain',
        progress: 25,
        teamSize: 12,
        duration: '18 months',
        technologies: ['Post-Quantum Cryptography', 'Blockchain', 'Smart Contracts'],
        milestones: [
          { name: 'Research Phase', completed: true, date: '2025-01-15' },
          { name: 'Prototype Development', completed: true, date: '2025-06-30' },
          { name: 'Testing on Stations', inProgress: true, date: '2025-12-31' },
          { name: 'Mainnet Launch', planned: true, date: '2026-06-30' },
        ],
        expectedROI: 15.5,
        riskLevel: 'medium',
        stakingOpen: true,
        stakingAPY: 15,
      }),
    },
    {
      name: 'IoT Sensors Network with Blockchain Integration',
      slug: 'iot-sensors',
      description: 'Сеть IoT-сенсоров для анализа воды с прямой интеграцией в блокчейн',
      fullDescription: 'Разработка и развертывание IoT-сенсоров, которые анализируют качество воды и отправляют данные напрямую в блокчейн-сеть, обеспечивая прозрачность и неизменность данных о водных ресурсах. Сенсоры измеряют pH, мутность, растворенный кислород, уровни загрязнителей и другие параметры в реальном времени. Данные автоматически записываются в блокчейн, создавая неизменяемый реестр качества воды. Сеть достигла 1 миллиона активных сенсоров в 150 странах, обнаружив более 500 инцидентов с качеством воды в 2026 году, что позволило быстро реагировать и предотвращать потенциальные кризисы в области здравоохранения.',
      type: 'iot',
      status: 'active',
      targetAmount: "300000", // $300,000
      currentAmount: "75000", // 25% funded
      irr: "18.0",
      location: 'Central Asia',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'iot',
        progress: 25,
        sensorsDeployed: 1000000,
        countriesCovered: 150,
        teamSize: 25,
        duration: '24 months',
        technologies: ['IoT', 'Blockchain', 'MQTT', 'LoRaWAN'],
        milestones: [
          { name: 'Sensor Development', completed: true, date: '2025-03-01' },
          { name: 'Blockchain Integration', completed: true, date: '2025-09-15' },
          { name: 'Global Deployment', inProgress: true, date: '2026-12-31' },
        ],
        expectedROI: 18.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 18,
      }),
    },
    {
      name: 'VOD Check: Portable Water Analysis & Step & Earn',
      slug: 'research-equipment',
      description: 'Портативное устройство для анализа воды с программой вознаграждений',
      fullDescription: 'Карманное устройство для анализа воды, которое подключается через Bluetooth к мобильному приложению. Пользователи могут анализировать качество воды и получать вознаграждения за вклад данных в платформу. Устройство измеряет ключевые параметры качества воды и автоматически синхронизирует данные с блокчейн-сетью VODeco. Программа Step & Earn поощряет гражданское участие, распределив более 50,000 портативных сенсоров среди волонтеров. Пользователи получают токены VOD за каждый анализ и вклад данных, создавая экономический стимул для гражданского мониторинга водных ресурсов.',
      type: 'research',
      status: 'active',
      targetAmount: "200000", // $200,000
      currentAmount: "50000", // 25% funded
      irr: "20.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'research',
        progress: 25,
        devicesDistributed: 50000,
        activeUsers: 35000,
        teamSize: 15,
        duration: '12 months',
        technologies: ['Mobile App', 'Bluetooth', 'Water Sensors', 'Blockchain'],
        milestones: [
          { name: 'Device Prototype', completed: true, date: '2025-02-15' },
          { name: 'App Development', completed: true, date: '2025-08-30' },
          { name: 'Beta Testing', inProgress: true, date: '2025-12-31' },
          { name: 'Global Launch', planned: true, date: '2026-03-31' },
        ],
        expectedROI: 20.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 20,
      }),
    },
    {
      name: 'Educational Programs: Children & Agriculture',
      slug: 'educational-programs',
      description: 'Образовательные программы для детей и обучение сельскохозяйственному орошению',
      fullDescription: 'Комплексные образовательные программы, включающие внеклассные мероприятия для детей и специализированные программы обучения управлению сельскохозяйственным орошением. Программа VODeco Children\'s Water Education достигла 500,000 детей в 45 странах, используя геймификацию, интерактивные мастер-классы и практические эксперименты для обучения детей сохранению воды, мониторингу качества и защите окружающей среды. Программа включает мобильное приложение, где дети могут отслеживать свою деятельность по экономии воды и получать награды. Участники сообщили о 70% увеличении поведения по сохранению воды дома.',
      type: 'education',
      status: 'active',
      targetAmount: "150000", // $150,000
      currentAmount: "37500", // 25% funded
      irr: "12.0",
      location: 'Uzbekistan, Kazakhstan',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'education',
        progress: 25,
        childrenReached: 500000,
        countries: 45,
        teamSize: 30,
        duration: '36 months',
        technologies: ['Gamification', 'Mobile Learning', 'VR/AR'],
        milestones: [
          { name: 'Curriculum Development', completed: true, date: '2025-01-30' },
          { name: 'Pilot Programs', completed: true, date: '2025-09-15' },
          { name: 'Global Expansion', inProgress: true, date: '2026-12-31' },
        ],
        expectedROI: 12.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 12,
      }),
    },
    {
      name: '12 Water Treatment Stations Complex in Uzbekistan',
      slug: 'uzbekistan-stations',
      description: 'Комплекс из 12 насосных и водоочистных станций в Узбекистане',
      fullDescription: 'Модернизация и строительство 12 насосных и водоочистных станций по всему Узбекистану, улучшающая эффективность водоснабжения и цифровую трансформацию в соответствии с ЦУР ООН 6. Проект обеспечивает чистую питьевую воду более чем 2 миллионам человек в ранее недостаточно обслуживаемых регионах. Станции используют передовые технологии фильтрации и полностью интегрированы с системами мониторинга IoT. Качество воды улучшилось на 85% в целевых регионах, и проект создал более 1,200 местных рабочих мест. Проект финансируется через механизмы стейкинга VODeco и демонстрирует модель государственно-частного партнерства для устойчивого развития водной инфраструктуры.',
      type: 'infrastructure',
      status: 'active',
      targetAmount: "7760600", // $7,760,600
      currentAmount: "2328180", // 30% funded
      irr: "17.0",
      location: 'Uzbekistan',
      latitude: 41.3111,
      longitude: 69.2797,
      metadata: JSON.stringify({
        source: 'Uzbekistan',
        category: 'infrastructure',
        progress: 30,
        stationsCompleted: 4,
        stationsTotal: 12,
        peopleServed: 2000000,
        jobsCreated: 1200,
        waterQualityImprovement: 85,
        teamSize: 150,
        duration: '36 months',
        technologies: ['Water Treatment', 'IoT Monitoring', 'Digital Twins'],
        milestones: [
          { name: 'Feasibility Study', completed: true, date: '2024-12-31' },
          { name: 'First 4 Stations', completed: true, date: '2025-09-30' },
          { name: 'Next 4 Stations', inProgress: true, date: '2026-03-31' },
          { name: 'Final 4 Stations', planned: true, date: '2026-12-31' },
        ],
        expectedROI: 17.0,
        riskLevel: 'medium',
        stakingOpen: true,
        stakingAPY: 17,
        governmentSupport: true,
        unSDGAlignment: ['SDG 6', 'SDG 9', 'SDG 11'],
      }),
    },
    {
      name: '7 Specialized Digital Cabinets System',
      slug: 'specialized-cabinets',
      description: 'Система из 7 специализированных цифровых кабинетов для различных участников экосистемы',
      fullDescription: 'Разработка комплексной системы из 7 специализированных цифровых кабинетов: Гражданский, Правительственный, Инфраструктурный, Инвестиционный, Научный, Операторский и Административный. Каждый кабинет предоставляет специализированные инструменты и интерфейсы для различных участников экосистемы VODeco. Система обеспечивает единое рабочее пространство с интеграцией данных, аналитики и управления. Кабинеты включают функционал для мониторинга, управления активами, ESG-метрик, научных исследований, операционного контроля и полной конфигурации платформы.',
      type: 'blockchain',
      status: 'active',
      targetAmount: "200000", // $200,000
      currentAmount: "2000", // 1% funded
      irr: "12.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'platform',
        progress: 1,
        cabinetsTotal: 7,
        teamSize: 20,
        duration: '24 months',
        technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
        milestones: [
          { name: 'Architecture Design', completed: true, date: '2025-01-15' },
          { name: 'Core Development', inProgress: true, date: '2025-12-31' },
          { name: 'Beta Testing', planned: true, date: '2026-06-30' },
          { name: 'Full Launch', planned: true, date: '2026-12-31' },
        ],
        expectedROI: 12.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 12,
      }),
    },
    {
      name: 'AI Analytics Engine for Water Prediction',
      slug: 'ai-analytics-engine',
      description: 'ИИ-движок аналитики для прогнозирования дефицита и загрязнения воды',
      fullDescription: 'Разработка предиктивных моделей машинного обучения для анализа дефицита воды и загрязнения. Система анализирует спутниковые изображения, погодные условия, данные IoT-сенсоров и исторические записи для генерации прогнозов. ИИ-модели могут предсказывать нехватку воды и ухудшение качества с точностью 94% до 6 месяцев вперед. Технология уже предотвратила нехватку воды в 15 регионах, позволив проактивное управление ресурсами. Система интегрируется в платформу VODeco для глобального развертывания.',
      type: 'research',
      status: 'active',
      targetAmount: "180000", // $180,000
      currentAmount: "1800", // 1% funded
      irr: "22.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'ai',
        progress: 1,
        predictionAccuracy: 94,
        regionsProtected: 15,
        teamSize: 18,
        duration: '18 months',
        technologies: ['TensorFlow', 'PyTorch', 'Satellite Imagery', 'ML'],
        milestones: [
          { name: 'Data Collection', completed: true, date: '2025-02-28' },
          { name: 'Model Training', inProgress: true, date: '2025-12-31' },
          { name: 'Integration', planned: true, date: '2026-06-30' },
        ],
        expectedROI: 22.0,
        riskLevel: 'medium',
        stakingOpen: true,
        stakingAPY: 22,
      }),
    },
    {
      name: 'Digital Twins Core Engine',
      slug: 'digital-twins-core',
      description: 'Движок синхронизации данных блокчейна с 3D-моделями объектов',
      fullDescription: 'Разработка ядра системы цифровых двойников, которое синхронизирует данные из блокчейна с 3D-моделями водных объектов в реальном времени. Система создает точные цифровые копии физических объектов (насосные станции, водоочистные сооружения, водозаборы), позволяя визуализировать их состояние, производительность и технические характеристики. Цифровые двойники используются для мониторинга, прогнозирования, оптимизации и управления водной инфраструктурой.',
      type: 'iot',
      status: 'active',
      targetAmount: "85000", // $85,000
      currentAmount: "850", // 1% funded
      irr: "15.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'platform',
        progress: 1,
        teamSize: 12,
        duration: '12 months',
        technologies: ['Three.js', 'WebGL', 'Blockchain', '3D Modeling'],
        milestones: [
          { name: '3D Engine Development', inProgress: true, date: '2025-12-31' },
          { name: 'Blockchain Integration', planned: true, date: '2026-06-30' },
        ],
        expectedROI: 15.0,
        riskLevel: 'medium',
        stakingOpen: true,
        stakingAPY: 15,
      }),
    },
    {
      name: 'DAO Governance Pro System',
      slug: 'dao-governance',
      description: 'Система сложного голосования с делегированием и управлением казной',
      fullDescription: 'Разработка продвинутой системы децентрализованного автономного управления (DAO) для водных ресурсов. Система включает сложные механизмы голосования, делегирование полномочий, управление казначейством и автоматическое выполнение решений через смарт-контракты. Первая в мире DAO для управления водными ресурсами успешно запущена, обработав более 10,000 предложений по управлению в первом квартале. 85% держателей токенов участвуют в управлении.',
      type: 'blockchain',
      status: 'active',
      targetAmount: "60000", // $60,000
      currentAmount: "600", // 1% funded
      irr: "10.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'governance',
        progress: 1,
        proposalsProcessed: 10000,
        participationRate: 85,
        teamSize: 10,
        duration: '12 months',
        technologies: ['Smart Contracts', 'Voting Systems', 'Delegation'],
        milestones: [
          { name: 'Core Development', inProgress: true, date: '2025-12-31' },
          { name: 'Beta Launch', planned: true, date: '2026-06-30' },
        ],
        expectedROI: 10.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 10,
      }),
    },
    {
      name: 'Eco-Gaming Module',
      slug: 'eco-gaming',
      description: 'Игровые механики (квесты, NFT-награды) для вовлечения молодежи',
      fullDescription: 'Разработка игрового модуля с геймификацией для вовлечения всех возрастов в сохранение воды и экологическую активность. Система включает квесты, NFT-награды, лидерборды, достижения и социальные функции. Игровой слой мотивирует пользователей участвовать в мониторинге воды, образовательных программах и экологических инициативах через игровые механики.',
      type: 'education',
      status: 'active',
      targetAmount: "90000", // $90,000
      currentAmount: "900", // 1% funded
      irr: "20.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'gaming',
        progress: 1,
        teamSize: 15,
        duration: '18 months',
        technologies: ['Game Design', 'NFT', 'Blockchain Gaming'],
        milestones: [
          { name: 'Game Design', inProgress: true, date: '2025-12-31' },
          { name: 'Development', planned: true, date: '2026-09-30' },
        ],
        expectedROI: 20.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 20,
      }),
    },
    {
      name: 'VOD Integration SDK',
      slug: 'vod-integration-sdk',
      description: 'Набор инструментов для подключения внешних IoT-систем и гос. реестров',
      fullDescription: 'Разработка комплекта инструментов разработчика (SDK) для интеграции внешних IoT-систем, государственных реестров и сторонних приложений с платформой VODeco. SDK включает API, библиотеки, документацию и инструменты для быстрой интеграции. Позволяет подключать существующие системы мониторинга воды, государственные базы данных и коммерческие решения к блокчейн-сети VODeco.',
      type: 'blockchain',
      status: 'active',
      targetAmount: "150000", // $150,000
      currentAmount: "1500", // 1% funded
      irr: "12.0",
      location: 'Global',
      metadata: JSON.stringify({
        source: 'VOD Team',
        category: 'integration',
        progress: 1,
        teamSize: 12,
        duration: '24 months',
        technologies: ['SDK', 'API', 'REST', 'gRPC'],
        milestones: [
          { name: 'API Design', inProgress: true, date: '2025-12-31' },
          { name: 'SDK Development', planned: true, date: '2026-12-31' },
        ],
        expectedROI: 12.0,
        riskLevel: 'low',
        stakingOpen: true,
        stakingAPY: 12,
      }),
    },
  ];

  for (const projectData of projects) {
    await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: {},
      create: projectData,
    });
  }

  // Create sample water resources
  const waterResources = [
    {
      name: 'Aral Sea',
      type: 'sea',
      category: 'source',
      latitude: 45.0,
      longitude: 60.0,
      country: 'Kazakhstan',
      region: 'Central Asia',
      description: 'The Aral Sea, once one of the largest lakes in the world',
      qualityIndex: 45,
      status: 'critical',
    },
    {
      name: 'Amu Darya River',
      type: 'river',
      category: 'source',
      latitude: 37.5,
      longitude: 66.0,
      country: 'Uzbekistan',
      region: 'Central Asia',
      description: 'Major river in Central Asia',
      qualityIndex: 65,
      status: 'active',
    },
    {
      name: 'Pumping Station No. 2',
      type: 'station',
      category: 'object',
      latitude: 40.1158,
      longitude: 67.8422,
      country: 'Uzbekistan',
      region: 'Jizzakh',
      description: 'Pumping station part of national water resource management system',
      qualityIndex: 72,
      status: 'active',
    },
  ];

  for (const resourceData of waterResources) {
    await prisma.waterResource.create({
      data: resourceData,
    });
  }

  // Create achievements
  const achievements = [
    {
      name: 'First Steps',
      description: 'Complete your first action on the platform',
      category: 'participation',
      points: 10,
    },
    {
      name: 'Water Guardian',
      description: 'Contribute to water quality monitoring',
      category: 'environment',
      points: 50,
    },
    {
      name: 'Staking Master',
      description: 'Stake tokens in 5 different projects',
      category: 'staking',
      points: 100,
    },
  ];

  for (const achievementData of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievementData.name },
      update: {},
      create: achievementData,
    });
  }

  // Create news posts for 2026
  const newsPosts = [
    {
      slug: 'quantum-blockchain-water-2026',
      title: 'Post-Quantum Blockchain Revolutionizes Water Resource Management',
      excerpt: 'New quantum-resistant blockchain technology ensures secure and transparent water resource data management for the next century.',
      content: 'In a groundbreaking development, researchers have successfully implemented post-quantum cryptographic algorithms in blockchain systems specifically designed for water resource management. This technology ensures that water quality data, resource allocations, and environmental monitoring remain secure even as quantum computing becomes mainstream. The system has been tested across 12 water treatment facilities in Central Asia, showing 99.9% data integrity and real-time transparency.',
      source: 'Water Technology Journal',
      sourceUrl: 'https://example.com/quantum-blockchain-water',
      published: true,
      publishedAt: new Date('2026-01-15'),
      views: 1250,
      likes: 89,
    },
    {
      slug: 'iot-sensors-global-deployment-2026',
      title: 'Global IoT Sensor Network Reaches 1 Million Active Sensors',
      excerpt: 'The largest IoT network for water quality monitoring now covers 150 countries with real-time data streaming.',
      content: 'The VODeco IoT sensor network has reached a major milestone with 1 million active sensors deployed worldwide. These sensors monitor water quality, flow rates, and environmental conditions in real-time, transmitting data directly to blockchain networks. The network has detected over 500 water quality incidents in 2026 alone, enabling rapid response and preventing potential health crises. The Step & Earn program has incentivized citizen participation, with over 50,000 portable sensors distributed to volunteers.',
      source: 'Environmental Technology Review',
      sourceUrl: 'https://example.com/iot-sensors-global',
      published: true,
      publishedAt: new Date('2026-02-03'),
      views: 2100,
      likes: 156,
    },
    {
      slug: 'uzbekistan-water-stations-2026',
      title: '12 New Water Treatment Stations Operational in Uzbekistan',
      excerpt: 'Major infrastructure project completes ahead of schedule, providing clean water to 2 million people.',
      content: 'A comprehensive water infrastructure project in Uzbekistan has successfully completed with 12 new water treatment and pumping stations now operational. The project, funded through VODeco staking mechanisms, provides clean drinking water to over 2 million people in previously underserved regions. The stations use advanced filtration technology and are fully integrated with IoT monitoring systems. Water quality has improved by 85% in the target regions, and the project has created over 1,200 local jobs.',
      source: 'Central Asia Infrastructure Report',
      sourceUrl: 'https://example.com/uzbekistan-stations',
      published: true,
      publishedAt: new Date('2026-02-20'),
      views: 3400,
      likes: 234,
    },
    {
      slug: 'ai-water-prediction-2026',
      title: 'AI Predicts Water Scarcity with 94% Accuracy',
      excerpt: 'Machine learning models now forecast water availability and quality issues months in advance.',
      content: 'Researchers have developed advanced AI models that can predict water scarcity and quality degradation with 94% accuracy up to 6 months in advance. The system analyzes satellite imagery, weather patterns, IoT sensor data, and historical records to generate predictions. This technology has already prevented water shortages in 15 regions by enabling proactive resource management. The AI system is now being integrated into the VODeco platform for global deployment.',
      source: 'AI Research Quarterly',
      sourceUrl: 'https://example.com/ai-water-prediction',
      published: true,
      publishedAt: new Date('2026-03-10'),
      views: 1800,
      likes: 142,
    },
    {
      slug: 'children-water-education-2026',
      title: 'Educational Program Reaches 500,000 Children Worldwide',
      excerpt: 'Interactive water conservation education program teaches children about sustainable water management.',
      content: 'The VODeco Children\'s Water Education Program has reached a major milestone, engaging over 500,000 children across 45 countries. The program uses gamification, interactive workshops, and hands-on experiments to teach children about water conservation, quality monitoring, and environmental protection. Participants have reported a 70% increase in water conservation behaviors at home. The program includes a mobile app where children can track their water-saving activities and earn rewards.',
      source: 'Education for Sustainability',
      sourceUrl: 'https://example.com/children-education',
      published: true,
      publishedAt: new Date('2026-03-25'),
      views: 2900,
      likes: 201,
    },
    {
      slug: 'satellite-water-monitoring-2026',
      title: 'New Satellite Constellation Provides Real-Time Global Water Monitoring',
      excerpt: 'Space-based monitoring system offers unprecedented resolution for tracking water resources worldwide.',
      content: 'A new constellation of 24 satellites has been launched specifically for water resource monitoring. The satellites use advanced hyperspectral imaging to detect water quality, identify pollution sources, and monitor changes in water bodies in real-time. The system can detect changes as small as 10 meters and provides data updates every 6 hours. This technology has already identified 200 previously unknown pollution sources and enabled rapid response teams to address environmental threats.',
      source: 'Space Technology Today',
      sourceUrl: 'https://example.com/satellite-monitoring',
      published: true,
      publishedAt: new Date('2026-04-05'),
      views: 4200,
      likes: 312,
    },
    {
      slug: 'blockchain-governance-water-2026',
      title: 'First DAO Governance Model for Water Resources Launched',
      excerpt: 'Decentralized autonomous organization enables community-driven water resource management decisions.',
      content: 'The world\'s first DAO (Decentralized Autonomous Organization) for water resource governance has been successfully launched. Token holders can now vote on water allocation, infrastructure investments, and environmental policies. The system has processed over 10,000 governance proposals in its first quarter, with decisions executed automatically via smart contracts. This model has increased transparency and community engagement, with 85% of eligible token holders participating in governance.',
      source: 'Blockchain Governance Review',
      sourceUrl: 'https://example.com/dao-governance',
      published: true,
      publishedAt: new Date('2026-04-18'),
      views: 5600,
      likes: 445,
    },
    {
      slug: 'agricultural-irrigation-ai-2026',
      title: 'AI-Optimized Irrigation Saves 40% Water in Agriculture',
      excerpt: 'Smart irrigation systems reduce water waste while increasing crop yields by 15%.',
      content: 'Agricultural irrigation systems powered by AI and IoT sensors have demonstrated remarkable results, reducing water usage by 40% while increasing crop yields by 15%. The systems analyze soil moisture, weather forecasts, and crop needs to optimize irrigation schedules. Over 5,000 farms have adopted this technology, saving billions of liters of water annually. The VODeco platform provides farmers with real-time data and recommendations, enabling sustainable agriculture practices.',
      source: 'Agricultural Innovation Journal',
      sourceUrl: 'https://example.com/agricultural-irrigation',
      published: true,
      publishedAt: new Date('2026-05-02'),
      views: 3800,
      likes: 278,
    },
    {
      slug: 'ocean-plastic-removal-2026',
      title: 'Ocean Plastic Removal Technology Processes 1 Million Tons',
      excerpt: 'Innovative water treatment technology removes microplastics and pollutants from ocean water.',
      content: 'A revolutionary ocean cleanup technology has successfully processed 1 million tons of plastic waste from ocean water. The system uses advanced filtration and chemical processes to remove microplastics, oil, and other pollutants. The treated water meets drinking water standards, and the recovered materials are recycled. The technology is being deployed on 50 vessels worldwide, with plans to scale to 200 vessels by 2027. This represents a major breakthrough in ocean conservation efforts.',
      source: 'Marine Conservation Today',
      sourceUrl: 'https://example.com/ocean-plastic',
      published: true,
      publishedAt: new Date('2026-05-15'),
      views: 6700,
      likes: 523,
    },
    {
      slug: 'water-cryptocurrency-adoption-2026',
      title: 'Water-Backed Cryptocurrency Gains Mainstream Adoption',
      excerpt: 'VODeco tokens now accepted by 1,000+ merchants and integrated into major payment systems.',
      content: 'VODeco tokens, backed by real water resource assets and infrastructure, have achieved mainstream adoption with over 1,000 merchants now accepting them as payment. Major payment processors have integrated VODeco tokens, enabling seamless transactions. The token\'s value is tied to the performance of water infrastructure projects, creating a unique investment opportunity. Token holders can stake their tokens in water projects and earn returns based on project success and water quality improvements.',
      source: 'Cryptocurrency Weekly',
      sourceUrl: 'https://example.com/water-crypto',
      published: true,
      publishedAt: new Date('2026-05-28'),
      views: 8900,
      likes: 712,
    },
    {
      slug: 'arctic-glacier-monitoring-2026',
      title: 'Real-Time Glacier Monitoring Prevents Catastrophic Flooding',
      excerpt: 'IoT sensors on glaciers provide early warning system for glacial lake outbursts.',
      content: 'A network of IoT sensors deployed on glaciers in the Arctic and Himalayas has successfully prevented three potential catastrophic flooding events. The sensors monitor glacier movement, temperature, and water accumulation, providing early warnings when glacial lakes are at risk of bursting. The system alerted authorities 48 hours before a potential flood in the Himalayas, enabling evacuation of 10,000 people. This technology is now being expanded to cover all major glacier systems worldwide.',
      source: 'Climate Science Journal',
      sourceUrl: 'https://example.com/glacier-monitoring',
      published: true,
      publishedAt: new Date('2026-06-10'),
      views: 4500,
      likes: 389,
    },
    {
      slug: 'desalination-breakthrough-2026',
      title: 'Solar-Powered Desalination Cuts Costs by 60%',
      excerpt: 'New desalination technology makes fresh water from seawater affordable for developing nations.',
      content: 'A breakthrough in solar-powered desalination technology has reduced the cost of producing fresh water from seawater by 60%. The new system uses advanced membrane technology and concentrated solar power to efficiently remove salt and minerals. A pilot plant in the Middle East is producing 50,000 liters of fresh water daily at a cost of $0.30 per cubic meter. The technology is being deployed in 20 coastal communities, providing clean water to over 500,000 people.',
      source: 'Renewable Energy World',
      sourceUrl: 'https://example.com/desalination',
      published: true,
      publishedAt: new Date('2026-06-22'),
      views: 7200,
      likes: 567,
    },
  ];

  for (const news of newsPosts) {
    await prisma.newsPost.upsert({
      where: { slug: news.slug },
      update: news,
      create: news,
    });
  }

  console.log(`✅ Created ${newsPosts.length} news posts`);

  // Create User Level for test user
  await prisma.userLevel.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      level: 1,
      experience: 0,
      totalRewards: '10000',
      achievements: 0,
    },
  });

  // Create Referral Code for test user
  const referralCode = `TEST${user.id.substring(0, 8).toUpperCase()}`;
  await prisma.referral.upsert({
    where: { code: referralCode },
    update: {},
    create: {
      referrerId: user.id,
      code: referralCode,
      link: `https://vodeco.org/ref/${referralCode}`,
      status: 'active',
    },
  });

  // Create Missions
  const missions = [
    {
      title: 'Frontend Developer (React/Next.js)',
      description: 'We are looking for an experienced Frontend Developer to join our team. You will work on building beautiful, responsive user interfaces for the VODeco platform using React and Next.js.',
      type: 'vacancy',
      category: 'development',
      status: 'active',
      rewardAmount: '2000',
      rewardType: 'fixed',
      requirements: JSON.stringify({
        skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
        experience: '3+ years',
        deliverables: ['Feature development', 'UI/UX implementation', 'Code reviews'],
      }),
      maxParticipants: 1,
      currentParticipants: 0,
      deadline: new Date('2025-12-31'),
      metadata: JSON.stringify({
        location: 'Remote',
        employmentType: 'Full-time',
        salary: 'Competitive',
      }),
    },
    {
      title: 'Backend Developer (Node.js/TypeScript)',
      description: 'Join our backend team to build scalable APIs and services for the VODeco ecosystem. Experience with Prisma, PostgreSQL, and blockchain integration preferred.',
      type: 'vacancy',
      category: 'development',
      status: 'active',
      rewardAmount: '2500',
      rewardType: 'fixed',
      requirements: JSON.stringify({
        skills: ['Node.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'REST APIs'],
        experience: '3+ years',
        deliverables: ['API development', 'Database design', 'System architecture'],
      }),
      maxParticipants: 1,
      currentParticipants: 0,
      deadline: new Date('2025-12-31'),
      metadata: JSON.stringify({
        location: 'Remote',
        employmentType: 'Full-time',
      }),
    },
    {
      title: 'Blockchain Developer (Solidity/Web3)',
      description: 'We need a blockchain developer to work on smart contracts, tokenomics, and Web3 integrations for VODeco. Experience with DeFi protocols and token standards required.',
      type: 'vacancy',
      category: 'development',
      status: 'active',
      rewardAmount: '3000',
      rewardType: 'fixed',
      requirements: JSON.stringify({
        skills: ['Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi'],
        experience: '2+ years',
        deliverables: ['Smart contract development', 'Tokenomics implementation', 'Security audits'],
      }),
      maxParticipants: 1,
      currentParticipants: 0,
      deadline: new Date('2025-12-31'),
    },
    {
      title: 'UI/UX Designer',
      description: 'Create beautiful and intuitive user experiences for VODeco. You will design interfaces for web and mobile applications, focusing on user-centered design principles.',
      type: 'vacancy',
      category: 'design',
      status: 'active',
      rewardAmount: '1800',
      rewardType: 'fixed',
      requirements: JSON.stringify({
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        experience: '2+ years',
        deliverables: ['UI designs', 'UX research', 'Design systems'],
      }),
      maxParticipants: 1,
      currentParticipants: 0,
    },
    {
      title: 'Marketing Specialist',
      description: 'Help us grow the VODeco community and spread awareness about water resource management. Experience with social media, content creation, and community management.',
      type: 'vacancy',
      category: 'marketing',
      status: 'active',
      rewardAmount: '1500',
      rewardType: 'fixed',
      requirements: JSON.stringify({
        skills: ['Social Media', 'Content Creation', 'SEO', 'Analytics'],
        experience: '2+ years',
        deliverables: ['Marketing campaigns', 'Content strategy', 'Community growth'],
      }),
      maxParticipants: 1,
      currentParticipants: 0,
    },
    {
      title: 'Submit Water-Related News',
      description: 'Share relevant news articles about water resources, ecology, and environmental issues. Each approved submission earns VOD tokens.',
      type: 'news_submission',
      category: 'content',
      status: 'active',
      rewardAmount: '50',
      rewardType: 'variable',
      requirements: JSON.stringify({
        criteria: ['Relevant to water resources', 'Recent (within 30 days)', 'Reliable source'],
      }),
      maxParticipants: null,
      currentParticipants: 0,
    },
    {
      name: 'First Referral',
      description: 'Invite your first friend to join VODeco',
      category: 'social',
      points: 50,
    },
    {
      name: 'Social Sharer',
      description: 'Share 10 posts on social media',
      category: 'social',
      points: 100,
    },
    {
      name: 'Mission Master',
      description: 'Complete 5 missions',
      category: 'participation',
      points: 200,
    },
    {
      name: 'Staking Champion',
      description: 'Stake 10,000 VOD tokens',
      category: 'staking',
      points: 150,
    },
  ];

  for (const mission of missions.slice(0, 6)) {
    await prisma.mission.create({
      data: mission as any,
    });
  }

  console.log(`✅ Created ${missions.slice(0, 6).length} missions`);

  // Create Achievements
  for (const achievement of missions.slice(6)) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: {},
      create: {
        name: achievement.name,
        description: achievement.description,
        category: achievement.category,
        points: achievement.points,
      },
    });
  }

  console.log(`✅ Created ${missions.slice(6).length} achievements`);

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

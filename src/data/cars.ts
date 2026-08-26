export interface CarSpec {
  engine: string;
  displacement: string;
  power: string;
  powerNum: number;
  torque: string;
  torqueNum: number;
  acceleration: string;
  accelerationNum: number;
  topSpeed: string;
  topSpeedNum: number;
  transmission: string;
  drivetrain: string;
  weight: string;
  weightNum: number;
  brakes: string;
  suspension: string;
  aero?: string;
}

export interface TransitionFrames {
  folder: string;
  prefix: string;
  extension: string;
  totalFrames: number;
  assembledFrame: number;
  explodedFrame: number;
}

export interface Car {
  id: string;
  name: string;
  model: string;
  year: number;
  category: string;
  accentColor: string;
  accentColorHex: string;
  tagline: string;
  description: string;
  spec: CarSpec;
  heroImage: string;
  galleryImages: string[];
  transitionFrames: TransitionFrames;
  engineSystems: EngineeringSystem[];
  designViews: DesignView[];
}

export interface EngineeringSystem {
  id: string;
  name: string;
  description: string;
  detail: string;
  icon: string;
}

export interface DesignView {
  label: string;
  description: string;
}

export const cars: Car[] = [
  {
    id: 'mustang-dark-horse',
    name: 'MUSTANG',
    model: 'DARK HORSE',
    year: 2024,
    category: 'MUSCLE',
    accentColor: 'accent-blue',
    accentColorHex: '#38BDF8',
    tagline: 'Born from racing. Built for obsession.',
    description: 'The 2024 Ford Mustang Dark Horse is the most track-capable Mustang ever produced. Engineered with a hand-built 5.0-liter V8, Tremec 6-speed transmission, and aerodynamics honed from motorsport. This is precision violence.',
    spec: {
      engine: '5.0L V8 HAND-BUILT',
      displacement: '5.0L',
      power: '500 HP',
      powerNum: 500,
      torque: '418 LB-FT',
      torqueNum: 418,
      acceleration: '3.9 SEC',
      accelerationNum: 3.9,
      topSpeed: '155+ MPH',
      topSpeedNum: 155,
      transmission: 'TREMEC 6-SPEED MT',
      drivetrain: 'RWD',
      weight: '3,874 LBS',
      weightNum: 3874,
      brakes: 'BREMBO 6-PISTON',
      suspension: 'MAGNERIDE ADAPTIVE',
      aero: 'ACTIVE FRONT SPLITTER',
    },
    heroImage: '/cars/mustang-black-frame/mustangblack_000.png',
    galleryImages: [
      '/cars/mustang-black-frame/mustangblack_000.png',
      '/cars/mustang-black-frame/mustangblack_027.png',
      '/cars/mustang-black-frame/mustangblack_050.png',
      '/cars/mustang-black-frame/mustangblack_075.png',
    ],
    transitionFrames: {
      folder: '/cars/mustang-black-frame',
      prefix: 'mustangblack_',
      extension: '.png',
      totalFrames: 102,
      assembledFrame: 0,
      explodedFrame: 50,
    },
    engineSystems: [
      {
        id: 'engine',
        name: 'ENGINE',
        description: 'Hand-Built 5.0L Coyote V8',
        detail: 'Each engine is assembled by a single technician, who signs the engine plate. 500HP naturally aspirated. No turbos. No excuses.',
        icon: 'zap',
      },
      {
        id: 'transmission',
        name: 'TRANSMISSION',
        description: 'Tremec 6-Speed MT82-D4',
        detail: 'Race-derived manual transmission with rev-matching technology. Shorter throws, stronger synchros, track-proven durability.',
        icon: 'settings',
      },
      {
        id: 'chassis',
        name: 'CHASSIS',
        description: 'Unibody High-Strength Steel',
        detail: 'Advanced high-strength steel chassis with aluminum front cradle. Stiffer than any Mustang before, optimized for cornering G-forces.',
        icon: 'grid',
      },
      {
        id: 'suspension',
        name: 'SUSPENSION',
        description: 'MagneRide 4.0 Adaptive',
        detail: 'Magnetorheological fluid adjusts damping thousands of times per second. Track mode: razor sharp. Comfort mode: composed.',
        icon: 'activity',
      },
      {
        id: 'brakes',
        name: 'BRAKES',
        description: 'Brembo 6-Piston Front',
        detail: 'Front: 380mm 6-piston Brembo monoblock. Rear: 355mm 4-piston. Fade-free from 155MPH to zero. Repeatedly.',
        icon: 'disc',
      },
      {
        id: 'aero',
        name: 'AERODYNAMICS',
        description: 'Active Front Splitter System',
        detail: 'Active front splitter adjusts for drag vs. downforce balance. Dark Horse package generates net negative lift at speed.',
        icon: 'wind',
      },
      {
        id: 'electronics',
        name: 'ELECTRONICS',
        description: 'Ford Performance Track Apps',
        detail: 'Launch Control, Line Lock, Track Apps data logger. 0-60, 60-130, 1/4 mile telemetry built-in.',
        icon: 'cpu',
      },
    ],
    designViews: [
      { label: 'FRONT', description: 'Aggressive carbon fiber front splitter with integrated brake cooling ducts' },
      { label: 'SIDE', description: 'Sculpted quarter panels with Dark Horse-exclusive fender vents' },
      { label: 'REAR', description: 'Active rear spoiler with Gurney flap. Sequential LED taillights' },
      { label: 'INTERIOR', description: 'Carbon fiber trim, Recaro sport seats, 13.2" SYNC4 display' },
    ],
  },
  {
    id: 'mustang-yellow',
    name: 'MUSTANG',
    model: 'GT500 HERITAGE',
    year: 2024,
    category: 'MUSCLE',
    accentColor: 'accent-yellow',
    accentColorHex: '#FACC15',
    tagline: 'The serpent returns. Meaner than ever.',
    description: 'Yellow is not a color. It\'s a warning. The Shelby GT500 Heritage Edition carries the legacy of Carroll Shelby\'s original racing beast into the supercar era. Supercharged 5.2L V8. Predatory.',
    spec: {
      engine: '5.2L SUPERCHARGED V8',
      displacement: '5.2L',
      power: '760 HP',
      powerNum: 760,
      torque: '625 LB-FT',
      torqueNum: 625,
      acceleration: '3.3 SEC',
      accelerationNum: 3.3,
      topSpeed: '180+ MPH',
      topSpeedNum: 180,
      transmission: 'TREMEC 7-SPEED DCT',
      drivetrain: 'RWD',
      weight: '4,025 LBS',
      weightNum: 4025,
      brakes: 'BREMBO CARBON CERAMIC',
      suspension: 'MAGNERIDE 4.0 TRACK',
      aero: 'CARBON FIBER AERO PACK',
    },
    heroImage: '/cars/mustang-yellow/Car_dismantling_and_assembly_video_202608261822_000.png',
    galleryImages: [
      '/cars/mustang-yellow/Car_dismantling_and_assembly_video_202608261822_000.png',
      '/cars/mustang-yellow/Car_dismantling_and_assembly_video_202608261822_025.png',
      '/cars/mustang-yellow/Car_dismantling_and_assembly_video_202608261822_050.png',
      '/cars/mustang-yellow/Car_dismantling_and_assembly_video_202608261822_075.png',
    ],
    transitionFrames: {
      folder: '/cars/mustang-yellow',
      prefix: 'Car_dismantling_and_assembly_video_202608261822_',
      extension: '.png',
      totalFrames: 102,
      assembledFrame: 0,
      explodedFrame: 50,
    },
    engineSystems: [
      {
        id: 'engine',
        name: 'ENGINE',
        description: 'Supercharged 5.2L Predator V8',
        detail: '2.65L Roots-type TVS supercharger. 12 PSI boost. 760 horsepower at 7,300 RPM. The most powerful production Mustang ever.',
        icon: 'zap',
      },
      {
        id: 'transmission',
        name: 'TRANSMISSION',
        description: 'Tremec 7-Speed Dual-Clutch',
        detail: 'Motorsport-derived DCT with paddle shifters. Sub-100ms shifts. Launch control optimized for consistent sub-3.5 second 0-60.',
        icon: 'settings',
      },
      {
        id: 'chassis',
        name: 'CHASSIS',
        description: 'Carbon Fiber Reinforced Structure',
        detail: 'Carbon fiber composite hood, front fascia, and rear diffuser. Structural carbon fiber adds rigidity while reducing weight.',
        icon: 'grid',
      },
      {
        id: 'suspension',
        name: 'SUSPENSION',
        description: 'MagneRide 4.0 Track-Tuned',
        detail: 'GT500-specific track calibration. Stiffer spring rates, recalibrated MagneRide mapping for the additional 260HP over base.',
        icon: 'activity',
      },
      {
        id: 'brakes',
        name: 'BRAKES',
        description: 'Brembo Carbon Ceramic Matrix',
        detail: 'Carbon ceramic rotors reduce unsprung weight by 60%. Fade-proof at sustained track temperatures. Never replaced in road use.',
        icon: 'disc',
      },
      {
        id: 'aero',
        name: 'AERODYNAMICS',
        description: 'GT500 Carbon Fiber Aero Pack',
        detail: 'Front chin spoiler, dive planes, rear Gurney flap, and diffuser. 550 lbs of downforce at top speed.',
        icon: 'wind',
      },
      {
        id: 'electronics',
        name: 'ELECTRONICS',
        description: 'Shelby GT500 Performance Suite',
        detail: 'Line Lock, Launch Control, Electronic Line Lock, rev-matching, independent Sport, Track, Drag Strip, and Snow/Wet modes.',
        icon: 'cpu',
      },
    ],
    designViews: [
      { label: 'FRONT', description: 'Wide-open grille with integrated supercharger cooling. Snake badge heritage' },
      { label: 'SIDE', description: 'Iconic Shelby GT500 side stripes. Heritage Edition racing livery' },
      { label: 'REAR', description: 'Dual center-exit exhaust. Carbon fiber rear diffuser. SHELBY badging' },
      { label: 'INTERIOR', description: 'Alcantara GT500 steering wheel, carbon fiber dash, SHELBY embroidered seats' },
    ],
  },
  {
    id: 'supercar',
    name: 'SUPERCAR',
    model: 'APEX EDITION',
    year: 2024,
    category: 'SUPERCAR',
    accentColor: 'accent-red',
    accentColorHex: '#EF4444',
    tagline: 'Pure engineering. Zero compromise.',
    description: 'The Apex Edition represents the pinnacle of automotive engineering distilled into one machine. Every component exists for performance, every line exists for function. This is engineering art.',
    spec: {
      engine: '4.0L TWIN-TURBO V8',
      displacement: '4.0L',
      power: '808 HP',
      powerNum: 808,
      torque: '677 LB-FT',
      torqueNum: 677,
      acceleration: '2.7 SEC',
      accelerationNum: 2.7,
      topSpeed: '205 MPH',
      topSpeedNum: 205,
      transmission: '8-SPEED PDK',
      drivetrain: 'AWD',
      weight: '3,153 LBS',
      weightNum: 3153,
      brakes: 'CARBON CERAMIC 440MM',
      suspension: 'ACTIVE PUSHROD AWD',
      aero: 'ACTIVE PDCC SYSTEM',
    },
    heroImage: '/cars/supercar/supercar_000.png',
    galleryImages: [
      '/cars/supercar/supercar_000.png',
      '/cars/supercar/supercar_020.png',
      '/cars/supercar/supercar_040.png',
      '/cars/supercar/supercar_060.png',
    ],
    transitionFrames: {
      folder: '/cars/supercar',
      prefix: 'supercar_',
      extension: '.png',
      totalFrames: 82,
      assembledFrame: 0,
      explodedFrame: 40,
    },
    engineSystems: [
      {
        id: 'engine',
        name: 'ENGINE',
        description: '4.0L Biturbo Flat-Six',
        detail: 'Twin turbocharged 4.0-liter flat-six. Symmetrical layout lowers center of gravity. 808 HP at 6,750 RPM.',
        icon: 'zap',
      },
      {
        id: 'transmission',
        name: 'TRANSMISSION',
        description: '8-Speed PDK Dual-Clutch',
        detail: 'Porsche Doppelkupplung. 8-speed. Lightning-fast shifts. Clutch pre-engagement during cornering for instant power delivery.',
        icon: 'settings',
      },
      {
        id: 'chassis',
        name: 'CHASSIS',
        description: 'Carbon Fiber Monocoque',
        detail: 'Full carbon fiber monocoque chassis. Weighs 186 lbs. Torsional rigidity exceeds any steel structure at 65,000 Nm/degree.',
        icon: 'grid',
      },
      {
        id: 'suspension',
        name: 'SUSPENSION',
        description: 'Active Pushrod AWD Setup',
        detail: 'Active suspension system with electromagnetic actuators at all four corners. 1,000Hz adjustment frequency.',
        icon: 'activity',
      },
      {
        id: 'brakes',
        name: 'BRAKES',
        description: 'Carbon Ceramic 440mm Front',
        detail: '440mm front / 410mm rear carbon ceramic rotors. 10-piston front calipers. Braking force: 2.5G. Never fade.',
        icon: 'disc',
      },
      {
        id: 'aero',
        name: 'AERODYNAMICS',
        description: 'Active Aerodynamics PDCC',
        detail: 'Active rear wing + front spoiler. Generates 860 lbs of downforce at 155MPH. Drag mode for 205MPH top speed.',
        icon: 'wind',
      },
      {
        id: 'electronics',
        name: 'ELECTRONICS',
        description: 'Integrated Performance Management',
        detail: 'Adaptive cruise, PCCB monitoring, torque vectoring, PSM stability, PTM all-wheel drive management. All interconnected.',
        icon: 'cpu',
      },
    ],
    designViews: [
      { label: 'FRONT', description: 'Active front lip spoiler. Four-point LED daytime running lights' },
      { label: 'SIDE', description: 'Air intakes sculpted for maximum downforce. Flying buttress C-pillar' },
      { label: 'REAR', description: 'Active rear wing. Quad exhausts. Full-width LED light bar' },
      { label: 'INTERIOR', description: 'Full carbon fiber cockpit. Bucket seats. Minimal interface. Maximum driver focus' },
    ],
  },
  {
    id: 'ford-gt',
    name: 'FORD GT',
    model: 'HERITAGE EDITION',
    year: 2024,
    category: 'HYPERCAR',
    accentColor: 'accent-orange',
    accentColorHex: '#F97316',
    tagline: 'Le Mans DNA. Road-going fever dream.',
    description: 'The Ford GT Heritage Edition is the road car that carries Le Mans racing DNA in its carbon fiber bones. Every surface channels air. Every component has a purpose. Born from 24 hours of hell, perfected for every road.',
    spec: {
      engine: '3.5L ECOBOOST V6',
      displacement: '3.5L',
      power: '660 HP',
      powerNum: 660,
      torque: '550 LB-FT',
      torqueNum: 550,
      acceleration: '2.8 SEC',
      accelerationNum: 2.8,
      topSpeed: '216 MPH',
      topSpeedNum: 216,
      transmission: '7-SPEED DCT',
      drivetrain: 'RWD',
      weight: '3,020 LBS',
      weightNum: 3020,
      brakes: 'CARBON CERAMIC BREMBO',
      suspension: 'ACTIVE PUSHROD RACING',
      aero: 'ACTIVE FLYING BUTTRESS',
    },
    heroImage: '/cars/supercar-ford/supercar-ford_000.png',
    galleryImages: [
      '/cars/supercar-ford/supercar-ford_000.png',
      '/cars/supercar-ford/supercar-ford_025.png',
      '/cars/supercar-ford/supercar-ford_050.png',
      '/cars/supercar-ford/supercar-ford_075.png',
    ],
    transitionFrames: {
      folder: '/cars/supercar-ford',
      prefix: 'supercar-ford_',
      extension: '.png',
      totalFrames: 102,
      assembledFrame: 0,
      explodedFrame: 50,
    },
    engineSystems: [
      {
        id: 'engine',
        name: 'ENGINE',
        description: '3.5L EcoBoost Twin-Turbo V6',
        detail: 'Mid-mounted twin-turbocharged V6. 660HP at 6,250 RPM. Derived directly from Ford\'s Le Mans-winning GTE race program.',
        icon: 'zap',
      },
      {
        id: 'transmission',
        name: 'TRANSMISSION',
        description: '7-Speed Getrag DCT',
        detail: 'Racing-derived 7-speed dual-clutch. Paddle shifters. Pre-programmed launch control to 0-60 in 2.8 seconds.',
        icon: 'settings',
      },
      {
        id: 'chassis',
        name: 'CHASSIS',
        description: 'Full Carbon Fiber Monocoque',
        detail: 'Racing-grade carbon fiber monocoque. Weighs 102 lbs complete. Stiffer than any steel structure at 1/3 the weight.',
        icon: 'grid',
      },
      {
        id: 'suspension',
        name: 'SUSPENSION',
        description: 'Active Pushrod Racing Setup',
        detail: 'Inboard-mounted pushrod suspension. Height-adjustable from road to track. Derived directly from GT Le Mans race car.',
        icon: 'activity',
      },
      {
        id: 'brakes',
        name: 'BRAKES',
        description: 'Brembo Carbon Ceramic Racing',
        detail: 'Carbon ceramic brakes from the GT Le Mans race car. Front: 390mm 6-piston. Rear: 380mm 4-piston. Zero fade.',
        icon: 'disc',
      },
      {
        id: 'aero',
        name: 'AERODYNAMICS',
        description: 'Active Flying Buttress System',
        detail: 'Active rear diffuser and retractable rear wing. 800 lbs of downforce at 216MPH. Flying buttress channels air.',
        icon: 'wind',
      },
      {
        id: 'electronics',
        name: 'ELECTRONICS',
        description: 'Track Mode + Road Mode AI',
        detail: 'Automatically adjusts suspension ride height, throttle mapping, traction control, and aero for road vs. track.',
        icon: 'cpu',
      },
    ],
    designViews: [
      { label: 'FRONT', description: 'Le Mans-derived front fascia. Active front splitter with lip spoiler' },
      { label: 'SIDE', description: 'Flying buttress rear haunches channel air to intercoolers. No side mirrors — cameras' },
      { label: 'REAR', description: 'Active rear wing. Center-exit exhaust. Carbon fiber diffuser' },
      { label: 'INTERIOR', description: 'Race-spec carbon fiber tub. No floor mats. No frills. Subzero AC. Alcantara everywhere' },
    ],
  },
];

export const getCar = (id: string): Car | undefined => {
  return cars.find(car => car.id === id);
};

export const getFeaturedCar = (): Car => {
  return cars[0];
};

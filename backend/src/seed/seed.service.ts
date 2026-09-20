import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Listing, ListingStatus } from '../entities/listing.entity';
import { Image, ImageType } from '../entities/image.entity';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedUsers();
    await this.seedComprehensiveInventory();
  }

  private async seedUsers() {
    const adminEmail = 'admin@scuderia.com';
    let admin = await this.userRepository.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      admin = this.userRepository.create({
        name: 'Scuderia Ferrari Admin',
        email: adminEmail,
        phone: '+39 0536 949000',
        passwordHash,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      this.logger.log('Seeded Admin user: admin@scuderia.com');
    } else {
      admin.phone = '+39 0536 949000';
      await this.userRepository.save(admin);
    }

    const sellerEmail = 'seller@maranello.com';
    let seller = await this.userRepository.findOne({ where: { email: sellerEmail } });
    if (!seller) {
      const passwordHash = await bcrypt.hash('seller123', 10);
      seller = this.userRepository.create({
        name: 'Maranello Exclusive Motors',
        email: sellerEmail,
        phone: '+39 0536 949111',
        passwordHash,
        role: UserRole.SELLER,
      });
      await this.userRepository.save(seller);
      this.logger.log('Seeded Seller user: seller@maranello.com');
    } else {
      seller.phone = '+39 0536 949111';
      await this.userRepository.save(seller);
    }

    const buyerEmail = 'buyer@client.com';
    let buyer = await this.userRepository.findOne({ where: { email: buyerEmail } });
    if (!buyer) {
      const passwordHash = await bcrypt.hash('buyer123', 10);
      buyer = this.userRepository.create({
        name: 'Alex Vance',
        email: buyerEmail,
        phone: '+1 (415) 555-0199',
        passwordHash,
        role: UserRole.BUYER,
      });
      await this.userRepository.save(buyer);
      this.logger.log('Seeded Buyer user: buyer@client.com');
    } else {
      buyer.phone = '+1 (415) 555-0199';
      await this.userRepository.save(buyer);
    }
  }

  private async seedComprehensiveInventory() {
    const checkCar = await this.listingRepository.findOne({ where: {} });
    if (checkCar && checkCar.certificateNumber) {
      return;
    }

    // Reseed inventory with complete certified inspection, phone, and mileage fields
    await this.listingRepository.createQueryBuilder().delete().from(Listing).execute();

    const seller = await this.userRepository.findOne({ where: { email: 'seller@maranello.com' } });
    if (!seller) return;

    const fullFleet = [
      {
        title: 'Ferrari SF90 XX Stradale Special Series',
        model: 'SF90 XX Stradale',
        color: 'Rosso Corsa / Carbon Black & Flash Orange',
        year: 2024,
        price: 980000,
        description: 'The first road-legal XX program vehicle since the F50. Unleashes 1,030 CV with twin-profile fixed carbon rear wing generating 530 kg downforce at 250 km/h and patented Extra Boost logic.',
        specs: {
          engine: '4.0L Twin-Turbo 90° V8 + 3 Electric Motors (XX Spec)',
          horsepower: 1030,
          acceleration: '2.3s (0-100 km/h)',
          topSpeed: '320 km/h (Aero Optimized)',
          transmission: '8-Speed F1 Dual-Clutch with XX Shift Logic',
          drivetrain: 'e-4WD (RAC-e Electric Front Axle with Torque Vectoring)',
          mileage: 85,
          vin: 'ZFF90XXST000042',
          hybridSystem: '7.9 kWh Battery + Extra Boost Formula 1 KERS Mode',
          downforce: '530 kg @ 250 km/h',
        },
        images: [
          '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-102-654a668c8eefa.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-103-654a668d31cb4.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-105-654a668cc2591.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-109-654a668fc71a3.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-111-654a6690e059b.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-119-654a6698215b0.jpg',
        ],
      },
      {
        title: 'Ferrari SF90 XX Spider Open-Top Weapon',
        model: 'SF90 XX Spider',
        color: 'Nero Daytona / Flash Orange Endplates',
        year: 2024,
        price: 1050000,
        description: 'The open-top variant of the XX Stradale featuring Retractable Hard Top (RHT) that opens in 14 seconds at up to 45 km/h, combining 1030 CV with visceral open-air acoustics.',
        specs: {
          engine: '4.0L Twin-Turbo V8 + Tri-Motor Hybrid XX Tuned',
          horsepower: 1030,
          acceleration: '2.3s (0-100 km/h)',
          topSpeed: '320 km/h',
          transmission: '8-Speed F1 Dual-Clutch',
          drivetrain: 'e-4WD',
          mileage: 120,
          vin: 'ZFF90XXSP000108',
          hybridSystem: 'High-Performance E-Drive with Extra Boost feature',
          downforce: '530 kg @ 250 km/h',
        },
        images: [
          '/cars/2024-ferrari-sf90xx-134-6552496c82eea.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-120-654a669829bf5.jpg',
        ],
      },
      {
        title: 'Ferrari SF90 Stradale Assetto Fiorano',
        model: 'SF90 Stradale',
        color: 'Rosso Corsa / Carbon Black',
        year: 2024,
        price: 628000,
        description: 'The benchmark series production supercar. 1000 CV plug-in hybrid with Assetto Fiorano lightweight pack, carbon wheels, Multimatic shock absorbers, and titanium exhaust.',
        specs: {
          engine: '4.0L Twin-Turbo 90° V8 + 3 Electric Motors',
          horsepower: 1000,
          acceleration: '2.5s (0-100 km/h)',
          topSpeed: '340 km/h',
          transmission: '8-Speed Dual-Clutch F1',
          drivetrain: 'e-4WD (RAC-e Electronic Front Axle)',
          mileage: 680,
          vin: 'ZFF90SF90R002819',
          hybridSystem: '7.9 kWh Lithium-ion Battery with 25 km all-electric range',
          downforce: '390 kg @ 250 km/h',
        },
        images: [
          '/cars/2024-ferrari-sf90-xx-stradale-114-654a669486a42.jpg',
          '/cars/2024-ferrari-sf90-xx-stradale-110-654a6690401bb.jpg',
        ],
      },
      {
        title: 'Ferrari SF90 Spider Assetto Fiorano',
        model: 'SF90 Spider',
        color: 'Giallo Modena / Nero Roof',
        year: 2024,
        price: 685000,
        description: 'Uncompromising open-air hybrid supercar. 1,000 CV delivered seamlessly to all four wheels with a folding hard top engineered for maximum cabin refinement.',
        specs: {
          engine: '4.0L Twin-Turbo V8 + Tri-Motor PHEV',
          horsepower: 1000,
          acceleration: '2.5s (0-100 km/h)',
          topSpeed: '340 km/h',
          transmission: '8-Speed F1 Dual-Clutch',
          drivetrain: 'e-4WD',
          mileage: 420,
          vin: 'ZFF90SPD009182',
          hybridSystem: 'e-Drive pure EV mode capable of 135 km/h',
          downforce: '390 kg @ 250 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 812 Competizione V12',
        model: '812 Competizione',
        color: 'Giallo Modena / Carbon Blade',
        year: 2023,
        price: 785000,
        description: 'The ultimate evolution of Ferrari’s front-mid mounted naturally aspirated 6.5-liter V12 revving to 9,500 RPM. Features independent four-wheel steering and carbon aero panel.',
        specs: {
          engine: '6.5L Naturally Aspirated 65° V12',
          horsepower: 830,
          acceleration: '2.85s (0-100 km/h)',
          topSpeed: '345 km/h',
          transmission: '7-Speed Dual-Clutch F1',
          drivetrain: 'RWD with Virtual Short Wheelbase 3.0',
          mileage: 1450,
          vin: 'ZFF812CPZ009841',
          hybridSystem: 'Pure Atmospheric V12 Symphony',
          downforce: '300 kg @ 200 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 812 Competizione A (Aperta)',
        model: '812 Competizione A',
        color: 'Rosso Scuderia / Giallo Stripe',
        year: 2023,
        price: 895000,
        description: 'Extremely limited open-top celebration of the iconic 12-cylinder engine. Targa-style carbon fiber roof stows in the rear compartment under a bespoke aerovane bridge.',
        specs: {
          engine: '6.5L Naturally Aspirated V12 (9,500 RPM Redline)',
          horsepower: 830,
          acceleration: '2.85s (0-100 km/h)',
          topSpeed: '345 km/h',
          transmission: '7-Speed F1 DCT',
          drivetrain: 'RWD with 4-Wheel Independent Steering',
          mileage: 620,
          vin: 'ZFF812CA000142',
          hybridSystem: 'Atmospheric V12 Screamer',
          downforce: '310 kg @ 200 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 296 GTB Assetto Fiorano',
        model: '296 GTB',
        color: 'Grigio Silverstone / Racing Livery',
        year: 2024,
        price: 410000,
        description: 'Compact, agile, visceral. The 120° V6 turbo hybrid produces 830 CV with instantaneous throttle response and perfect 50/50 balance.',
        specs: {
          engine: '3.0L 120° Twin-Turbo V6 + MGU-K Motor',
          horsepower: 830,
          acceleration: '2.9s (0-100 km/h)',
          topSpeed: '330 km/h',
          transmission: '8-Speed F1 Dual-Clutch',
          drivetrain: 'RWD with e-Diff',
          mileage: 920,
          vin: 'ZFF296GTB003310',
          hybridSystem: '7.45 kWh battery with 25 km EV range',
          downforce: '360 kg @ 250 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 296 GTS Spider Assetto Fiorano',
        model: '296 GTS',
        color: 'Blu Corsa / Bianco Livery',
        year: 2024,
        price: 445000,
        description: 'The exhilarating berlinetta spider version of the 296 GTB with a lightweight retractable hard top that folds away flush into the engine compartment.',
        specs: {
          engine: '3.0L Twin-Turbo 120° V6 Hybrid',
          horsepower: 830,
          acceleration: '2.9s (0-100 km/h)',
          topSpeed: '330 km/h',
          transmission: '8-Speed F1 Dual-Clutch',
          drivetrain: 'RWD',
          mileage: 380,
          vin: 'ZFF296GTS001928',
          hybridSystem: 'Plug-in Hybrid EV System',
          downforce: '360 kg @ 250 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari Daytona SP3 Icona Series',
        model: 'Daytona SP3',
        color: 'Rosso Magma / Carbon Diffuser',
        year: 2023,
        price: 2650000,
        description: 'Tribute to the legendary 1-2-3 finish at the 1967 24 Hours of Daytona. Mid-rear mounted 840 CV V12 with butterfly doors, horizontal rear blades, and wrap-around windscreen.',
        specs: {
          engine: '6.5L Mid-Rear V12 Tipo F140HC',
          horsepower: 840,
          acceleration: '2.85s (0-100 km/h)',
          topSpeed: '340+ km/h',
          transmission: '7-Speed F1 Dual-Clutch',
          drivetrain: 'RWD with Carbon Monocoque Chassis',
          mileage: 310,
          vin: 'ZFFSP3ICN000599',
          hybridSystem: 'Pure Unassisted V12 Racing Engine',
          downforce: '500 kg @ 200 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari Monza SP1 Single-Seater Barchetta',
        model: 'Monza SP1',
        color: 'Grigio Titanio / Giallo Modena Stripe',
        year: 2021,
        price: 2100000,
        description: 'First member of the Icona series. Revolutionary pure single-seater speedster with patented Virtual Wind Shield and 810 CV atmospheric V12.',
        specs: {
          engine: '6.5L Naturally Aspirated V12',
          horsepower: 810,
          acceleration: '2.9s (0-100 km/h)',
          topSpeed: '300+ km/h',
          transmission: '7-Speed Dual-Clutch',
          drivetrain: 'RWD Single Seat Carbon Monocoque',
          mileage: 490,
          vin: 'ZFFSP1MNZ000019',
          hybridSystem: 'Naturally Aspirated Thoroughbred',
          downforce: 'Barchetta Aerodynamic Profile',
        },
        images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari Monza SP2 Dual-Cockpit Barchetta',
        model: 'Monza SP2',
        color: 'Nero Stellato / Rosso Corsa Interior',
        year: 2021,
        price: 2250000,
        description: 'Two-seater barchetta speedster providing driver and passenger with an unprecedented Formula 1 sensation of speed without windscreen.',
        specs: {
          engine: '6.5L V12 810 CV',
          horsepower: 810,
          acceleration: '2.9s (0-100 km/h)',
          topSpeed: '300+ km/h',
          transmission: '7-Speed F1 DCT',
          drivetrain: 'RWD',
          mileage: 280,
          vin: 'ZFFSP2MNZ000088',
          hybridSystem: 'Naturally Aspirated V12',
          downforce: 'Speedster Aerodynamics',
        },
        images: [
          'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari Purosangue V12 Super SUV',
        model: 'Purosangue',
        color: 'Nero Purosangue / Crema Leather',
        year: 2024,
        price: 430000,
        description: 'Ferrari’s first ever four-door, four-seater. Houses a mid-front 725 CV V12 with revolutionary active suspension system eliminating body roll.',
        specs: {
          engine: '6.5L Naturally Aspirated 65° V12',
          horsepower: 725,
          acceleration: '3.3s (0-100 km/h)',
          topSpeed: '310 km/h',
          transmission: '8-Speed Dual-Clutch Transmission',
          drivetrain: '4RM-S (Four-Wheel Drive & 4WS)',
          mileage: 1100,
          vin: 'ZFFPUR4DR001290',
          hybridSystem: 'Pure Atmospheric V12 Luxury',
          downforce: 'Aero-Bridge Airflow Management',
        },
        images: [
          'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari LaFerrari Aperta Hypercar',
        model: 'LaFerrari Aperta',
        color: 'Rosso Corsa / Carbon Roof',
        year: 2017,
        price: 4950000,
        description: 'Ultra-rare open-top hybrid hypercar. Fuses an 800 CV V12 with a 163 CV F1-derived electric motor for a total output of 963 CV.',
        specs: {
          engine: '6.3L 65° V12 + HY-KERS Electric Motor',
          horsepower: 963,
          acceleration: '2.6s (0-100 km/h)',
          topSpeed: '352 km/h',
          transmission: '7-Speed F1 Dual-Clutch',
          drivetrain: 'RWD with Magnetorheological Damping',
          mileage: 1800,
          vin: 'ZFFLAFAP000049',
          hybridSystem: 'F1-derived HY-KERS continuous boost system',
          downforce: 'Active Front & Rear Aerodynamics',
        },
        images: [
          'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari Enzo Hypercar Classic',
        model: 'Enzo Ferrari',
        color: 'Rosso Corsa / Nero',
        year: 2004,
        price: 3850000,
        description: 'Named directly after Il Commendatore. Carbon-fiber body, F1-style automated paddle-shift gearbox, and carbon-ceramic brake discs. A masterpiece of automotive history.',
        specs: {
          engine: '6.0L Naturally Aspirated Tipo F140B V12',
          horsepower: 660,
          acceleration: '3.14s (0-100 km/h)',
          topSpeed: '350 km/h',
          transmission: '6-Speed F1 Automated Manual',
          drivetrain: 'RWD Carbon-Fiber Tub',
          mileage: 3800,
          vin: 'ZFFENZO00013928',
          hybridSystem: 'Pure F1 V12 Heritage',
          downforce: '775 kg @ 300 km/h',
        },
        images: [
          'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari F50 Formula 1 for the Road',
        model: 'Ferrari F50',
        color: 'Rosso Corsa / Nero Interior',
        year: 1996,
        price: 4200000,
        description: 'Built to celebrate Ferrari’s 50th anniversary. Powered by an engine derived directly from the 1990 Ferrari 641 Formula 1 car, bolted directly to the carbon tub as a stressed member.',
        specs: {
          engine: '4.7L Naturally Aspirated 60-valve V12 (Tipo F130B)',
          horsepower: 520,
          acceleration: '3.7s (0-100 km/h)',
          topSpeed: '325 km/h',
          transmission: '6-Speed Manual with Gated Shifter',
          drivetrain: 'RWD Stressed-Member Monocoque',
          mileage: 4100,
          vin: 'ZFFF500000104192',
          hybridSystem: 'Pure F1 V12 Sound and Soul',
          downforce: 'Fixed Rear Wing',
        },
        images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari F40 Twin-Turbo Legend',
        model: 'Ferrari F40',
        color: 'Rosso Corsa',
        year: 1992,
        price: 2850000,
        description: 'The final car approved personally by Enzo Ferrari. Raw, uncompromising, and stripped of all driving aids. Kevlar and carbon bodywork with twin-turbocharged V8 fury.',
        specs: {
          engine: '2.9L Twin-Turbocharged Tipo F120A V8',
          horsepower: 478,
          acceleration: '3.8s (0-100 km/h)',
          topSpeed: '324 km/h (First production car to break 200 mph)',
          transmission: '5-Speed Gated Manual',
          drivetrain: 'RWD Tubular Steel & Kevlar Chassis',
          mileage: 6200,
          vin: 'ZFFF400000084291',
          hybridSystem: 'Pure Mechanical Turbo Dominance',
          downforce: 'Iconic Integrated High Rear Wing',
        },
        images: [
          'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 488 Pista Piloti Special Edition',
        model: '488 Pista',
        color: 'Rosso Corsa with Italian Tricolore Stripe',
        year: 2020,
        price: 495000,
        description: 'Reserved exclusively for Ferrari client racing drivers. Features the most powerful V8 in Ferrari history at the time with 720 CV and 50% more downforce via S-Duct aero.',
        specs: {
          engine: '3.9L Twin-Turbo 90° V8',
          horsepower: 720,
          acceleration: '2.85s (0-100 km/h)',
          topSpeed: '340 km/h',
          transmission: '7-Speed Dual-Clutch F1',
          drivetrain: 'RWD with Side Slip Control 6.0',
          mileage: 1850,
          vin: 'ZFF488PST001842',
          hybridSystem: 'International Engine of the Year Winner',
          downforce: 'Front S-Duct Aero',
        },
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
        ],
      },
      {
        title: 'Ferrari 458 Speciale Atmospheric Finale',
        model: '458 Speciale',
        color: 'Rosso Corsa / NART Racing Stripe',
        year: 2015,
        price: 460000,
        description: 'The definitive swansong of naturally aspirated Ferrari V8s. Revs to 9,000 RPM producing 135 CV per liter, equipped with mobile aerodynamic flaps.',
        specs: {
          engine: '4.5L Naturally Aspirated 90° V8',
          horsepower: 605,
          acceleration: '3.0s (0-100 km/h)',
          topSpeed: '325 km/h',
          transmission: '7-Speed F1 Dual-Clutch',
          drivetrain: 'RWD with Side Slip Control',
          mileage: 4800,
          vin: 'ZFF458SPC002819',
          hybridSystem: 'Highest Output NA V8 Production Car',
          downforce: 'Active Flaps Front and Rear',
        },
        images: [
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
        ],
      },
    ];

    let carIdx = 0;
    for (const car of fullFleet) {
      carIdx++;
      const certId = car.year < 2010
        ? `FER-CLASSICHE-${car.year}-${String(carIdx).padStart(3, '0')}`
        : `FER-APP-2024-${String(carIdx).padStart(3, '0')}`;

      const listing = this.listingRepository.create({
        sellerId: seller.id,
        title: car.title,
        model: car.model,
        color: car.color,
        year: car.year,
        price: car.price,
        description: car.description,
        mileage: car.specs.mileage || 150,
        vin: car.specs.vin || `ZFF${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        sellerPhone: '+39 0536 949111',
        certificateNumber: certId,
        isCertified: true,
        certificationType:
          car.year < 2010
            ? 'Ferrari Classiche Certificate of Authenticity'
            : 'Ferrari Approved 101-Point Technical Inspection',
        inspectionDate: '2024-08-18',
        inspectorNotes:
          '101-Point comprehensive Maranello mechanical & cosmetic inspection passed. Certified clean history, zero structural damage, verified original paint depth and matching numbers.',
        location: car.year < 2000 ? 'Maranello Classiche Atelier, Italy' : 'Scuderia Maranello Motors, Italy',
        warranty:
          car.year >= 2021
            ? 'Ferrari Power15 Warranty Included (Valid to 2029)'
            : 'Ferrari Classiche Heritage Certification & Archival Registry',
        specs: car.specs,
        status: ListingStatus.PUBLISHED,
      });

      const saved = await this.listingRepository.save(listing);

      for (const imgUrl of car.images) {
        await this.imageRepository.save(
          this.imageRepository.create({
            listingId: saved.id,
            url: imgUrl,
            type: ImageType.PHOTO,
          }),
        );
      }

      await this.auditLogRepository.save(
        this.auditLogRepository.create({
          userId: seller.id,
          action: 'SEED_FLEET_LISTING',
          entity: 'listing',
          entityId: saved.id,
          details: { title: saved.title, price: saved.price, model: saved.model },
        }),
      );
    }

    this.logger.log(`Seeded ${fullFleet.length} elite Ferrari supercar models into MySQL`);
  }
}

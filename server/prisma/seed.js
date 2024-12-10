const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    try {
        const hashedPassword = await bcrypt.hash('admin', 10);
        console.log('creating user...');
        await prisma.user.createMany({
            data: [
                { firstName: 'Admin', lastName: "Access", email: 'admin@example.com', password: hashedPassword, role: 'ADMIN' },
                { firstName: 'User', lastName: 'Access', email: 'test@example.com', password: hashedPassword, role: 'USER' },
            ],
        });

        console.log('Seeding investors...');
        const investors = [
            { name: 'John Doe', company: 'TechCorp', timezone: 'GMT' },
            { name: 'Jane Smith', company: 'InnovateNow', timezone: 'IST' },
            { name: 'Bob Johnson', company: 'DataDriven', timezone: 'PST' },
            { name: 'Alice Brown', company: 'FinTech Ltd', timezone: 'Central European Time' },
            { name: 'Charlie Green', company: 'HealthTech', timezone: 'SGT' },
            { name: 'Diana White', company: 'EduTech', timezone: 'EST' },
            { name: 'Edward Black', company: 'GreenEnergy', timezone: 'GMT' },
            { name: 'Fiona Grey', company: 'CyberSec', timezone: 'IST' },
            { name: 'George Blue', company: 'AutoTech', timezone: 'PST' },
            { name: 'Helen Purple', company: 'AeroSpace', timezone: 'Central European Time' },
            { name: 'Ian Yellow', company: 'BioTech', timezone: 'SGT' },
            { name: 'Julia Orange', company: 'AgriTech', timezone: 'EST' },
            { name: 'Kevin Red', company: 'Robotics Inc', timezone: 'GMT' },
            { name: 'Laura Pink', company: 'NanoTech', timezone: 'IST' },
            { name: 'Mike Turquoise', company: 'AI Labs', timezone: 'PST' },
            { name: 'Nora Violet', company: 'SolarTech', timezone: 'Central European Time' },
            { name: 'Oliver Indigo', company: 'VR Innovations', timezone: 'SGT' },
            { name: 'Paula Teal', company: 'CryptoCo', timezone: 'EST' },
            { name: 'Quincy Amber', company: 'SmartGrid', timezone: 'GMT' },
            { name: 'Rachel Gold', company: 'Quantum Computing', timezone: 'IST' },
        ];

        for (const investor of investors) {
            await prisma.investor.create({
                data: investor,
            });
        }
        console.log('Investors seeded successfully!');
        console.log('Seeding portfolio companies...');

        // Array of portfolio companies to seed
        const portfolioCompanies = [
            { name: 'Sam Wise', company: 'StartUp1', timezone: 'IST' },
            { name: 'Tina Fey', company: 'InnovateStart', timezone: 'IST' },
            { name: 'Uma Thurman', company: 'TechBridge', timezone: 'IST' },
            { name: 'Vera Wang', company: 'HealthBridge', timezone: 'IST' },
            { name: 'Will Smith', company: 'EduStart', timezone: 'IST' },
            { name: 'Xander Harris', company: 'GreenStart', timezone: 'IST' },
            { name: 'Yara Shahidi', company: 'CyberStart', timezone: 'IST' },
            { name: 'Zoe Saldana', company: 'AutoBridge', timezone: 'IST' },
            { name: 'Aaron Paul', company: 'BioBridge', timezone: 'IST' },
            { name: 'Bella Thorne', company: 'AgriStart', timezone: 'IST' },
        ];

        // Use Prisma to insert all portfolio companies
        for (const company of portfolioCompanies) {
            await prisma.portfolioCompany.create({
                data: company,
            });
        }

        console.log('Portfolio companies seeded successfully!');

        console.log('Seeding selections...');

        // Fetch all investors and portfolio companies
        const _investors = await prisma.investor.findMany();
        const _portfolioCompanies = await prisma.portfolioCompany.findMany();

        if (!_investors.length || !_portfolioCompanies.length) {
            console.log('No investors or portfolio companies found to create selections.');
            return;
        }

        // Generate random pairs
        const _selections = [];
        for (let i = 0; i < 30; i++) {
            const randomInvestor = _investors[Math.floor(Math.random() * investors.length)];
            const randomPortfolio = _portfolioCompanies[Math.floor(Math.random() * portfolioCompanies.length)];

            // Avoid duplicate pairs (optional)
            const isDuplicate = _selections.some(
                (sel) => sel.investorId === randomInvestor.id && sel.portfolioId === randomPortfolio.id
            );

            if (!isDuplicate) {
                _selections.push({
                    investorId: randomInvestor.id,
                    portfolioId: randomPortfolio.id,
                });
            }
        }

        // Insert selections into the database
        for (const selection of _selections) {
            await prisma.selection.create({
                data: selection,
            });
        }

        console.log('Selections seeded successfully!');

        console.log('Seeding meetings...');

        // Fetch the first 10 selections
        const selections = await prisma.selection.findMany({
            take: 10, // Limit to 10 entries
        });

        if (!selections.length) {
            console.log('No selections found to create meetings.');
            return;
        }

        const meetings = selections.map((selection) => {
            const isEven = selection.id % 3 === 0; // Determine start and end times based on selectionId
            const startTime = isEven ? '09:00:00' : '14:00:00';
            const endTime = isEven ? '10:00:00' : '15:00:00';

            // Construct the meeting object
            return {
                selectionId: selection.id,
                date: new Date('2025-02-01'),
                startTime: new Date(`2025-02-01T${startTime}`), // Combine date and time
                endTime: new Date(`2025-02-01T${endTime}`),
                duration:60
            };
        });

        // Insert meetings into the database
        for (const meeting of meetings) {
            await prisma.meeting.create({
                data: meeting,
            });
        }

        console.log('Meetings seeded successfully!');
        console.log('availabilitySlots seeded ...');

        const availabilitySlots = [
            // GMT Timezone Data
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '18:00:00', endTime: '19:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '19:00:00', endTime: '20:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '20:00:00', endTime: '21:00:00' },
            { timezone: 'GMT', date: new Date('2025-02-01'), startTime: '21:00:00', endTime: '22:00:00' },

            // IST Timezone Data
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '08:00:00', endTime: '09:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '09:00:00', endTime: '10:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '10:00:00', endTime: '11:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '11:00:00', endTime: '12:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '12:00:00', endTime: '13:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '14:00:00', endTime: '15:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '18:00:00', endTime: '19:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '19:00:00', endTime: '20:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '20:00:00', endTime: '21:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '21:00:00', endTime: '22:00:00' },
            { timezone: 'IST', date: new Date('2025-02-01'), startTime: '22:00:00', endTime: '23:00:00' },

            // PST Timezone Data
            { timezone: 'PST', date: new Date('2025-02-01'), startTime: '21:00:00', endTime: '22:00:00' },
            { timezone: 'PST', date: new Date('2025-02-01'), startTime: '22:00:00', endTime: '23:00:00' },

            // Central European Time
            { timezone: 'Central European Time', date: new Date('2025-02-01'), startTime: '14:00:00', endTime: '15:00:00' },
            { timezone: 'Central European Time', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'Central European Time', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'Central European Time', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },
            { timezone: 'Central European Time', date: new Date('2025-02-01'), startTime: '18:00:00', endTime: '19:00:00' },

            // SGT Timezone Data
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '09:00:00', endTime: '10:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '10:00:00', endTime: '11:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '11:00:00', endTime: '12:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '12:00:00', endTime: '13:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '14:00:00', endTime: '15:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '18:00:00', endTime: '19:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '19:00:00', endTime: '20:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '20:00:00', endTime: '21:00:00' },
            { timezone: 'SGT', date: new Date('2025-02-01'), startTime: '21:00:00', endTime: '22:00:00' },

            // Japan Standard Time
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '08:00:00', endTime: '09:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '09:00:00', endTime: '10:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '10:00:00', endTime: '11:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '11:00:00', endTime: '12:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '12:00:00', endTime: '13:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '14:00:00', endTime: '15:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'Japan Standard Time', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },

            // GST Timezone Data
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '11:00:00', endTime: '12:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '12:00:00', endTime: '13:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '14:00:00', endTime: '15:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '15:00:00', endTime: '16:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '16:00:00', endTime: '17:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '17:00:00', endTime: '18:00:00' },
            { timezone: 'GST', date: new Date('2025-02-01'), startTime: '18:00:00', endTime: '19:00:00' },
        ];
        function formatTime(time) {
            return new Date(`1970-01-01T${time}.000Z`); // Use any arbitrary date
        }
        for (const schedule of availabilitySlots) {

            const startDateTime = formatTime(schedule.startTime);
            const endDateTime = formatTime(schedule.endTime);

            await prisma.availabilitySlot.create({
                data: { ...schedule, startTime: startDateTime, endTime: endDateTime },
            });
        }
        console.log('AvailabilitySlots seeded successfully!');
    }
    catch (error) {
        console.error('Error seeding investors:', error);
        throw new Error(error)
    } finally {
        await prisma.$disconnect();
    }
}
main().then(res => console.log("seeding done...")).catch(err => console.error("seeding failed..."))
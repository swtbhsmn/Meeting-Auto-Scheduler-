const { PrismaClient } = require("@prisma/client");
const moment = require('moment-timezone');
const prisma = new PrismaClient();

module.exports = {
  query: {
    getAvailability: async () => {
      try {
        // Fetch all availability slots from the AvailabilitySlot table
        const availabilitySlots = await prisma.availabilitySlot.findMany({
          include: {
            investor: {
              select: {
                name: true,
                company: true,
              }
            },
            portfolio: {
              select: {
                name: true,
                company: true,
              }
            }
          }
        });

        return availabilitySlots;
      } catch (error) {
        console.error("Error fetching availability slots:", error);
        return new Error("Failed to fetch availability slots");
      }
    },
    // Fetch all scheduled meetings
    getMeetingSchedule: async (_, __) => {
      const meetings = await prisma.meeting.findMany({
        include: { selection: { include: { investor: true, portfolio: true } } },
      });
      return meetings;
    }
  },

  getMeetingSchedule: async (_, __) => {
    const meetings = await prisma.meeting.findMany({
      include: { selection: { include: { investor: true, portfolio: true } } },
    });
    return meetings;
  },
  mutation: {
    autoScheduleMeetings: async (_, __) => {
      // Fetch all selections with investor and portfolio availability
      const selections = await prisma.selection.findMany({
        include: {
          investor: { include: { availability: true } },
          portfolio: { include: { availability: true } },
        },
      });

      const meetings = [];
      const IST = 'Asia/Kolkata';

      for (const selection of selections) {
        const { investor, portfolio } = selection;

        // Convert investor's availability slots to IST
        const investorSlots = investor.availability.map((slot) => ({
          ...slot,
          startTimeIST: moment.tz(slot.startTime, slot.timezone).tz(IST),
          endTimeIST: moment.tz(slot.endTime, slot.timezone).tz(IST),
        }));

        // Convert portfolio's availability slots to IST
        const portfolioSlots = portfolio.availability.map((slot) => ({
          ...slot,
          startTimeIST: moment.tz(slot.startTime, slot.timezone).tz(IST),
          endTimeIST: moment.tz(slot.endTime, slot.timezone).tz(IST),
        }));

        // Match availability and schedule meetings
        for (const invSlot of investorSlots) {
          for (const pfSlot of portfolioSlots) {
            if (
              invSlot.date === pfSlot.date && 
              invSlot.endTimeIST.isAfter(pfSlot.startTimeIST) && 
              pfSlot.endTimeIST.isAfter(invSlot.startTimeIST)
            ) {
              // Find the overlapping time
              const startTime = moment.max(invSlot.startTimeIST, pfSlot.startTimeIST);
              const endTime = moment.min(invSlot.endTimeIST, pfSlot.endTimeIST);

              // Ensure no overlapping meetings for the same selection pair
              const overlap = meetings.some(
                (meeting) =>
                  meeting.selectionId === selection.id &&
                  moment(meeting.startTime).tz(IST).isBefore(endTime) &&
                  moment(meeting.endTime).tz(IST).isAfter(startTime)
              );

              // If no overlap, schedule the meeting
              if (!overlap) {
                const duration = endTime.diff(startTime, 'minutes'); 
                const newMeeting = await prisma.meeting.create({
                  data: {
                    selectionId: selection.id,
                    date: invSlot.date,
                    startTime: startTime.toISOString(),
                    endTime: endTime.toISOString(),
                    duration,
                  },
                });

                meetings.push(newMeeting);
              }
            }
          }
        }
      }
      return meetings;
    }
  }
}


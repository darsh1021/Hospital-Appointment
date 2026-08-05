import { prisma } from "../config/db.js";
import { AppointmentStatus } from "../../generated/prisma/client.js";

/**
 * Calculates the estimated wait time (in minutes) for a new token booking.
 * Formula: (active tokens ahead) * 15 minutes.
 */
export const calculateEstimatedWaitTime = async (
    doctorId: string,
    appointmentDate: string | Date
): Promise<number> => {
    const date =
        typeof appointmentDate === "string"
            ? new Date(appointmentDate)
            : appointmentDate;

    const countAhead = await prisma.appointment.count({
        where: {
            doctorId,
            appointmentDate: date,
            status: { in: [AppointmentStatus.scheduled, AppointmentStatus.waiting] },
        },
    });

    return countAhead * 15;
};

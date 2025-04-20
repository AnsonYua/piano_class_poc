/**
 * Utility class for handling API URLs and endpoints
 */
export class TimeSlots {
    public static getTimeSlots(inputTime: string): string {
    const timeSlots = [
        "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
        "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
        "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
        "21:00", "21:30", "22:00"
        ];
        let timeSlotIndex = 0;
        for (let i = 0; i < timeSlots.length; i++) {
            if (timeSlots[i] === inputTime) {
            timeSlotIndex = i;
            break;
            }
        }
        timeSlotIndex = timeSlotIndex + 1;
      return `section${timeSlotIndex}`;
    }

    public static slotToTime(slot: string): string {
        const timeSlots = [
            "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
            "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
            "21:00", "21:30", "22:00"
        ];
        const index = parseInt(slot.replace("section", ""), 10) - 1;
        return timeSlots[index];
    }

    public static slotToDisplay(slot: string): string {
        const timeSlots = [
            "09:30", "10:00", "10:30", "11:00", "11:30",
            "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
            "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
            "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
            "21:00", "21:30", "22:00"
        ];
        const timeSlotsDisplay = [
            "09:30am", "10:00am", "10:30am", "11:00am", "11:30am",
            "12:00pm", "12:30pm", "01:00pm", "01:30pm", "02:00pm", "02:30pm",
            "03:00pm", "03:30pm", "04:00pm", "04:30pm", "05:00pm", "05:30pm",
            "06:00pm", "06:30pm", "07:00pm", "07:30pm", "08:00pm", "08:30pm",
            "09:00pm", "09:30pm", "10:00pm"
        ];
        for(let i=0;i<timeSlots.length;i++){
            if(timeSlots[i] === slot){
                return timeSlotsDisplay[i];
            }
        }
        return timeSlotsDisplay[0];
    }

} 
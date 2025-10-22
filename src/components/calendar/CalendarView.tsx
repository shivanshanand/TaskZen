import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; 

export default function CalendarView({ selectedDate, onSelect }) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      modifiersClassNames={{
        today: "bg-blue-100",
        selected: "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
      }}
    />
  );
}

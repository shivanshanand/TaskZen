import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type CalendarViewProps = {
  selectedDate: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  modifiers?: Record<string, Date[]>;
  modifiersClassNames?: Record<string, string>;
};

export default function CalendarView({
  selectedDate,
  onSelect,
  modifiers,
  modifiersClassNames,
}: CalendarViewProps) {
  return (
    <DayPicker
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
    />
  );
}

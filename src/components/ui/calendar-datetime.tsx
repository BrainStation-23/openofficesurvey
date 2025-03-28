
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarDateTimeProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function CalendarDateTime({
  value,
  onChange,
}: CalendarDateTimeProps) {
  const [time, setTime] = React.useState(
    value ? format(value, "HH:mm") : "00:00"
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (!date || !onChange) return;

    const [hours, minutes] = time.split(":").map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    onChange(date);
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);

    if (value && onChange) {
      const newDate = new Date(value);
      const [hours, minutes] = newTime.split(":").map(Number);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      onChange(newDate);
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            defaultMonth={value}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <TimePicker
        value={time}
        onChange={handleTimeChange}
        className="w-full"
      />
    </div>
  );
}

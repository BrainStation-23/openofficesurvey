import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayPickerSingleProps, DayPickerRangeProps, DayPickerMultipleProps } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { YearsGrid } from "./calendar/years-grid";
import { MonthsGrid } from "./calendar/months-grid";
import { CalendarHeader } from "./calendar/calendar-header";

type CalendarProps = {
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
} & (
  | ({ mode: 'single' } & Omit<DayPickerSingleProps, 'mode'>)
  | ({ mode: 'range' } & Omit<DayPickerRangeProps, 'mode'>)
  | ({ mode: 'multiple' } & Omit<DayPickerMultipleProps, 'mode'>)
);

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = "single",
  ...props
}: CalendarProps) {
  const [viewMode, setViewMode] = React.useState<"days" | "months" | "years">("days");
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = React.useState(new Date().getMonth());

  const handleYearClick = (year: number) => {
    if (selected instanceof Date) {
      const newDate = new Date(selected);
      newDate.setFullYear(year);
      onSelect?.(newDate);
    }
    setCurrentYear(year);
    setViewMode("months");
  };

  const handleMonthClick = (monthIndex: number) => {
    if (selected instanceof Date) {
      const newDate = new Date(selected);
      newDate.setMonth(monthIndex);
      onSelect?.(newDate);
    }
    setCurrentMonth(monthIndex);
    setViewMode("days");
  };

  const handleHeaderClick = () => {
    setViewMode(viewMode === "days" ? "months" : "years");
  };

  const handleTodayClick = () => {
    const today = new Date();
    if (mode === 'single' && 'onSelect' in props) {
      props.onSelect?.(today);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (viewMode === "years") {
    return (
      <YearsGrid
        currentYear={currentYear}
        selected={'selected' in props && props.selected instanceof Date ? props.selected : undefined}
        onYearSelect={handleYearClick}
        onDecadeChange={(increment) => setCurrentYear(currentYear + increment)}
      />
    );
  }

  if (viewMode === "months") {
    return (
      <MonthsGrid
        selected={'selected' in props && props.selected instanceof Date ? props.selected : undefined}
        currentYear={currentYear}
        onMonthSelect={handleMonthClick}
        onYearViewToggle={() => setViewMode("years")}
      />
    );
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={new Date(currentYear, currentMonth)}
      mode={mode}
      {...props}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center items-center pt-1 relative",
        caption_label: "text-sm font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-7 w-7 bg-transparent p-0 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" onClick={handlePrevMonth} />,
        IconRight: () => <ChevronRight className="h-4 w-4" onClick={handleNextMonth} />,
        Caption: ({ displayMonth }) => (
          <CalendarHeader
            displayMonth={displayMonth}
            currentYear={currentYear}
            onHeaderClick={handleHeaderClick}
          />
        ),
      }}
      footer={
        <div className="mt-3 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleTodayClick}
          >
            Today
          </Button>
        </div>
      }
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };

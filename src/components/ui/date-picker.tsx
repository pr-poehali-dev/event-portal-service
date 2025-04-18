import * as React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  mode?: "single" | "range" | "multiple";
  selected?: Date | Date[] | undefined;
  onSelect?: (date: Date | undefined) => void;
  locale?: Locale;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function DatePicker({ 
  date, 
  setDate, 
  mode = "single", 
  selected,
  onSelect,
  locale = ru,
  disabled = false,
  className,
  placeholder = "Выберите дату"
}: DatePickerProps) {
  const handleSelect = React.useCallback((selectedDate: Date | undefined) => {
    if (onSelect) {
      onSelect(selectedDate);
    } else {
      setDate(selectedDate);
    }
  }, [onSelect, setDate]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected instanceof Date ? (
            format(selected, "PPP", { locale })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode={mode}
          selected={selected}
          onSelect={handleSelect}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}

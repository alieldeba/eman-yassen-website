import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import dayjs from "dayjs";
import { arEG } from "date-fns/locale";

function DatePicker({ date, setDate, placeholder }) {
  const [selectedDate, setSelectedDate] = React.useState();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? (
            dayjs(date).format("dddd D MMMM YYYY")
          ) : (
            <span>{placeholder ?? "تحديد التاريخ"}</span>
          )}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          showOutsideDays={false}
          locale={arEG}
          mode="single"
          selected={selectedDate}
          onSelect={(value) => {
            setSelectedDate(value);
            setDate(dayjs(value).format("YYYY-MM-DD"));
          }}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default React.memo(DatePicker);

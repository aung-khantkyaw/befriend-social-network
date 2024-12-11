"use client";

import * as React from "react";
import PropTypes from "prop-types";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button"; // Adjust the import path as necessary
import { Calendar } from "@/components/ui/calendar"; // Adjust the import path as necessary
import { CalendarIcon } from "lucide-react";
import {
  addDays,
  format,
  getMonth,
  getYear,
  set,
  setMonth,
  setYear,
} from "date-fns";
import { cn } from "@/lib/utils"; // Adjust the import path as necessary
import { FormControl } from "@/components/ui/form"; // Adjust the import path as necessary
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const DatePicker = React.forwardRef(
  (
    { className, value, onChange, startYear, endYear, disabled, ...props },
    ref
  ) => {
    const [date, setDate] = React.useState(new Date(value || new Date()));

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    startYear = startYear || new Date().getFullYear() - 100;
    endYear = endYear || new Date().getFullYear();

    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );

    const handleMonthChange = (month) => {
      const newDate = setMonth(date, months.indexOf(month));
      setDate(newDate);
      onChange(newDate.toISOString().split("T")[0]); // Update parent component
    };

    const handleYearChange = (year) => {
      const newDate = setYear(date, parseInt(year));
      setDate(newDate);
      onChange(newDate.toISOString().split("T")[0]); // Update parent component
    };

    const handleSelect = (selectedData) => {
      if (selectedData) {
        const adjustedDate = addDays(selectedData, 1);
        setDate(adjustedDate);
        onChange(adjustedDate.toISOString().split("T")[0]); // Update parent component
      }
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "pl-3 text-left font-normal",
                !value && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              {value ? format(new Date(value), "PPP") : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-white border rounded-md p-2"
          align="start"
        >
          <div className="flex justify-between">
            <Select
              onValueChange={handleMonthChange}
              value={months[getMonth(date)]}
            >
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={handleYearChange}
              value={getYear(date).toString()}
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={value ? new Date(value) : null}
            onSelect={handleSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            month={date}
            onMonthChange={setDate}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };

DatePicker.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  startYear: PropTypes.number,
  endYear: PropTypes.number,
};

"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TeacherComboboxProps {
  teachers: any[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function TeacherCombobox({ teachers, value, onValueChange, placeholder = "Pilih guru...", disabled = false, className }: TeacherComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredTeachers = React.useMemo(() => {
    if (!searchTerm) return teachers;

    return teachers.filter((teacher) => teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) || teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teachers, searchTerm]);

  const selectedTeacher = React.useMemo(() => {
    if (!value) return null;
    return teachers.find((teacher) => teacher.id === value) || null;
  }, [teachers, value]);

  const handleSelect = (teacher: any) => {
    onValueChange(teacher.id);
    setOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onValueChange("");
    setSearchTerm("");
  };

  React.useEffect(() => {
    if (open) {
      setSearchTerm("");
    }
  }, [open]);

  React.useEffect(() => {
    if (value && !teachers.some((teacher) => teacher.id === value)) {
      onValueChange("");
    }
  }, [value, teachers, onValueChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-auto min-h-10 px-3 py-2", !selectedTeacher && "text-muted-foreground", className)} disabled={disabled}>
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            {selectedTeacher ? (
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="font-medium truncate w-full">{selectedTeacher.name}</span>
                <span className="text-xs text-muted-foreground truncate w-full">{selectedTeacher.position}</span>
              </div>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {selectedTeacher && !disabled && <X className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer" onClick={handleClear} />}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <CommandInput
              placeholder="Cari nama guru..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandEmpty className="py-6 text-center text-sm">{searchTerm ? "Tidak ada guru yang ditemukan" : "Tidak ada data guru"}</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {filteredTeachers.map((teacher) => (
              <CommandItem key={teacher.id} value={teacher.name} onSelect={() => handleSelect(teacher)} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{teacher.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{teacher.position}</span>
                  </div>
                  <Check className={cn("ml-2 h-4 w-4", value === teacher.id ? "opacity-100" : "opacity-0")} />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

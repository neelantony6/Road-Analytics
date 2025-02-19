import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StateFilterProps {
  states: string[];
  selectedState: string | null;
  onStateChange: (state: string | null) => void;
}

export default function StateFilter({ states, selectedState, onStateChange }: StateFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium">Filter by State:</label>
      <Select
        value={selectedState || "all"}
        onValueChange={(value) => onStateChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {states.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type RadioOptionsProps = {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
  value: string;
};
export function RadioOptions(props: RadioOptionsProps) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <Label>{props.label}</Label>
      <RadioGroup
        className="flex gap-2"
        value={props.value}
        onValueChange={props.onChange}
      >
        {props.options.map((option) => (
          <Label
            key={option}
            htmlFor={option}
            className="flex items-center gap-2 font-normal"
          >
            <RadioGroupItem value={option} id={option} className="bg-white" />
            {option}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

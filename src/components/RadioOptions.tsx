import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type RadioOptionsProps = {
  label: string;
  options: string[];
  onChange?: (value: string) => void;
  value: string;
  selectedOptions: Record<string, string>;
};
export function RadioOptions(props: RadioOptionsProps) {
  console.log(props.value, props.selectedOptions);

  return (
    <div className="w-full">
      <Label className="mb-3 text-lg font-semibold">{props.label}</Label>
      <div className="grid w-full grid-cols-[80px_1fr] gap-4">
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
              <RadioGroupItem
                value={option}
                id={option}
                className="bg-white"
                disabled={
                  props.label === "Season" &&
                  props.selectedOptions["Location"] === "Photo studio"
                }
              />
              {option}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

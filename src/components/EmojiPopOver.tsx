import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

interface EmojiPopOverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

export const EmojiPopOver = ({
  children,
  hint = "Emoji",
  onEmojiSelect,
}: EmojiPopOverProps) => {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [toolTipOpen, setToolTipOpen] = useState(false);
  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopOverOpen(false);
    setTimeout(() => {
      setToolTipOpen(false);
    }, 500);
  };
  return (
    <TooltipProvider>
      <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
        <Tooltip
          open={toolTipOpen}
          onOpenChange={setToolTipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="bg-black text-white border border-white/5">
            <p className="font-medium text-xs">{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="p-0 w-full border-none shadow-none">
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

import { Button } from "@/components/ui/button";
import { useWorkSpaceId } from "@/hooks/useWorkSpaceId";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

const sideBarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
      size: {},
      defaultVariant: {
        variant: "default",
      },
    },
  }
);

// creating diff versions of IdeBar Item

interface SideBarItemProps {
  label: string;
  icon: LucideIcon | IconType;
  id: string;
  variant?: VariantProps<typeof sideBarItemVariants>["variant"];
}

export const SideBarItem = ({
  label,
  icon: Icon,
  id,
  variant,
}: SideBarItemProps) => {
  const workspaceId = useWorkSpaceId();

  return (
    <Button
      variant={"transparent"}
      size={"sm"}
      asChild
      className={cn(sideBarItemVariants({ variant }))}
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-3.5 mr-1 shrink-0" />
        <span className="text-sm truncate">{label}</span>
      </Link>
    </Button>
  );
};

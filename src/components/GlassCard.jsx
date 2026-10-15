import { cn } from "@/lib/utils";

const GlassCard = ({ as: Tag = "div", className, interactive = false, children, ...rest }) => {
  return (
    <Tag className={cn("glass p-5 sm:p-6", interactive && "lift", className)} {...rest}>
      {children}
    </Tag>
  );
};

export default GlassCard;

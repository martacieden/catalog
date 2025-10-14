import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /**
   * Icon to display (Lucide icon component)
   */
  icon?: LucideIcon
  /**
   * Main title text
   */
  title: string
  /**
   * Optional description text
   */
  description?: string
  /**
   * Optional action button or custom content
   */
  action?: React.ReactNode
  /**
   * Size variant
   * @default "default"
   */
  size?: "sm" | "default" | "lg"
  /**
   * Additional className for custom styling
   */
  className?: string
}

const sizeConfig = {
  sm: {
    container: "py-6",
    icon: "h-8 w-8 mb-2",
    title: "text-sm font-medium",
    description: "text-xs",
  },
  default: {
    container: "py-8",
    icon: "h-12 w-12 mb-3",
    title: "text-base font-semibold",
    description: "text-sm",
  },
  lg: {
    container: "py-12",
    icon: "h-16 w-16 mb-4",
    title: "text-lg font-semibold",
    description: "text-base",
  },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size = "default",
  className,
}: EmptyStateProps) {
  const config = sizeConfig[size]

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        config.container,
        className
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            config.icon,
            "text-muted-foreground/50"
          )}
        />
      )}
      
      <h3 className={cn(config.title, "text-muted-foreground mb-1")}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(config.description, "text-muted-foreground/70 max-w-sm")}>
          {description}
        </p>
      )}
      
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}








import React from "react";
import { User } from "@/types";
import { cn } from "@/lib/utils";
import { User as UserIcon } from "lucide-react";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  };

  if (!user || !user.avatar_type) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-secondary text-secondary-foreground",
          sizeClasses[size],
          className
        )}
      >
        <UserIcon size={size === "sm" ? 16 : size === "md" ? 20 : 24} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-secondary text-secondary-foreground",
        sizeClasses[size],
        className
      )}
    >
      <span role="img" aria-label={user.name}>
        {user.avatar_type}
      </span>
    </div>
  );
};

export default UserAvatar;

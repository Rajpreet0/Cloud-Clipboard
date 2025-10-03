import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    description?: string;
    actionText?: string;
    onActionClick?: () => void;
    children?: ReactNode;
    footer?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({
  title,
  description,
  actionText,
  onActionClick,
  children,
  footer,
}) => {
  return (
    <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-xl bg-white/90 backdrop-blur-lg rounded-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-gray-800 md:text-3xl">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-600">
            {description}
          </CardDescription>
        )}
        {actionText && (
          <CardAction>
            <p
              onClick={onActionClick}
              className="text-sm text-black/60 cursor-pointer hover:underline"
            >
              {actionText}
            </p>
          </CardAction>
        )}
      </CardHeader>

      {children && <CardContent className="px-4 sm:px-8">{children}</CardContent>}

      {footer && <CardFooter className="px-4 sm:px-8 flex flex-col space-y-4">{footer}</CardFooter>}
    </Card>
  );
}

export default AuthCard
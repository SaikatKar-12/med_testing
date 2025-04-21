import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

// Removed the type alias: type ToasterProps = React.ComponentProps<typeof Sonner>

// Removed the type annotation (: ToasterProps) from props
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      // Removed the 'as' type assertion
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

// The toast export remains the same as it's a function export from sonner
export { Toaster, toast };
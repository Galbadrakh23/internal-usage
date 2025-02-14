import type React from "react";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

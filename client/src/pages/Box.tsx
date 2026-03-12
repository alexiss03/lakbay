import React from "react";

export const Box = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen view-shell flex items-center justify-center">
      <div className="fixed inset-0 view-shell -z-10" />
      <div className="text-center p-8">
        <h1 className="prada-heading text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Application
        </h1>
        <p className="text-lg text-gray-600">
          Project successfully migrated to Replit!
        </p>
      </div>
    </div>
  );
};

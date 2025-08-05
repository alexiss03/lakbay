import React from "react";

export const Box = (): JSX.Element => {
  return (
    <div className="w-full min-h-screen bg-[#f3f1ec] flex items-center justify-center">
      <div className="fixed inset-0 bg-[#f3f1ec] -z-10" />
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Application
        </h1>
        <p className="text-lg text-gray-600">
          Project successfully migrated to Replit!
        </p>
      </div>
    </div>
  );
};

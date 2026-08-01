import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-2xl animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border rounded-2xl p-6 animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-6"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded flex-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="bg-white dark:bg-dark-card border border-gray-150 dark:border-dark-border p-6 rounded-2xl animate-pulse space-y-4 h-64 flex flex-col justify-between">
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
      <div className="flex-1 flex items-end space-x-4 px-4 pt-4">
        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-1/3"></div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-2/3"></div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-1/2"></div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-5/6"></div>
        <div className="bg-gray-200 dark:bg-gray-800 rounded w-full h-3/4"></div>
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl col-span-2"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
      </div>
    </div>
  );
};

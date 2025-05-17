import React from "react";

const FeatureCard = ({ icon: Icon, title, description, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;

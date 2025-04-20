import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeClasses = 'px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  switch (status) {
    case 'success':
      badgeClasses += ' bg-green-100 text-green-800';
      status = 'Successful';
      break;
    case 'paid':
      badgeClasses += ' bg-green-100 text-green-800';
      status = 'Paid';
      break;
    case 'initiated':
      badgeClasses += ' bg-yellow-100 text-yellow-800';
      status = 'Initiated';
      break;
    case 'pending':
      badgeClasses += ' bg-yellow-100 text-yellow-800';
      status = 'Pending';
      break;
    case 'failed':
      badgeClasses += ' bg-red-100 text-red-800';
      status = 'Failed';
      break;
    case 'error':
      badgeClasses += ' bg-red-100 text-red-800';
      status = 'Error';
      break;
    default:
      badgeClasses += ' bg-gray-100 text-gray-800';
      status = status || 'Unknown';
  }
  
  return (
    <span className={badgeClasses}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
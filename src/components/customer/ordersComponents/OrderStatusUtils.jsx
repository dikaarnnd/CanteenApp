export const getStatusText = (status) => {
  switch (status) {
    case 'queue': return 'In Queue';
    case 'process': return 'Being Prepared';
    case 'ready': return 'Ready for Pickup';
    case 'npaid': return 'Ready (Unpaid)';
    case 'paid': return 'Completed';
    case 'cancel': return 'Cancelled';
    default: return 'Unknown Status';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'queue': return 'bg-yellow-100 text-yellow-800';
    case 'process': return 'bg-orange-100 text-orange-800';
    case 'ready': return 'bg-green-100 text-green-800';
    case 'npaid': return 'bg-blue-100 text-blue-800';
    case 'paid': return 'bg-gray-100 text-gray-800';
    case 'cancel': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
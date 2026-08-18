export default function StatusBadge({ status }) {
  let colorClass = 'bg-gray-100 text-gray-800';

  const normalizedStatus = (status || '').toString().toLowerCase();

  switch (normalizedStatus) {
    case 'approved':
    case 'confirmed':
    case 'completed':
    case 'active':
    case 'success':
    case 'true':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'pending':
    case 'processing':
    case 'waiting':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'rejected':
    case 'cancelled':
    case 'failed':
    case 'inactive':
    case 'false':
      colorClass = 'bg-red-100 text-red-800';
      break;
  }

  // Format the text nice (e.g. true -> Active, false -> Inactive if it's a boolean)
  let displayStatus = status;
  if (status === true) displayStatus = 'Yes';
  if (status === false) displayStatus = 'No';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {displayStatus}
    </span>
  );
}

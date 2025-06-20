// filepath: d:\UPJ\Semester 6\RPL\Kanteen\CanteenApp\src\pages\Customer\RestoPage.jsx
import { useParams } from 'react-router-dom';

export default function RestoPage() {
  const { id } = useParams(); // Get the dynamic id from the URL

  // Example data for restaurants
  const restoData = {
    1: { name: 'Resto A', description: 'Delicious food at Resto A.' },
    2: { name: 'Resto B', description: 'Enjoy meals at Resto B.' },
    3: { name: 'Resto C', description: 'Tasty dishes at Resto C.' },
    4: { name: 'Resto D', description: 'Great dining at Resto D.' },
  };

  const resto = restoData[id]; // Fetch data based on the id

  if (!resto) {
    return <h1>Restaurant not found</h1>;
  }

  return (
    <div className="p-4 text-center bg-[#FFFDED] min-h-screen">
      <h1 className="text-2xl font-bold">{resto.name}</h1>
      <p className="mt-4">{resto.description}</p>
    </div>
  );
}
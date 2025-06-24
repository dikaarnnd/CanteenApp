import TopBar from '@/components/TopBar'
import Pendapatan from '@/components/Pendapatan'
import HighRating from '@/components/HighRating'
import PieChart from '../../components/PieChart'
import LineChart from '../../components/LineChart'
import Pesanan from '../../components/Pesanan'

export default function HomeSlr() {
  const sellerId = localStorage.getItem('seller_id')
    if (!sellerId) {
      console.warn('seller_id tidak ditemukan')
      setLoading(false)
      return
    }
  return (
    <div className='flex flex-col text-[#FFFDED] bg-[#FFFDED]'>
      {/* Top Bar */}
      <TopBar />

      {/* Main Dashboard */}
      <div className='flex flex-col w-full gap-2 p-4 h-full lg:flex-row lg:h-screen'>
        
        {/* Kiri: Pendapatan, Pie Chart, Line Chart, High Rating */}
        <div className='flex flex-col gap-2 w-full lg:w-1/2 '>

          {/* Atas: Pendapatan + Pie Chart + Rating */}
          <div className='flex flex-col gap-2 md:flex-row'>

            {/* Pendapatan + Pie Chart */}
            <div className='flex flex-col gap-2 md:w-1/2 lg:w-2/5'>

              {/* Total Pendapatan */}
              <section className='min-h-24 flex flex-col bg-[#3A4D39] justify-center items-center rounded-xl shadow-md'>
                <h2 className='text-center text-[#FFFDED] font-bold text-md'>Pendapatan Anda hari ini:</h2>
                <Pendapatan sellerId={sellerId} />
              </section>

              {/* Pie Chart */}
              <section className='flex justify-center items-center min-h-48 border-2 border-black rounded-xl shadow-md flex-grow'>
                <PieChart sellerId={sellerId} filterTodayOnly={true} />
              </section>
            </div>

            {/* Rating Tertinggi */}
            <section className='flex flex-col border-2 border-black rounded-xl shadow-md min-h-72 flex-grow lg:w-3/5'>
              <div>
                <h2 className="text-xl text-center font-bold my-3 text-[#3A4D39]">Rating Tertinggi</h2>
              </div>
              <div className='flex-grow overflow-y-auto'>
                <HighRating sellerId={sellerId} />
              </div>
            </section>
          </div>

          {/* Line Chart */}
          <div className='border-2 border-black rounded-xl shadow-md h-72 lg:h-full'>
            <LineChart sellerId={sellerId} />
          </div>
        </div>

        {/* Kanan: Pesanan */}
        <div className='flex flex-col border-2 border-black rounded-xl shadow-md min-h-24 w-full lg:w-1/2'>
          <div>
            <h2 className="text-xl text-center font-bold my-3 text-[#3A4D39]">Pesanan</h2>
          </div>
          <div className='flex-grow overflow-hidden'>
            <Pesanan sellerId={sellerId} />
          </div>
        </div>
      </div>
    </div>
  )
}

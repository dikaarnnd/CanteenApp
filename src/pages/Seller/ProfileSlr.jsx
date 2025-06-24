import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/supabaseClient';
import TopBar from '@/components/TopBar'
import Camera from '@/assets/camera.png' 

export default function ProfileSlr() {
  const navigate = useNavigate()
  const [seller, setSeller] = useState({ nama: '', nama_kantin: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const sellerId = localStorage.getItem('seller_id');
  if (!sellerId) {
    console.warn('seller_id tidak ditemukan')
    setLoading(false)
    return
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('seller')
        .select('*')
        .eq('id', sellerId)
        .single();
      if (data) setSeller(data);
    };
    fetchData();
  }, [sellerId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setSeller({ ...seller, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    let uploadedUrl = seller.image_url;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${sellerId}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('sellerproductpict')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: true });

      if (error) {
        console.error('Upload error:', error.message);
        return;
      }

      const { data: publicUrl } = supabase
        .storage
        .from('sellerproductpict')
        .getPublicUrl(fileName);

      uploadedUrl = publicUrl.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('seller')
      .update({
        nama: seller.nama,
        nama_kantin: seller.nama_kantin,
        image_url: uploadedUrl,
      })
      .eq('id', sellerId);

    if (updateError) {
      alert('Gagal menyimpan perubahan');
    } else {
      alert('Perubahan berhasil disimpan');
    }
  };
  
  const handleLogout = () => {
    // Hapus session/login state jika kamu menyimpannya
    localStorage.clear()
    // Redirect ke halaman login
    navigate('/loginslr')
  }
  return (
    <div className=" bg-[#FFFDED]">
      <TopBar />
      
      {/* Main Content */}
      <main className="flex-grow p-4 text-black h-full">
        <div className="flex flex-col-reverse lg:flex-row lg:h-screen gap-4">
          
          {/* Sidebar Kiri */}
          <div className="w-full lg:w-1/3 flex flex-col items-center">
            <label className='cursor-pointer w-full'>
              <div className='flex justify-center items-center gap-2 border-dashed border-2 h-48 w-full rounded-md mb-3 shadow-md'>
                {previewUrl || seller.image_url ? (
                  <img
                    src={previewUrl || seller.image_url}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <img src={Camera} className='w-5 h-5' />
                    <span>Tambahkan foto</span>
                  </>
                )}
              </div>
              <input type="file" onChange={handleImageChange} className="hidden" />
            </label>
            
            <div className="w-full space-y-3">
              <div className="text-left">
                <label className="block text-sm font-semibold mb-1">
                  Nama Pemilik Resto<span className="text-red-500">*</span>
                </label>
                <input
                  name="nama"
                  type="text"
                  value={seller.nama}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-semibold mb-1">
                  Nama Resto<span className="text-red-500">*</span>
                </label>
                <input
                  name="nama_kantin"
                  type="text"
                  value={seller.nama_kantin}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div >
              <button onClick={handleSave}
              className="w-full bg-[#5f6f53] text-white font-semibold py-2 rounded hover:bg-[#4d5a44] transition cursor-pointer shadow-md">
                Simpan
              </button>

            </div>

            {/* Logout di bawah sidebar */}
            <button
              onClick={handleLogout}
              className="mt-auto w-full bg-red-500 text-white font-semibold py-2 rounded hover:bg-red-600 transition cursor-pointer shadow-md"
            >
              Logout
            </button>
          </div>

          {/* Area Konten Kanan */}
          <div className="w-full lg:w-2/3 bg-[#fefcea] border rounded-md min-h-[400px]"></div>
        </div>
      </main>
    </div>
  )
}

// FormUploadSeller.js
// import React, { useState } from 'react';
// import { supabase } from '@/supabaseClient';

// export default function FormUploadSeller() {
//   const [nama, setNama] = useState('');
//   const [namaKantin, setNamaKantin] = useState('');
//   const [imageFile, setImageFile] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 1. Upload gambar ke storage
//     let imageUrl = '';
//     if (imageFile) {
//       const fileExt = imageFile.name.split('.').pop();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const { data, error: uploadError } = await supabase.storage
//         .from('productpict') // nama bucket
//         .upload(fileName, imageFile);

//       if (uploadError) {
//         console.error('Upload error:', uploadError.message);
//         return;
//       }

//       const { data: publicData } = supabase.storage
//         .from('productpict')
//         .getPublicUrl(fileName);

//       imageUrl = publicData.publicUrl;
//     }

//     // 2. Insert ke tabel seller
//     const { error: insertError } = await supabase
//       .from('seller')
//       .insert([{ nama, nama_kantin: namaKantin, image_url: imageUrl }]);

//     if (insertError) {
//       console.error('Insert error:', insertError.message);
//       alert('Gagal menyimpan data.');
//     } else {
//       alert('Data berhasil disimpan!');
//       setNama('');
//       setNamaKantin('');
//       setImageFile(null);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4">
//       <div>
//         <label>Nama Pemilik:</label>
//         <input
//           type="text"
//           value={nama}
//           onChange={(e) => setNama(e.target.value)}
//           className="border px-2 py-1 w-full"
//           required
//         />
//       </div>
//       <div>
//         <label>Nama Resto:</label>
//         <input
//           type="text"
//           value={namaKantin}
//           onChange={(e) => setNamaKantin(e.target.value)}
//           className="border px-2 py-1 w-full"
//         />
//       </div>
//       <div>
//         <label>Upload Gambar:</label>
//         <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
//       </div>
//       <button
//         type="submit"
//         className="bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Simpan
//       </button>
//     </form>
//   );
// }

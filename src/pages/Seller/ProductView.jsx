import { FiPlus } from "react-icons/fi";
import { TbCameraPlus } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";

import { useRef, useState, useEffect } from "react";

import { supabase } from "@/supabaseClient";

import TopBar from "@/components/TopBar";

export default function ProductView() {
  const dialogRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Get Seller ID
  const sellerId = localStorage.getItem('seller_id')
    if (!sellerId) {
      console.warn('seller_id tidak ditemukan')
      setLoading(false)
      return
    }

  // GET DATA
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("product")
        .select("*")
        .eq("seller_id", parseInt(sellerId))
        .order("id", { ascending: true });

      if (error) {
        setError("Gagal fetch data: " + error.message);
      } else {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  function openModal() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }

  function closeModal() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  function handleToggleVisbility(id, checked) {
    if (checked) {
      setHiddenIds((prev) => prev.filter((hiddenId) => hiddenId !== id));
    } else {
      setHiddenIds((prev) => [...prev, id]);
    }
  }

  // POST DATA
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const image = formData.get("image");
    const name = formData.get("name");
    const price = formData.get("price");
    const desk = formData.get("desk");
    const sellerId = localStorage.getItem('seller_id');

    console.log({
      image,
      name,
      price,
      desk,
      sellerId,
    });

    if (!image || !image.name) {
      alert("Harap pilih gambar!");
      return;
    }
    if (!sellerId) {
    alert("Seller ID tidak ditemukan. Harap login ulang.");
    return;
    }

    try {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("productpict")
        .upload(filePath, image);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("productpict")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const { error } = await supabase.from("product").insert([
        {
          name,
          price,
          desk,
          img_url: imageUrl,
          seller_id: parseInt(sellerId),
        },
      ]);

      if (error) {
        throw error;
      }

      alert("Produk berhasil ditambahkan!");
      closeModal();
    } catch (err) {
      alert("Gagal Upload: " + err.message);
    }
  }

  return (
    <div className='w-screen h-screen bg-[#FFFDED]'>
      {loading && <p>Loading...</p>}
      {error && <p className='text-red-500'>{error}</p>}

      {/* Top Bar */}
      <TopBar />

      {/* Main Dashboard */}
      <div className='absolute top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center'>
        <div className='flex flex-row gap-4'>
          <div>
            <button
              onClick={openModal}
              className='cursor-pointer flex items-center gap-2 px-10 py-4 bg-[#9DA588] hover:bg-[#3A4D39] text-[#FFFDED] rounded-xl'
            >
              <FiPlus size={20} />
              <span>Tambah Menu</span>
            </button>
            <div className='flex flex-col border-2 border-[#9BA38D] w-80 p-4 rounded-xl mt-5 overflow-y-scroll h-96 '>
              <ul>
                {products.map((product) => (
                  <li key={product.id} className='mb-1'>
                    <div className='flex flex-row bg-[#9BA38D] rounded-xl border-0 w-[250px]'>
                      <div>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className='h-20 w-25 rounded-l-2xl border-0'
                        />
                      </div>
                      <div className='flex items-center justify-items-start p-2 w-28'>
                        <p className='text-sm text-[#3A4D39] font-medium'>
                          {product.name}
                        </p>
                      </div>
                      <div className='flex items-center justify-start pr-4 space-x-2 w-14'>
                        <input
                          type='checkbox'
                          defaultChecked
                          onChange={(e) => {
                            handleToggleVisbility(product.id, e.target.checked);
                          }}
                          className='toggle bg-[#FFFDED] text-gray-400 checked:bg-[#3A4D39] border-0'
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='w-[55rem] border-2 border-[#9BA38D] rounded-xl h-[29rem] overflow-y-scroll'>
            <ul className='flex flex-col gap-3 mt-5'>
              {products
                .filter((product) => !hiddenIds.includes(product.id))
                .map((product) => (
                  <li key={product.id} className=' ml-5'>
                    <div className='bg-[#9BA38D] w-[52rem] h-36 rounded-md flex flex-row'>
                      <div className='w-[12rem] rounded-l-md'>
                        <img src={product.image_url} alt={product.name} />
                      </div>
                      <div className='w-[30rem]  m-4'>
                        <h1 className='text-xl text-[#3A4D39] font-bold'>
                          {product.name}
                        </h1>
                        <p className='text-sm mt-2'>{product.desk}</p>
                      </div>
                      <div className='flex flex-col justify-center items-center w-[10rem]  gap-8'>
                        <div>
                          <p className='text-xl text-[#3A4D39] font-bold'>
                            Rp.{product.price}
                          </p>
                        </div>
                        <div className='flex flex-row gap-7'>
                          <button className='cursor-pointer'>
                            <FaTrash className='text-2xl text-black' />
                          </button>
                          <button className='cursor-pointer'>
                            <FaRegEdit className='text-2xl text-black' />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog
        ref={dialogRef}
        className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl border border-gray-300 shadow-lg w-[700px] max-w-full bg-[#FFFFFF]'
      >
        <form onSubmit={handleSubmit}>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-xl font-semibold text-black'>
              Tambah / Edit Menu
            </h1>
            <button onClick={closeModal}>
              <IoClose className='text-black text-3xl cursor-pointer' />
            </button>
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col items-center justify-center border border-dashed border-black rounded-lg aspect-square cursor-pointer text-center text-sm relative'>
              <input
                type='file'
                id='image'
                name='image'
                accept='image/*'
                required
                className='absolute inset-0 opacity-0 cursor-pointer'
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setPreviewImage(imageUrl);
                  }
                }}
              />
              {previewImage ? (
                <img
                  src={previewImage}
                  alt='Preview'
                  className='w-full h-full object-cover rounded-lg'
                />
              ) : (
                <>
                  <label
                    htmlFor='image'
                    className='flex flex-col items-center justify-center w-full h-full cursor-pointer'
                  >
                    <span className='text-2xl mb-2'>
                      <TbCameraPlus className='text-black' />
                    </span>
                    <span className='font-medium text-black'>
                      Tambahkan foto<span className='text-red-500'>*</span>
                    </span>
                  </label>
                </>
              )}
            </div>

            <div className='flex flex-col gap-6'>
              <div className='flex flex-col'>
                <label htmlFor='name' className='font-medium text-black mb-1'>
                  Nama<span className='text-red-500'>*</span>
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='off'
                  spellCheck={false}
                  required
                  maxLength='45'
                  placeholder='Masukkan nama produk'
                  className='text-black placeholder:text-[#cccccc] border border-black rounded px-3 py-2 focus:border-black focus:ring-0 focus:outline-none'
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='price' className='font-medium text-black mb-1'>
                  Harga<span className='text-red-500'>*</span>
                </label>
                <input
                  id='price'
                  name='price'
                  type='number'
                  min={0}
                  max={99999}
                  autoComplete='off'
                  required
                  placeholder='Masukkan harganya'
                  className='text-black placeholder:text-[#cccccc] border border-black rounded px-3 py-2 focus:border-black focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='desk' className='font-medium text-black mb-1'>
                  Deskripsi
                </label>
                <textarea
                  id='desk'
                  name='desk'
                  spellCheck={false}
                  autoComplete='off'
                  maxLength='45'
                  placeholder='Masukkan deskripsi'
                  className='text-black placeholder:text-[#cccccc] border border-black rounded px-3 py-[12px] resize-none focus:border-black focus:ring-0 focus:outline-none'
                  rows={3}
                ></textarea>
              </div>
            </div>
          </div>

          <div className='mt-6 flex justify-center'>
            <button
              type='submit'
              className='bg-[#9DA588] hover:bg-[#3A4D39] cursor-pointer text-white px-36 py-2.5 rounded-lg text-lg font-medium'
            >
              Simpan
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}

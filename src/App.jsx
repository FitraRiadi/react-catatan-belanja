import { useState } from "react";

import { Document, Page, Text,View, PDFDownloadLink } from '@react-pdf/renderer';

const MyDoc = ({items}) => (
  <Document>
    <Page>
      <View style={{marginTop:"30px"}}>
        <Text style={{textAlign:"center", fontWeight:"bold", fontSize:"20"}}>DAFTAR BELANJA</Text>
        <Text style={{textAlign:"center"}}>Tanggal : {new Date().toLocaleDateString()}</Text>
      </View>
      <View style={{marginLeft:"30px"}}>
        <Text style={{marginTop:"20px",marginBottom:"25px"}}>Kamu Ada {items.length} List Belanjaan!</Text>
        {
        items.map((item) => (
          <Text>- {item.quantity} {item.name}</Text>
        ))
        }
      </View>
    </Page>
  </Document>
);


export default function App() {
  const [items,setItems] = useState([]);

  function handleItems(nextItem){
    setItems(nextItem);
  }

  const calculateProgress = () => {
    return  [...items].filter(item => item.checked).length + "/" + items.length
  }



  return (
    <div className="app">
      <Header />
      <FormBelanja handleItems={handleItems} items={items}/>
      <GroceryList handleItems={handleItems} items={items} />
      <Footer items={items} message={items.length > 0 ? "Total List Yang Diselesaikan " + calculateProgress() : "Belum Ada Yg Bisa Dilakuin! Tambahin List nya!" } />
    </div>
  );
}


function Header(){
  return (
    <h1>Catatan Belanjaku 📝</h1>
  )
}

function FormBelanja({handleItems, items}){
  const [name,setName] = useState('');
  const [quantity,setQuantity] = useState(1);
  
  
  function handleSubmit(e){
    e.preventDefault();
    alert("Nama Barang : " + name + " - Jumlah : " + quantity);
    const newItem = items.slice();
    newItem.push({id: new Date(), name:name, quantity:quantity, checked:false});
    handleItems(newItem);
    
  }
  console.log(items);
  const quantityNum = Array(10).fill(undefined).map((_,i) => (
    <option value={i+1} key={i+1}  >{i+1}</option>
  ));

  return (
    <form className="add-form" onSubmit={handleSubmit}>
        <h3>Hari ini belanja apa kita?</h3>
        <div>
          <select onChange={(e) => setQuantity(e.target.value)}>
            {quantityNum}
          </select>
          <input type="text" placeholder="nama barang..." value={name}  onChange={(e) => setName(e.target.value)} />
        </div>
        <button>Tambah</button>
      </form>
  )
}

function GroceryList ({ handleItems ,items }){
  const [sortItem,setSortItem] = useState('input');
  let listItems = [];

  if (sortItem === "input"){
    listItems = items.slice().sort((a,b) => new Date(a.id) - new Date(b.id));
  } else if (sortItem === "name"){
    listItems = items.slice().sort((a,b) => a.name.localeCompare(b.name));
  } else if (sortItem === "checked"){
    listItems = items.slice().sort((a,b) => Number(a.checked) - Number(b.checked));
  }

  

  function handleCheck(index){
    const updateItem = listItems.slice();
    updateItem[index].checked = !updateItem[index].checked;
    handleItems(updateItem);
  }

  function handleDelete(index){
    if (!confirm('Hapus List ini dari Daftar?')) return;
    const updateItem = listItems.slice();
    updateItem.splice(index,1);
    handleItems(updateItem);
  }

  function deleteAll(){
    if (!confirm('Hapus Semua Daftar?')) return;
    handleItems([]);
  }

  function handleSort(type){
    setSortItem(type);
  }


  return (
    <>
      <div className="list">
        <ul>
          {listItems.map((item,i) => {
            return <Item handleDelete={handleDelete} handleCheck={handleCheck} item={item} index={i} key={item.id} />
          })}
        </ul>
      </div>
      <div className="actions">
        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="input">Urutkan berdasarkan urutan input</option>
          <option value="name">Urutkan berdasarkan nama barang</option>
          <option value="checked">Urutkan berdasarkan ceklis</option>
        </select>
        <button onClick={deleteAll}>Bersihkan Daftar</button>
      </div>
    </>
  )
}



function Item({handleDelete, handleCheck,item,index}){
  return (
    <li>
        <input type="checkbox" onClick={() => handleCheck(index)}   />
        <span style={ item.checked ? { textDecoration:'line-through' } : {}}>{item.quantity} {item.name}</span>
        <button onClick={() => handleDelete(index)}>&times;</button>
    </li>
  )
}



function Footer({items, message}){
  const downloadFiture = () => { 
      return <PDFDownloadLink document={<MyDoc items={items}/>} fileName="daftar-belanja.pdf">
        {({ loading }) => (
          loading ? 'Menyiapkan' : <button style={{marginLeft:"20px", cursor: "pointer"}}>Cetak Daftar Ke Pdf</button>
        )}
      </PDFDownloadLink>
  }
  
  return (
    <footer className="stats">
      {message}
      {items.length > 0 ? downloadFiture() : ' ' }
    </footer>
  )
}
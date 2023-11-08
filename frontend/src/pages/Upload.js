import React, { useState, useEffect } from 'react';
import * as S from './upload.ts'
function ImageForm() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [color, setColor] = useState('');
  const [resultImage, setResultImage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);
    formData.append('color', color);

    try {
      const response = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        body: formData,
        mode: "no-cors",
      });

      if (response.ok) {
        const result = await response.blob(); // Gelen görüntüyü al
        setResultImage(URL.createObjectURL(result));
      } else {
        console.error('Sunucu yanıt hatası:', response.statusText);
      }
    } catch (error) {
      console.error('Hata:', error);
    }
  };

//    useEffect(() => {
//    // İmajın URL'sini burada ayarlayabilirsiniz. Örneğin bir API'den veya başka bir kaynaktan alınan URL'yi kullanabilirsiniz.
//    console.log(resultImage)
//    const imageURL = resultImage;
//
//    // İmajın URL'sini state'e ayarlayın.
//    setResultImage(imageURL);
//  }, [resultImage]);

  return (
    <S.Container>
      <h2>Image Form</h2>
      <form onSubmit={handleSubmit} style={{background: 'white'}} >
        <div>
          <label>Görüntü Seç:</label>
          <input type="file" accept="image/*" onChange={handleImageChange}required/>
        </div>
        <div>
          <label>Prompt Metni:</label>
          <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} autoComplete="on" required />
        </div>
        <div>
          <label>Metin Rengi:</label>
          <input type="text" value={color} onChange={(e) => setColor(e.target.value)} autoComplete="on" required/>
        </div>
        <button type="submit">Gönder</button>
      </form>

      <S.Card>
        <img src={resultImage} alt='Icone adicionar' />


      </S.Card>


    </S.Container>

  );
}

export default ImageForm;



function ImageDisplay({ imageBase64 }) {
  return (
    <div>
      {imageBase64 && (
        <img
          src={'data:image/png;base64,${imageBase64}'} // Image verisi burada kullanılıyor
          alt="Resim"
        />
      )}
    </div>
  );
}
